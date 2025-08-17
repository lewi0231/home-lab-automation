# Flux CD Environments

This directory contains environment-specific Kubernetes manifests managed by Flux CD for GitOps deployment.

## Structure

```
environments/
├── development/          # Development environment
│   ├── namespace.yaml    # Development namespace
│   ├── kustomization.yaml # Kustomize configuration
│   └── apps/            # Application manifests
│       └── personal-blog/
├── production/          # Production environment
│   ├── namespace.yaml   # Production namespace
│   ├── kustomization.yaml # Kustomize configuration
│   └── apps/           # Application manifests
│       ├── personal-blog/
│       └── dashboard/
└── README.md
```

## Purpose

These environments provide:

- **Environment Isolation**: Separate namespaces for development and production
- **GitOps Workflow**: Flux CD monitors these directories for changes
- **Kustomize Management**: Uses Kustomize for environment-specific configurations
- **Application Deployment**: Organized application manifests per environment

## How It Works

1. **Flux CD** monitors this directory for changes
2. **Kustomize** processes the `kustomization.yaml` files
3. **Applications** are deployed to their respective environments
4. **Namespace isolation** ensures proper resource separation

## Adding Applications

To add a new application to an environment:

1. Create application directory: `environments/{env}/apps/{app-name}/`
2. Add application manifests to the directory
3. Update the environment's `kustomization.yaml` to include the new app
4. Commit and push - Flux will automatically deploy the changes

## Current Applications

- **Development**: personal-blog (from personal-blog repository)
- **Production**: personal-blog (from personal-blog repository), dashboard

## Repository Structure

- **personal-blog**: Applications from the `personal-blog` repository
- **Other apps**: Applications from the `home-lab-automation` repository

# Production and Development

Both require independent git-credentials and ghcr-credentials - the latter needs to be ssh. Better off just creating these manually.
