#!/bin/bash

# Check whether flux installed on system

if ! command -v flux &> /dev/null; then
    echo "Flux is not installed. Installing..."
    curl -s https://fluxcd.io/install.sh | sudo bash
else
    echo "Flux is already installed."
fi

# Install flux-system controllers from existing manifests

default_path="/clusters/homelab/flux-system"

read -p $default_path "Please enter path to flux-system or hit enter to use [$default_path]:" custom_path

path_to_use="${custom_path:-$default_path}"

echo "Applying flux-system manifests from : $path_to_use"
if ! kubectl apply -f "$path_to_use"; then
    echo "Error: Failed to apply manifests from $path_to_use"
    exit 1
fi

echo "Successfully applied flux-system manifests."

# Create flux-system secret

read -p "Enter your repo username:" username
read -p "Enter your repo token:" token
read -p "Enter your repo name:" repo

if [[ -z "$token" || -z "$username" || -z "$repo"]]; then
    echo "❌ Input cannot be empty. Exiting..."
    exit 1
fi
 
echo "Creating flux-system GitRepository Secret..."

if ! flux create secret git flux-system \
    --url="https://github.com/$username/$repo.git" \ 
    --username="$username" \
    --password="$token" \
    -n flux-system; then
    echo "❌ Failed to create the secret."
    exit 1
fi

if ! kubectl get secret -n flux-system | grep flux-system &> /dev/null; then
    echo "❌ There was a problem creating the secret."
    exit 1
fi

echo "✅ Successfully created flux-system secret."

echo """
    You can run the following to verify the installation:
        - flux get sources git -n flux-system
        - flux get pods -n flux-system
        - flux reconcile source git flux-system
"""