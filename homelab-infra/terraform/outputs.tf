output "internal_k3s_nodes" {
  description = "Current IP Default"
  value = proxmox_vm_qemu.internal_k3s_nodes.*.default_ipv4_address
}

output "dmz_k3s_nodes" {
  description = "Current IP Default"
  value = proxmox_vm_qemu.dmz_k3s_nodes.*.default_ipv4_address
}