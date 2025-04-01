import os
import subprocess
import paramiko
import sys

# Configuration
SERVER = "aptitude.cse.buffalo.edu"  
USERNAME = input("Enter username: ")
PASSWORD = input("Enter password: ")

# Local paths
ROOT_DIR = os.getcwd()  # current (root) directory
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
BUILD_DIR = os.path.join(FRONTEND_DIR, "build")

# Remote paths
REMOTE_ROOT = "/data/web/CSE442/2025-Spring/cse-442ah/"
REMOTE_STATIC = "/data/web/CSE442/2025-Spring/cse-442ah/static"

def run_build():
    """Change to the frontend directory and run the npm build."""
    print("Changing directory to:", FRONTEND_DIR)
    os.chdir(FRONTEND_DIR)
    
    print("Running npm run build...")
    # You might need to use "npm.cmd" on Windows. /////////IMPORTANT
    result = subprocess.run(["npm.cmd", "run", "build"], capture_output=True, text=True)
    if result.returncode != 0:
        print("Build failed with error:")
        print(result.stderr)
        sys.exit(1)
    print("Build succeeded.")

def sftp_upload_file(sftp, local_path, remote_path):
    """Upload a single file via SFTP."""
    print(f"Uploading file {local_path} to {remote_path} ...")
    sftp.put(local_path, remote_path)

def sftp_upload_dir(sftp, local_dir, remote_dir):
    """
    Recursively upload a directory to the remote server.
    Creates remote directories as needed.
    """
    # Ensure the remote directory exists
    try:
        sftp.stat(remote_dir)
    except IOError:
        print(f"Creating remote directory: {remote_dir}")
        sftp.mkdir(remote_dir)

    for root, dirs, files in os.walk(local_dir):
        # Compute relative path and then the corresponding remote path
        rel_path = os.path.relpath(root, local_dir)
        remote_path = os.path.join(remote_dir, rel_path).replace("\\", "/")
        try:
            sftp.stat(remote_path)
        except IOError:
            print(f"Creating remote directory: {remote_path}")
            sftp.mkdir(remote_path)
        for file in files:
            local_file = os.path.join(root, file)
            remote_file = os.path.join(remote_path, file).replace("\\", "/")
            print(f"Uploading file {local_file} to {remote_file} ...")
            sftp.put(local_file, remote_file)

def deploy():
    # Step 1 & 2: Change to the /frontend directory and run the build
    run_build()

    # Establish SSH connection and SFTP session
    print("Connecting to remote server...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh.connect(SERVER, username=USERNAME, password=PASSWORD)
    except Exception as e:
        print(f"Failed to connect: {e}")
        sys.exit(1)
    
    sftp = ssh.open_sftp()

    try:
        # Step 4: Upload asset.manifest.json and index.html to the remote root directory
        for filename in ["asset-manifest.json", "index.html"]:
            local_file = os.path.join(BUILD_DIR, filename)
            remote_file = os.path.join(REMOTE_ROOT, filename).replace("\\", "/")
            sftp_upload_file(sftp, local_file, remote_file)

        # Step 5: Upload the css and js directories to the remote /static directory
        for folder in ["css", "js"]:
            local_folder = os.path.join(BUILD_DIR, folder)
            remote_folder = os.path.join(REMOTE_STATIC, folder).replace("\\", "/")
            sftp_upload_dir(sftp, local_folder, remote_folder)
    except Exception as e:
        print("Deployment error:", e)
    finally:
        sftp.close()
        ssh.close()
        print("Deployment complete.")

if __name__ == "__main__":
    deploy()
