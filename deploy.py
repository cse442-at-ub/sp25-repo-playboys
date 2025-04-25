import os
import subprocess
import paramiko
import stat

def recursive_delete(sftp, remote_path):
    """
    Recursively deletes a file or directory at remote_path.
    """
    try:
        attrs = sftp.stat(remote_path)
    except IOError:
        # Path does not exist
        return

    if stat.S_ISDIR(attrs.st_mode):
        for entry in sftp.listdir_attr(remote_path):
            child = remote_path.rstrip('/') + '/' + entry.filename
            recursive_delete(sftp, child)
        sftp.rmdir(remote_path)
    else:
        sftp.remove(remote_path)

def recursive_upload(sftp, local_path, remote_path):
    """
    Recursively uploads files and directories from local_path to remote_path using sftp.
    Creates remote directories if they do not exist.
    """
    if os.path.isdir(local_path):
        try:
            sftp.mkdir(remote_path)
        except IOError:
            pass
        for item in os.listdir(local_path):
            local_item = os.path.join(local_path, item)
            remote_item = remote_path.rstrip('/') + '/' + item
            if os.path.isdir(local_item):
                recursive_upload(sftp, local_item, remote_item)
            else:
                sftp.put(local_item, remote_item)
    else:
        sftp.put(local_path, remote_path)

def main():
    root_dir = os.getcwd()
    frontend_dir = os.path.join(root_dir, "frontend")
    os.chdir(frontend_dir)
    print("Changed directory to:", os.getcwd())

    print("Running 'npm run build'...")
    subprocess.run(["npm.cmd", "run", "build"], check=True)
    print("Build complete.")

    server = "aptitude.cse.buffalo.edu"
    username = input("Enter username: ")
    password = input("Enter password: ")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to server {server}...")
    ssh.connect(server, username=username, password=password)
    sftp = ssh.open_sftp()

    local_build_dir = os.path.join(os.getcwd(), "build")
    remote_root = "/data/web/CSE442/2025-Spring/cse-442ah"
    remote_static_dir = remote_root + "/static"
    files_to_upload = ["asset-manifest.json", "index.html"]
    dirs_to_upload = ["css", "js"]

    # Delete old files and directories
    print("Deleting old files and directories on remote...")
    for file in files_to_upload:
        recursive_delete(sftp, f"{remote_root}/{file}")
    for directory in dirs_to_upload:
        recursive_delete(sftp, f"{remote_static_dir}/{directory}")

    # Ensure static directory exists
    try:
        sftp.mkdir(remote_static_dir)
    except IOError:
        pass

    # Upload new files
    for file in files_to_upload:
        local_file = os.path.join(local_build_dir, file)
        remote_file = f"{remote_root}/{file}"
        print(f"Uploading {local_file} to {remote_file}...")
        sftp.put(local_file, remote_file)

        # chmod the uploaded file to 0777
        chmod_cmd = f"chmod 0777 {remote_file}"
        print(f"Setting permissions for {remote_file}...")
        stdin, stdout, stderr = ssh.exec_command(chmod_cmd)
        if stdout.channel.recv_exit_status() == 0:
            print(f"Permissions set for {remote_file}.")
        else:
            print(f"Error setting permissions for {remote_file}: {stderr.read().decode()}")

    # Upload static subdirectories
    for directory in dirs_to_upload:
        local_dir = os.path.join(local_build_dir, "static", directory)
        remote_dir = f"{remote_static_dir}/{directory}"
        print(f"Uploading directory {local_dir} to {remote_dir}...")
        recursive_upload(sftp, local_dir, remote_dir)

    # chmod css/js
    for directory in dirs_to_upload:
        remote_dir = f"{remote_static_dir}/{directory}"
        chmod_cmd = f"chmod -R 0777 {remote_dir}"
        print(f"Changing permissions for {remote_dir}...")
        stdin, stdout, stderr = ssh.exec_command(chmod_cmd)
        if stdout.channel.recv_exit_status() == 0:
            print(f"Permissions changed successfully for {remote_dir}.")
        else:
            print(f"Error changing permissions for {remote_dir}: {stderr.read().decode()}")

    sftp.close()
    ssh.close()
    print("Deployment completed successfully.")

if __name__ == "__main__":
    main()
