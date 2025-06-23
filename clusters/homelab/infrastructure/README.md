# Homelab Infrastructure Setup Guide

This guide documents the setup process for a Kubernetes homelab with end-to-end encryption using cert-manager and Cloudflare tunnels.

## Overview

The infrastructure consists of:

- **Traefik** as the ingress controller (public and private instances)
- **cert-manager** for SSL certificate management
- **Cloudflare tunnels** for secure external access
- **Sealed Secrets** for encrypted secret storage

## Prerequisites

- Kubernetes cluster with MetalLB configured
- Cloudflare account with domain management
- Helm installed and configured
- kubectl configured for your cluster

## Installation Steps

### 1. Install Traefik Ingress Controller

Install Traefik using Helm with separate public and private instances:

```bash
# Add Traefik Helm repository
helm repo add traefik https://helm.traefik.io/traefik
helm repo update

# Install public Traefik instance
helm install --namespace traefik-public --create-namespace traefik-public traefik/traefik \
  --values ../../clusters/homelab/infrastructure/traefik/traefik-public-values.yaml

# Install private Traefik instance (optional)
helm install --namespace traefik-private --create-namespace traefik-private traefik/traefik \
  --values ../../clusters/homelab/infrastructure/traefik/traefik-private-values.yaml
```

**Key Configuration Points:**

- Set `service.spec.loadBalancerIP` to an IP within your MetalLB range
- Configure `providers.kubernetesCRD.ingressClass` for your specific ingress class
- Public and private instances allow separate traffic management

### 2. Install cert-manager

Install cert-manager for automated SSL certificate management:

```bash
# Add cert-manager Helm repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --values ../../clusters/homelab/infrastructure/helm/cert-manager-values.yaml
```

**Important Configuration:**

```yaml
extraArgs:
  - --dns01-recursive-nameservers-only
  - --dns01-recursive-nameservers=1.1.1.1:53,9.9.9.9:53
podDnsPolicy: None
podDnsConfig:
  nameservers:
    - "1.1.1.1"
    - "9.9.9.9"
crds:
  enabled: true # Let Helm manage CRDs
```

### 3. Configure ClusterIssuer

Create a ClusterIssuer for DNS-01 challenges with Cloudflare:

```yaml
# Key configuration for ClusterIssuer
spec:
  acme:
    email: your-email@example.com
    server: https://acme-staging-v02.api.letsencrypt.org/directory # Use staging for testing
    privateKeySecretRef:
      name: cluster-issuer-staging
    solvers:
      - dns01:
          cloudflare:
            email: your-email@example.com
            apiTokenSecretRef:
              name: cloudflare-token-secret
              key: cloudflare-token
        selector:
          dnsZones:
            - "yourdomain.com"
```

**Note:** Use the staging server initially for testing, then switch to production.

### 4. Create Application Namespaces

Organize your applications into logical namespaces:

```bash
kubectl create namespace frontend
kubectl create namespace backend
kubectl create namespace databases
kubectl create namespace monitoring
```

### 5. Create SSL Certificates

Create certificates for each namespace that requires HTTPS:

```bash
# Example: Create certificate for frontend namespace
kubectl apply -f certificates/frontend-certificate.yaml
```

**Best Practice:** Create certificates per namespace for better isolation and management.

### 6. Set Up Cloudflare Tunnel

For secure external access with dynamic IP support:

**Option A: Manual Setup**

```bash
# Install cloudflared on master node
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install cloudflared

# Create tunnel
cloudflared tunnel login
cloudflared tunnel create my-tunnel

# Create Kubernetes secret
kubectl create secret generic tunnel-credentials \
  --from-file=credentials.json=.cloudflared/[tunnel-id].json

# Deploy cloudflared
kubectl apply -f cloudflared.yaml

# Configure DNS route
cloudflared tunnel route dns my-tunnel "your.domain.com"
```

**Option B: Automated Setup**
Use the provided automation script:

```bash
./cloudflare/scripts/cloudflare-tunnel.sh
```

See [Cloudflare Tunnel Script Documentation](./cloudflare/scripts/README.md) for detailed instructions.

## Important Configuration Notes

### Public vs Private Access

- **Public Traefik**: Configured to work with Cloudflare (no port 80 redirects)
- **Private Traefik**: Internal-only access for local services
- **Local Access**: Add hostname to private Traefik routes for local testing

### Security Considerations

