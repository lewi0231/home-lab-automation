output "k3s_nodes" {
  description = "Current IP Default"
  value = proxmox_vm_qemu.k3s_nodes.*.default_ipv4_address
}