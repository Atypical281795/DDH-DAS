import os
import subprocess
import json
import sys

def activate_environment():
    # 在此處替換為您的環境名稱
    env_name = "test"
    command = f"activate {env_name}"
    subprocess.call(command, shell=True)

if __name__ == "__main__":
    activate_environment()
    print(json.dumps({"success": True}))
