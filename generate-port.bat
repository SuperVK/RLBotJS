@echo off

python -c "import random; import os; port = open(os.path.realpath(os.path.join(os.getcwd(), 'src', 'pythonAgent', 'port.cfg')), 'w'); port.write(str(random.randint(3000, 40000)));"
