output "master_nodes" {
  description = "Current IP Default"
  value = proxmox_vm_qemu.master_nodes.*.default_ipv4_address
}

output "worker_nodes" {
  description = "Current IP Default"
  value = proxmox_vm_qemu.worker_nodes.*.default_ipv4_address
}

# output "volume_nodes" {
#   description = "Current IP Default"
#   value = proxmox_vm_qemu.storage_worker.*.default_ipv4_address
# }