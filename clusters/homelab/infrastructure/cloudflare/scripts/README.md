# Cloudflare Tunnel Setup Script

This script automates the process of setting up a Cloudflare tunnel for your Kubernetes cluster. It handles the installation of cloudflared, tunnel creation, and Kubernetes secret management.

## Prerequisites

- SSH access to your Kubernetes master node
- `kubectl` configured on your local machine
- A Cloudflare account with appropriate permissions
- A valid domain name managed by Cloudflare
- A cloudflared deployment manifest file
- Sudo privileges on the master node for package installation

## Assumptions

1. **SSH Access**:

   - The master node is accessible via SSH
   - SSH keys are properly configured
   - The user has sudo privileges on the master node

2. **Kubernetes**:

   - `kubectl` is installed and configured on the local machine
   - The user has sufficient permissions to create secrets and apply deployments
   - The cluster is running and accessible

3. **Cloudflare**:

   - The user has a Cloudflare account
   - The domain is already registered and managed by Cloudflare
   - The user has permissions to create tunnels and manage DNS

4. **System Requirements**:
   - The master node runs a Debian-based distribution (for apt package management)
   - The master node has internet access to download cloudflared
   - Sufficient disk space for cloudflared installation

## Usage

1. Make the script executable:

   ```bash
   chmod +x cloudflare-tunnel.sh
   ```

2. Run the script:

   ```bash
   ./cloudflare-tunnel.sh
   ```

3. Follow the interactive prompts to:
   - Enter the master node hostname
   - Specify the tunnel name
   - Provide the path to your cloudflared deployment manifest
   - Enter your domain name

## Cloudflare Login Process

During the script execution, you will be prompted to log in to Cloudflare. This process:

1. Opens a browser window for authentication
2. Waits for you to complete the login
3. Verifies the login was successful before proceeding

## Troubleshooting

If you encounter issues:

1. Verify SSH connectivity to the master node
2. Ensure kubectl is properly configured
3. Check Cloudflare login status
4. Verify the deployment manifest exists and is valid
5. Check the tunnel status with `cloudflared tunnel list`
6. View tunnel logs with `kubectl logs -l app=cloudflared`
