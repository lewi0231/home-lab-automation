# PgBouncer Secure Deployment

This directory contains a secure deployment configuration for PgBouncer that allows you to safely commit configuration files to Git while keeping passwords secure.

## 🔐 Security Architecture

### Authentication Flow

1. **Client → PgBouncer**: Uses MD5 hash authentication
2. **PgBouncer → PostgreSQL**: Uses plain text password (injected securely)
3. **PostgreSQL**: Validates using MD5 authentication

### Password Management

- **Real Password**: Stored in Kubernetes secret `chris-coombs-db-pgbouncer`
- **Config File**: Contains placeholder `PLACEHOLDER_PASSWORD`
- **Deployment**: Script injects real password at deployment time
- **Git Safety**: No real passwords ever committed to repository

## 📁 Files Overview

| File                    | Purpose                               | Safe to Commit |
| ----------------------- | ------------------------------------- | -------------- |
| `pgbouncer-values.yaml` | Helm values with placeholder password | ✅ Yes         |
| `deploy-pgbouncer.sh`   | Secure deployment script              | ✅ Yes         |
| `README.md`             | This documentation                    | ✅ Yes         |

## 🚀 Deployment

### Prerequisites

- Kubernetes cluster with access to `database` namespace
- Helm 3.x installed
- `kubectl` configured and authenticated
- Secret `chris-coombs-db-pgbouncer` exists in `database` namespace

### Deploy PgBouncer

```bash
# Navigate to this directory
cd clusters/homelab/environments/production/apps/chris-coombs-blog-db

# Run the secure deployment script
./deploy-pgbouncer.sh
```

### What the Script Does

1. 🔍 Retrieves password from Kubernetes secret
2. 🚀 Deploys PgBouncer using Helm with password injection
3. ✅ Confirms successful deployment

## 🛠️ Development Setup

### Local Database Connection

```bash
# Start port forwarding
kubectl port-forward -n database svc/chris-coombs-db-pgbouncer 5432:5432

# Your .env.development should use the MD5 hash for client authentication:
DATABASE_URL="postgresql://postgres:0e12a7216c73fd5f3a1b5c44f20c827c@localhost:5432/postgres"
DIRECT_URL="postgresql://postgres:0e12a7216c73fd5f3a1b5c44f20c827c@localhost:5432/postgres"
```

### Password Hash Calculation

The MD5 hash is calculated as: `md5(password + username)`

```bash
# For password "test" and username "postgres":
echo -n "testpostgres" | md5sum
# Result: exampleresulthash
```

## 🔧 Troubleshooting

### Check Deployment Status

```bash
kubectl get pods -n database -l app.kubernetes.io/name=pgbouncer
```

### View PgBouncer Logs

```bash
kubectl logs -n database -l app.kubernetes.io/name=pgbouncer --tail=50
```

### Check Configuration

```bash
kubectl exec -n database deployment/chris-coombs-db-pgbouncer -- cat /etc/pgbouncer/pgbouncer.ini
```

### Verify Secret Exists

```bash
kubectl get secret -n database chris-coombs-db-pgbouncer
```

## 📊 Connection Details

### PgBouncer Configuration

- **Host**: `chris-coombs-db-postgresql-hl`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Auth Type**: `md5`
- **Pool Mode**: `transaction`

### Client Authentication

- **Method**: MD5 hash
- **Hash Format**: `md5(password + username)`
- **Current Hash**: `exampleresulthash`

## 🔄 Updating Configuration

### Modify PgBouncer Settings

1. Edit `pgbouncer-values.yaml`
2. Run `./deploy-pgbouncer.sh` to apply changes
3. Commit changes to Git (safe - no passwords)

### Update Password

1. Update the Kubernetes secret:
   ```bash
   kubectl create secret generic chris-coombs-db-pgbouncer -n database \
     --from-literal=adminUser=postgres \
     --from-literal=adminPassword=NEW_PASSWORD \
     --from-literal=userlist.txt='"postgres" "NEW_MD5_HASH"' \
     --dry-run=client -o yaml | kubectl replace -f -
   ```
2. Redeploy PgBouncer: `./deploy-pgbouncer.sh`
3. Update your local `.env.development` with new MD5 hash

## ⚠️ Important Notes

- **Never commit real passwords** to Git
- **Always use the deployment script** for production deployments
- **The placeholder password** in values file should never be changed
- **MD5 hash in userlist.txt** must match the client authentication
- **Plain text password** is only used for PgBouncer → PostgreSQL connection

## 🔗 Related Documentation

- [PgBouncer Configuration](https://www.pgbouncer.org/config.html)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Helm Values](https://helm.sh/docs/chart_template_guide/values_files/)

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Ensure the secret exists and contains correct data
4. Check PgBouncer and PostgreSQL logs for authentication errors
