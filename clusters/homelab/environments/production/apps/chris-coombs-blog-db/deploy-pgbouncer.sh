#!/bin/bash

# Secure PgBouncer Deployment Script
# ===================================
# This script securely deploys PgBouncer by injecting the database password
# from a Kubernetes secret at deployment time, ensuring no passwords are
# stored in configuration files that could be committed to Git.
#
# Security Features:
# - Password retrieved from Kubernetes secret at runtime
# - No plaintext passwords in configuration files
# - Safe to commit to Git repositories
# - Uses Helm's --set flag for secure injection
#
# Usage: ./deploy-pgbouncer.sh
# Prerequisites: kubectl access to database namespace, Helm 3.x

set -e

# Configuration
NAMESPACE="database"
SECRET_NAME="chris-coombs-db-pgbouncer"
RELEASE_NAME="chris-coombs-db-pgbouncer"
CHART_VERSION="3.0.0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting secure PgBouncer deployment...${NC}"

# Verify prerequisites
echo -e "${YELLOW}🔍 Verifying prerequisites...${NC}"

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed or not in PATH${NC}"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo -e "${RED}❌ helm is not installed or not in PATH${NC}"
    exit 1
fi

# Check if namespace exists
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    echo -e "${RED}❌ Namespace '$NAMESPACE' does not exist${NC}"
    exit 1
fi

# Check if secret exists
if ! kubectl get secret -n $NAMESPACE $SECRET_NAME &> /dev/null; then
    echo -e "${RED}❌ Secret '$SECRET_NAME' does not exist in namespace '$NAMESPACE'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites verified${NC}"

# Retrieve password from secret
echo -e "${YELLOW}🔐 Retrieving password from Kubernetes secret...${NC}"
PASSWORD=$(kubectl get secret -n $NAMESPACE $SECRET_NAME -o jsonpath='{.data.adminPassword}' | base64 -d)

if [ -z "$PASSWORD" ]; then
    echo -e "${RED}❌ Failed to retrieve password from secret $SECRET_NAME in namespace $NAMESPACE${NC}"
    echo -e "${RED}   Check that the secret exists and contains the 'adminPassword' key${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Password retrieved successfully${NC}"

# Deploy PgBouncer
echo -e "${YELLOW}🚀 Deploying PgBouncer with injected password...${NC}"
helm upgrade --install $RELEASE_NAME icoretech/pgbouncer \
    --version $CHART_VERSION \
    --namespace $NAMESPACE \
    --values pgbouncer-values.yaml \
    --set "config.databases.postgres.password=$PASSWORD" \
    --wait \
    --timeout 300s

echo -e "${GREEN}✅ PgBouncer deployed successfully with password injected from secret!${NC}"
echo -e "${BLUE}🔍 Checking deployment status...${NC}"

# Wait for pod to be ready
kubectl wait --for=condition=ready pod -n $NAMESPACE -l app.kubernetes.io/name=pgbouncer --timeout=120s

echo -e "${GREEN}✅ PgBouncer pod is ready!${NC}"
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "   • Release: $RELEASE_NAME"
echo -e "   • Namespace: $NAMESPACE"  
echo -e "   • Chart Version: $CHART_VERSION"
echo -e "   • Password Source: Secret '$SECRET_NAME'"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo -e "   • Check pods: ${YELLOW}kubectl get pods -n $NAMESPACE -l app.kubernetes.io/name=pgbouncer${NC}"
echo -e "   • View logs: ${YELLOW}kubectl logs -n $NAMESPACE -l app.kubernetes.io/name=pgbouncer${NC}"
echo -e "   • Port forward: ${YELLOW}kubectl port-forward -n $NAMESPACE svc/$RELEASE_NAME 5432:5432${NC}"
