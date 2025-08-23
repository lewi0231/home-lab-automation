# GitHub Actions Runners

This directory contains the configuration for self-hosted GitHub Actions runners in your homelab cluster.

## Runner Types

### 1. Home Lab Apps Runner (`homelab-apps-runner`)

- **Repository**: `lewi0231/home-lab-automation`
- **Purpose**: Runs workflows for the main infrastructure repository
- **Labels**: `self-hosted`, `homelab-apps`, `k3s-local`

### 2. Personal Blog Runner (`personal-blog-runner`)

- **Repository**: `lewi0231/personal-blog`
- **Purpose**: Runs workflows for the personal blog repository
- **Labels**: `self-hosted`, `personal-blog`, `k3s-local`

## How to Use in GitHub Workflows

### For home-lab-automation repository:

```yaml
jobs:
  build:
    runs-on: self-hosted
    # or use specific labels:
    # runs-on: [self-hosted, homelab-apps, k3s-local]
```

### For personal-blog repository:

```yaml
jobs:
  build:
    runs-on: self-hosted
    # or use specific labels:
    # runs-on: [self-hosted, personal-blog, k3s-local]
```

## Why Repository-Level Runners?

For personal GitHub accounts (not organizations), you must use repository-level runners:

- ❌ **Organization runners** don't work with personal accounts
- ✅ **Repository-level runners** work perfectly for personal accounts
- ✅ **Multiple repositories** can each have their own dedicated runners

## Scaling

Each runner has its own autoscaler:

- **Min replicas**: 0 (saves resources when not in use)
- **Max replicas**: 1 (handles single builds efficiently)
- **Scale up**: Triggers when workflow jobs are queued
- **Scale down**: Waits 5 minutes after job completion

## Resource Allocation

Each runner pod:

- **CPU**: 500m request, 2000m limit
- **Memory**: 1Gi request, 4Gi limit
- **Docker**: Enabled with sidecar container

## Troubleshooting

### Runner not appearing in GitHub:

1. Check if the runner pods are running: `kubectl get pods -n actions`
2. Verify the repository name is correct in the runner deployment
3. Ensure the GitHub token has the right permissions

### Workflow not using the runner:

1. Make sure `runs-on: self-hosted` is specified
2. Check that the repository matches the runner configuration
3. Verify the runner labels if using specific label targeting

## Important Notes

- **Repository-specific**: Each runner is tied to a specific repository
- **Automatic scaling**: Runners scale up when jobs are queued and down when idle
- **Resource efficient**: Runners start at 0 replicas and only scale up when needed
