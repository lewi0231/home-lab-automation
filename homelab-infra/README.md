## Setup

### Terraform

1. Install - I'm using a mac.

```
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -v  # confirm install
```

## TODO

1. For real-world use:
   • Swap raw passwords with Terraform Cloud, .tfvars.json, or Vault
   • Use Proxmox API tokens instead of password auth if possible
