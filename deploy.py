import os
import subprocess
import paramiko

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
            remote_item = remote_path + "/" + item
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
    files_to_upload = ["asset-manifest.json", "index.html"]
    for file in files_to_upload:
        local_file = os.path.join(local_build_dir, file)
        remote_file = remote_root + "/" + file
        print(f"Uploading {local_file} to {remote_file}...")
        sftp.put(local_file, remote_file)

    
    local_static_dir = os.path.join(local_build_dir, "static")
    remote_static_dir = remote_root + "/static"
    dirs_to_upload = ["css", "js"]
    for directory in dirs_to_upload:
        local_dir = os.path.join(local_static_dir, directory)
        remote_dir = remote_static_dir + "/" + directory
        print(f"Uploading directory {local_dir} to {remote_dir}...")
        recursive_upload(sftp, local_dir, remote_dir)

    
    for directory in dirs_to_upload:
        remote_dir = remote_static_dir + "/" + directory
        chmod_command = f"chmod -R 0777 {remote_dir}"
        print(f"Changing permissions for {remote_dir}...")
        stdin, stdout, stderr = ssh.exec_command(chmod_command)
        exit_status = stdout.channel.recv_exit_status()
        if exit_status == 0:
            print(f"Permissions changed successfully for {remote_dir}.")
        else:
            error_message = stderr.read().decode()
            print(f"Error changing permissions for {remote_dir}: {error_message}")

    
    sftp.close()
    ssh.close()
    print("Deployment completed successfully.")

if __name__ == "__main__":
    main()
