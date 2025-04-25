import os
import shutil
from subprocess import run

# Define directories
project_directory = os.path.dirname(os.path.abspath(__file__))
backend_directory = os.path.join(project_directory, "backend")
PHPMailer_directory = os.path.join(project_directory, "PHPMailer")
frontend_directory = os.path.join(project_directory, "frontend")
frontend_build_dir = os.path.join(frontend_directory, "build")
xampp_directory = "C:/xampp/htdocs/"

# Ensure XAMPP directory exists
os.makedirs(xampp_directory, exist_ok=True)

# Copy backend contents to XAMPP directory
backend_dest = os.path.join(xampp_directory, "backend")
if os.path.exists(backend_directory):
    shutil.rmtree(backend_dest, ignore_errors=True)
    shutil.copytree(backend_directory, backend_dest)
    print(f"Copied backend to {backend_dest}")
else:
    print("Backend directory not found!")

# Copy PHPMailer contents to XAMPP directory
PHPMailer_dest = os.path.join(xampp_directory, "PHPMailer")
if os.path.exists(PHPMailer_directory):
    shutil.rmtree(PHPMailer_dest, ignore_errors=True)
    shutil.copytree(PHPMailer_directory, PHPMailer_dest)
    print(f"Copied PHPMailer to {PHPMailer_dest}")
else:
    print("PHPMailer directory not found!")


# Build frontend and copy contents of /frontend/build to XAMPP root directory
if os.path.exists(frontend_directory):
    run(["npm", "install"], cwd=frontend_directory, shell=True)
    run(["npm", "run", "build"], cwd=frontend_directory, shell=True)

    if os.path.exists(frontend_build_dir):
        for item in os.listdir(frontend_build_dir):
            source = os.path.join(frontend_build_dir, item)
            destination = os.path.join(xampp_directory, item)

            if os.path.isdir(source):
                shutil.rmtree(destination, ignore_errors=True)
                shutil.copytree(source, destination)
            else:
                shutil.copy2(source, destination)

        print(f"Copied frontend build contents to {xampp_directory}")
    else:
        print("Frontend build directory not found after build!")
else:
    print("Frontend directory not found!")
