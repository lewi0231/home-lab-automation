terraform {
    required_providers {
        proxmox = {
            source = "telmate/proxmox"
            version = "2.9.11"
        }
    }
}

provider "proxmox" {
    pm_api_url  = var.pm_api_url
    pm.user     = var.pm_user
    pm_password = var.pm_password
    pm_tls_insecure = true
}