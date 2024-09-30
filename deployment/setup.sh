#!/bin/bash

# Exit on any error
set -e

# Function to set up the Python virtual environment for the backend
setup_backend() {
  echo "Setting up backend environment..."
  
  # Navigate to the backend directory
  cd api

  # Check Python 3 installation
  if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install it and try again."
    exit 1
  fi

  # Create a virtual environment (if not exists)
  if [ ! -d "venv" ]; then
    python3 -m venv venv
  fi

  # Activate the virtual environment
  source venv/bin/activate

  # Upgrade pip to the latest version
  pip install --upgrade pip

  # Install requirements
  pip install --no-cache-dir -r requirements.txt

  echo "Backend environment setup complete."
}

# Function to install packages for the React frontend
setup_frontend() {
  echo "Setting up frontend environment..."
  
  # Navigate to the frontend directory
  cd ../frontend

  # Install packages
  npm install

  echo "Frontend environment setup complete."
}

# Run setup functions
setup_backend
setup_frontend
# Delay to ensure the terminal opens
sleep 1

source "api/venv/bin/activate" && python3 "api/manage.py runserver"

# # Command to run the backend with the virtual environment activated
# backend_command="source ../backend/venv/bin/activate && python ../backend/manage.py runserver"

# # Send the command to the new terminal
# osascript -e "tell application \"Visual Studio Code\" to tell application \"System Events\" to tell process \"Code\" to keystroke \"$backend_command\""
# osascript -e "tell application \"Visual Studio Code\" to tell application \"System Events\" to keystroke return"

# # Open another terminal in VS Code to run the frontend
# echo "Opening new terminal in VS Code to run the frontend..."
# code --new-window --command "workbench.action.terminal.new"

# # Delay to ensure the terminal opens
# sleep 1

# # Command to run the frontend
# frontend_command="npm start"

# # Send the command to the new terminal
# osascript -e "tell application \"Visual Studio Code\" to tell application \"System Events\" to tell process \"Code\" to keystroke \"$frontend_command\""
# osascript -e "tell application \"Visual Studio Code\" to tell application \"System Events\" to keystroke return"

# echo "Backend and frontend servers should now be running in new terminals."