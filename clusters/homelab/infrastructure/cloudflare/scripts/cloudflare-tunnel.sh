#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate input
validate_input() {
    if [ -z "$1" ]; then
        echo "Error: Input cannot be empty"
        return 1
    fi
    return 0
}

# Function to check SSH connection
check_ssh() {
    ssh -q "$1" exit
    return $?
}

# Function to install cloudflared on remote host
install_cloudflared() {
    local host=$1
    echo "Installing cloudflared on $host..."
    
    ssh "$host" "set -e; \
    curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | \
    sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null && \
    echo \"deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared \$(lsb_release -cs) main\" | \
    sudo tee /etc/apt/sources.list.d/cloudflared.list && \
    sudo apt update && sudo apt install -y cloudflared"
}

# Function to verify Cloudflare login
verify_cloudflare_login() {
    local host=$1
    ssh "$host" "cloudflared tunnel list" >/dev/null 2>&1
    return $?
}

# Main script
echo "Cloudflare Tunnel Setup Script"
echo "=============================="

# Get master node hostname
while true; do
    read -p "Enter the master node hostname (e.g., master1): " MASTER_NODE
    read -p "Enter the username to remote machine: " USERNAME
    if validate_input "$MASTER_NODE" && validate_input "$USERNAME"; then
        if check_ssh "$USERNAME@$MASTER_NODE"; then
            break
        else
            echo "Error: Cannot connect to $USERNAME@$MASTER_NODE via SSH. Please check the hostname and SSH access."
        fi
    fi
done

# Get tunnel name
while true; do
    read -p "Enter a name for your Cloudflare tunnel (e.g., my-tunnel): " TUNNEL_NAME
    if validate_input "$TUNNEL_NAME"; then
        break
    fi
done

# Get deployment manifest path
while true; do
    read -p "Enter the path to your cloudflared deployment manifest: " DEPLOYMENT_PATH
    if validate_input "$DEPLOYMENT_PATH" && [ -f "$DEPLOYMENT_PATH" ]; then
        break
    else
        echo "Error: Please enter a valid path to the deployment manifest file"
    fi
done

# Get domain name
while true; do
    read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
    if validate_input "$DOMAIN_NAME"; then
        break
    fi
done

# Install cloudflared on master node
echo "Setting up cloudflared on $MASTER_NODE..."
install_cloudflared "$USERNAME@$MASTER_NODE"

# Login to Cloudflare
echo "Please login to Cloudflare..."
echo "A browser window will open for authentication. Please complete the login process."
ssh "$USERNAME@$MASTER_NODE" "cloudflared tunnel login"

# Verify login was successful
echo "Verifying Cloudflare login..."
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if verify_cloudflare_login "$USERNAME@$MASTER_NODE"; then
        echo "Cloudflare login successful!"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            echo "Error: Failed to verify Cloudflare login after $MAX_RETRIES attempts"
            echo "Please ensure you completed the login process in your browser"
            exit 1
        fi
        echo "Waiting for login verification... (Attempt $RETRY_COUNT of $MAX_RETRIES)"
        sleep 5
    fi
done

# Create tunnel
echo "Creating tunnel: $TUNNEL_NAME..."
TUNNEL_CREDENTIALS=$(ssh "$USERNAME@$MASTER_NODE" "cloudflared tunnel create $TUNNEL_NAME | grep -o '.cloudflared/[0-9a-f-]*.json'")

if [ -z "$TUNNEL_CREDENTIALS" ]; then
    echo "Error: Failed to create tunnel"
    exit 1
fi

echo "Tunnel credentials file: $TUNNEL_CREDENTIALS"

# Create Kubernetes secret
echo "Creating Kubernetes secret for tunnel credentials..."
ssh "$USERNAME@$MASTER_NODE" "sudo kubectl create secret generic tunnel-credentials --from-file=credentials.json='$TUNNEL_CREDENTIALS'"

# Apply deployment
echo "Applying cloudflared deployment..."
kubectl apply -f "$DEPLOYMENT_PATH"

# Configure DNS route
echo "Configuring DNS route..."
ssh "$USERNAME@$MASTER_NODE" "cloudflared tunnel route dns $TUNNEL_NAME $DOMAIN_NAME"

echo "=========================================="
echo "Cloudflare tunnel setup completed!"
echo "Tunnel name: $TUNNEL_NAME"
echo "Domain: $DOMAIN_NAME"
echo "=========================================="
echo "Please verify the tunnel status with: cloudflared tunnel list"
echo "You can check the tunnel logs with: kubectl logs -l app=cloudflared"
