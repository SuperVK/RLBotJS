import os
import socket
import time

import psutil

from rlbot.agents.base_independent_agent import BaseIndependentAgent
from rlbot.botmanager.helper_process_request import HelperProcessRequest
from rlbot.utils.structures import game_interface


class BaseDotNetAgent(BaseIndependentAgent):

    def __init__(self, name, team, index):
        super().__init__(name, team, index)
        self.port = self.read_port_from_file()
        self.is_retired = False

    def run_independently(self, terminate_request_event):

        dll_path = game_interface.get_dll_32_directory() if game_interface.is_32_bit_python() else game_interface.get_dll_directory()

        while not terminate_request_event.is_set():
            message = f"add\n{self.name}\n{self.team}\n{self.index}\n{dll_path}"
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.connect(("127.0.0.1", self.port))
                s.send(bytes(message, "ASCII"))
                s.close()
            except ConnectionRefusedError:
                self.logger.warn("Could not connect to server!")

            time.sleep(1)
        else:
            self.retire()

    def retire(self):
        port = self.read_port_from_file()
        message = f"remove\n{self.index}"

        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(("127.0.0.1", port))
            s.send(bytes(message, "ASCII"))
            s.close()
        except ConnectionRefusedError:
            self.logger.warn("Could not connect to server!")
        self.is_retired = True

    def read_port_from_file(self):
        try:
            location = self.get_port_file_path()

            with open(location, "r") as port_file:
                return int(port_file.readline().rstrip())

        except ValueError:
            self.logger.warn("Failed to parse port file!")
            raise

    def get_port_file_path(self):
        # Look for a port.cfg file in the same directory as THIS python file.
        return os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__), 'port.cfg'))