- Use Cloudflare for TLS termination on public services
- Implement proper ingress rules and network policies
- Use Sealed Secrets for sensitive configuration storage

## Sealed Secrets Setup

Sealed Secrets provide encrypted secret storage for Git repositories.

### 1. Install Sealed Secrets Controller

```bash
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm repo update
helm install sealed-secrets-controller sealed-secrets/sealed-secrets \
  --namespace sealed-secrets \
  --create-namespace
```

### 2. Verify Installation

```bash
kubectl get pods -n sealed-secrets
```

### 3. Install kubeseal CLI

```bash
# macOS
brew install kubeseal

# Verify access to controller
kubeseal --fetch-cert \
  --controller-name=sealed-secrets-controller \
  --controller-namespace=sealed-secrets
```

### 4. Create Sealed Secrets

```bash
# Create sealed secret from existing secret
kubeseal --controller-name sealed-secrets-controller \
  --controller-namespace sealed-secrets \
  --format yaml < secret.yaml > sealed-secret.yaml

# Apply sealed secret and remove original
kubectl apply -f sealed-secret.yaml
kubectl delete secret original-secret-name
```

## Troubleshooting

### Common Issues

1. **Certificate Issues**: Check cert-manager logs and ClusterIssuer status
2. **Tunnel Problems**: Verify Cloudflare login and tunnel credentials
3. **Ingress Issues**: Check Traefik logs and ingress configurations

### Useful Commands

```bash
# Check certificate status
kubectl get certificates,certificaterequests

# View Traefik logs
kubectl logs -n traefik-public -l app.kubernetes.io/name=traefik

# Check tunnel status
cloudflared tunnel list

# Verify sealed secrets
kubectl get sealedsecrets -A
```

## Next Steps

1. Configure monitoring and logging
2. Set up backup solutions
3. Implement proper network policies
4. Configure automated certificate renewal monitoring

## Longhorn Storage

**WHY?:** I found that if i wanted to have replicas on different nodes (e.g., pihole) I would need something other than the default setup in k3s - which is node-local storage. Longhorn is commonly used for this among other things.

### Prerequisites

View the full prerequisites [here](https://artifacthub.io/packages/helm/longhorn/longhorn). For myself, I am using Ubuntu 24.04 so most of the default programs are installed with the exception of iscsi (which is for file sharing over the network). For that i ran the following on each node (ideally i'll have this preinstalled on each node):

```
sudo apt install open-iscsi
sudo systemctl enable iscsid
sudo systemctl start iscsid
```

1. Create namespace
   `kubectl create namespace longhorn-system`
2. Add repo `helm repo add longhorn https://charts.longhorn.io & helm repo update`
3. Install (without values initially): `helm install longhorn longhorn/longhorn --version 1.9.0 -n longhorn-system`
4. Because I didn't specify any values I wasn't able to export the values file, but you can normally do this with `helm get values longhorn -n longhorn-system -o yaml`
5. Can obtain the storage class with `kubectl get storageclass -n longhorn-system`

## Pi Hole (DNS)

I decided that I would try my hand at setting up my own dns with pi hole. However, I wanted to ensure, given it's importance that it was fault tolerent: meaning that I wanted the replicas to be deployed on separate nodes. This meant that I required longhorn, which I had already installed earlier.

1. I ran the command `kubectl get storageclass -n longhorn-system` which revealed longhorn (default)
2. I then added this to my pi hole values file under `persistantVolumeClaim.storageClass = longhorn`
3. I had to remove and reinstall pi hole as this is setting is immutable.
4. Ended up setting replicas = 1 as apparently pi hole replicas cannot share information (e.g., logs) so opted to just use a backup external dns.

## Monitoring

### Grafana

Grafana is used for monitoring. To install, use the instructions setout at arifacthub: `https://artifacthub.io/packages/helm/grafana/grafana`

#### Get Password (for user admin)

To obtain the automatically generated password, run this:
`kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo`

Apparently this is the url - `grafana.monitoring.svc.cluster.local` - however i haven't yet set up the ability to access this. My thinking is that i'll create an ingress to access it.

### Promtail

### Loki

Again you can following the helm install info here:
`https://artifacthub.io/packages/helm/grafana/loki`

**IMPORTANT**: You'll need to run it as a SingleBinary (with replicas = 1, ensure read, write and backend are all set to 0 - as it's single binary, also replication_factor should also be 1, useTestSchema = True, and Storage.type = filesystem and storageClass = longhorn (if that is what i'm using))
