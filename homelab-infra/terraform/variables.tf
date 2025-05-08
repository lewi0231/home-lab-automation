variable "pm_api_url" {
  type        = string
  description = "Proxmox API URL"
}

variable "pm_user" {
  type        = string
  description = "Proxmox username (e.g. root@pam)"
}

variable "pm_password" {
  type        = string
  description = "Proxmox password"
}

variable "ci_user" {
    type    = string
    description = "Cloud init vm instance username"
}

variable "ci_password" {
    type = string
    description = "Cloud init vm instance password"
}

variable "disk_size" {
    type = number
    description = "The size of the disk (e.g., 20 - G is inferred)"
}

variable disk_storage {
    type = string
    description = "The type of of disk storage (e.g., local-lvm)"
}

variable proxmox_node {
    type = string
    description = "The proxmox host"
}

variable cloud_init_template {
    type = string 
    description = "The cloud init template"
}

variable memory_count {
    type = number
    description = "Memory amount"
}

variable core_count {
    type = number
    description = "Number of cores"
}

variable cpu_type {
    type = string
    description = "CPU type (e.g., x86-64-v2-AES or host)"
}

variable ip_config {
    type = string
    description = "IP config method (e.g., ip=10.20.20.25/24,gw=10.20.20.1) or dhcp"
}

variable boot_from {
    type = string
    description = "Boot order / from (e.g., scsi0)"
}

variable node_names {
    type = list(string)
    description = "Distinct names for the nodes"
}

variable mac_addresses {
    type = list(string)
    description = "Distinct mac address for ip mapping - dhcp"
}