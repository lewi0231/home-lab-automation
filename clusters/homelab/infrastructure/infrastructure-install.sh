#!/bin/bash

set -euo pipefail

# Add helm repos to be used + update
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm repo add jetstack https://charts.jetstack.io
helm repo add traefik https://traefik.github.io/charts
helm repo add longhorn https://charts.longhorn.io
helm repo add grafana https://grafana.github.io/helm-charts 
helm repo add mojo2600 https://mojo2600.github.io/pihole-kubernetes/  
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create log file
filename=./install-logs/$(date -I)-infrastructure-install.log
touch "$filename"

exec > >(tee -a "$filename") 2>&1

# 1. sealed-secret
echo "[==================== [Sealed Secrets] ===================="
helm install sealed-secrets-controller sealed-secrets/sealed-secrets \
  --namespace sealed-secrets \
  --create-namespace

# 2. cert-manager
echo "==================== [Cert Manager] ===================="
helm upgrade --install cert-manager jetstack/cert-manager \
    --namespace cert-manager --create-namespace \
    -f ./cert-manager/helm/values.yaml

kubectl apply -f ./cert-manager/cluster-issuers/production.yaml -n cert-manager
kubectl apply -f ./cert-manager/secrets/sealed-cf-token-secret.yaml -n cert-manager


# 3. MetalLB 
echo "==================== [MetalLB] ===================="
# TODO - relocate metallb install here

# 4. Traefik (public and private)
echo "==================== [Traefik Private] ===================="
kubectl create namespace traefik-private
kubectl apply -f ./traefik/internal/traefik-private-manifest.yaml -n traefik-private 

echo "==================== [Traefik Public] ===================="
helm upgrade --install traefik-public traefik/traefik \
    --namespace traefik-public --create-namespace \
    -f ./traefik/external/values.yaml

# 5. Cloudflare tunnel (run script)
echo "==================== [Cloudflare Tunnel Creation] ===================="
./cloudflare/scripts/cloudflare-tunnel.sh
# TODO - allow for arguments when running script - e.g., username, hostname, domain

# 6. Install longhorn
echo "==================== [Longhorn] ===================="
helm upgrade --install longhorn longhorn/longhorn \
  --namespace longhorn-system --create-namespace -f ./longhorn/values.yaml

# 7. Monitoring stack (Prometheus, Grafana, etc.)
echo "==================== [Monitoring Installs] ===================="
# Apply certificate
kubectl apply -f ./monitoring/monitoring-tls-cert.yaml

# Traefik Dashboard
kubectl apply -n monitoring --create-namespace -f ./monitoring/traefik-dashboard/secrets
# kubectl apply -f ./monitoring/middleware # Not Currently Using this.
kubectl apply -f -n monitoring --create-namespace  ./monitoring/traefik-dashboard/ingress

# Grafana
helm upgrade --install grafana grafana/grafana \
    --namespace monitoring --create-namespace -f ./monitoring/grafana/values.yaml

kubectl apply -f ./monitoring/grafana/ingressroute.yaml

# Prometheus
helm upgrade --install my-prometheus prometheus-community/prometheus --namespace monitoring --create-namespace -f ./monitoring/prometheus/default-values.yaml

# Alloy
kubectl apply -f ./monitoring/alloy/config-map.yaml
helm upgrade --install alloy grafana/alloy --namespace monitoring --create-namespace -f ./monitoring/alloy/values.yaml

# Loki
helm upgrade --install loki grafana/loki --namespace monitoring --create-namespace -f ./monitoring/loki/values.yaml


# 7. Pi-hole
echo "==================== [Monitoring Pihole] ===================="
# helm upgrade --install pihole mojo2600/pihole ...

# 8. Authentik
# helm upgrade --install authentik authentik/authentik ...

# 9. Middlewares (usually via kubectl apply -f ...)
# kubectl apply -f middlewares/

# 10. Testing tools
# kubectl apply -f testing/