import os
import socket
import time
import subprocess

import psutil

from rlbot.agents.base_independent_agent import BaseIndependentAgent
from rlbot.botmanager.helper_process_request import HelperProcessRequest
from rlbot.utils.structures import game_interface


class BaseJavaScriptAgent(BaseIndependentAgent):

    def __init__(self, name, team, index):
        super().__init__(name, team, index)
        self.port = self.read_port_from_file()
        self.is_retired = False

        try:
            subprocess.Popen([os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__), 'auto-run.bat'))])
        except Exception as e:
            self.logger.error(f"A JavaScript bot with the name of {self.name} will need to be started manually. Error when running 'auto-run.bat': {str(e)}.")

    def run_independently(self, terminate_request_event):

        while not terminate_request_event.is_set():
            message = f"add\n{self.name}\n{self.team}\n{self.index}\n{game_interface.get_dll_directory()}"

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
