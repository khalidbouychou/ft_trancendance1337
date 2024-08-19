#!/bin/bash

# Backend setup
echo "Setting up backend..."
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
echo "Setting up frontend..."
cd ../FrontEnd
npm i

echo "Setup complete!"