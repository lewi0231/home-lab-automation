# Internal network vms
resource "proxmox_vm_qemu" "master_nodes" {
    count = 1
    name        = var.nodes.master[count.index][0]
    target_node = var.proxmox_node
    clone       = var.cloud_init_template
    os_type = "cloud-init"
    # cicustom = "user=local:snippets/cloud-init.yaml" # would use this if you're running custom config from proxmox
    agent = 1 
    cores = var.core_count
    sockets = 1
    vcpus = 0
    cpu_type = var.cpu_type
    memory = var.memory_count.master
    balloon = 0
    scsihw = "virtio-scsi-single"
    bios = "seabios"
    numa = true
    full_clone = true
    
    disks {
        ide {
            ide2 {
                cloudinit {
                    storage = var.disk_storage
                }
            }
            # ide2 {
            #     cdrom {
            #     }
            # }
        }
        scsi {
            scsi0 {
                disk {
                    size            = var.disk_size.master
                    # cache           = "writeback"
                    storage         = var.disk_storage
                    # iothread        = true
                    discard         = true
                    emulatessd = true
                }
            }
        }
    }
    serial {
        id = 0
        type = "socket"
    }
    network {
        id = 0
        model = "virtio"
        bridge = "vmbr0"
        tag = var.vlan_tag.internal 
        macaddr = var.nodes.master[count.index][1]
        firewall = true
    }
    ciupgrade = true
    boot = var.boot_from
    ipconfig0 = var.ip_config    
    sshkeys = file("~/.ssh/id_rsa.pub")
    ciuser = var.ci_user
    cipassword = var.ci_password
}

resource "proxmox_vm_qemu" "worker_nodes" {
    count = 2
    name        = var.nodes.worker[count.index][0]
    target_node = var.proxmox_node
    clone       = var.cloud_init_template
    os_type = "cloud-init"
    # cicustom = "user=local:snippets/cloud-init.yaml" # would use this if you're running custom config from proxmox
    agent = 1 
    cores = var.core_count
    sockets = 1
    vcpus = 0
    cpu_type = var.cpu_type
    memory = var.memory_count.worker
    balloon = 0
    scsihw = "virtio-scsi-single"
    bios = "seabios"
    numa = true
    full_clone = true
    
    disks {
        ide {
            ide2 {
                cloudinit {
                    storage = var.disk_storage
                }
            }
            # ide2 {
            #     cdrom {
            #     }
            # }
        }
        scsi {
            scsi0 {
                disk {
                    size            = var.disk_size.worker
                    # cache           = "writeback"
                    storage         = var.disk_storage
                    # iothread        = true
                    discard         = true
                    emulatessd = true
                }
            }
        }
    }
    serial {
        id = 0
        type = "socket"
    }
    network {
        id = 0
        model = "virtio"
        bridge = "vmbr0"
        tag = var.vlan_tag.internal 
        macaddr = var.nodes.worker[count.index][1]
        firewall = true
    }
    ciupgrade = true
    boot = var.boot_from
    ipconfig0 = var.ip_config    
    sshkeys = file("~/.ssh/id_rsa.pub")
    ciuser = var.ci_user
    cipassword = var.ci_password
}

# resource "proxmox_vm_qemu" "volume_nodes" {
#     count = 3
#     name        = var.nodes.volume_node[count.index][0]
#     target_node = var.proxmox_node
#     clone       = var.cloud_init_template
#     os_type = "cloud-init"
#     # cicustom = "user=local:snippets/cloud-init.yaml" # would use this if you're running custom config from proxmox
#     agent = 1 
#     cores = var.core_count
#     sockets = 1
#     vcpus = 0
#     cpu_type = var.cpu_type
#     memory = var.memory_count.storage_worker
#     balloon = 0
#     scsihw = "virtio-scsi-single"
#     bios = "seabios"
#     numa = true
#     full_clone = true
    
#     disks {
#         ide {
#             ide2 {
#                 cloudinit {
#                     storage = var.disk_storage
#                 }
#             }
#             # ide2 {
#             #     cdrom {
#             #     }
#             # }
#         }
#         scsi {
#             scsi0 {
#                 disk {
#                     size            = var.disk_size.volume_node
#                     # cache           = "writeback"
#                     storage         = var.disk_storage
#                     # iothread        = true
#                     discard         = true
#                     emulatessd = true
#                 }
#             }
#         }
#     }
#     serial {
#         id = 0
#         type = "socket"
#     }
#     network {
#         id = 0
#         model = "virtio"
#         bridge = "vmbr0"
#         tag = var.vlan_tag.internal 
#         macaddr = var.nodes.volume_node[count.index][1]
#         firewall = true
#     }
#     ciupgrade = true
#     boot = var.boot_from
#     ipconfig0 = var.ip_config    
#     sshkeys = file("~/.ssh/id_rsa.pub")
#     ciuser = var.ci_user
#     cipassword = var.ci_password
# }
# DMZ network vms

# resource "proxmox_vm_qemu" "dmz_k3s_nodes" {
#     count = 1
#     name        = var.dmz_node_names[count.index]
#     target_node = var.proxmox_node
#     clone       = var.cloud_init_template
#     os_type = "cloud-init"
#     agent = 1 # QEMU agent enabled
#     cores = var.core_count
#     sockets = 1
#     vcpus = 0
#     cpu_type = var.cpu_type
#     memory = var.memory_count
#     balloon = var.memory_count
#     scsihw = "virtio-scsi-single"
#     bios = "seabios"
#     disks {
#         ide {
#             ide0 {
#                 cloudinit {
#                     storage = var.disk_storage
#                 }
#             }
#             ide2 {
#                 cdrom {
#                 }
#             }
#         }
#         scsi {
#             scsi0 {
#                 disk {
#                     size            = var.disk_size
#                     cache           = "writeback"
#                     storage         = var.disk_storage
#                     iothread        = true
#                     discard         = true
#                     emulatessd = true
#                 }
#             }
#         }
#     }
#     serial {
#         id = 0
#         type = "socket"
#     }
#     network {
#         id = 0
#         model = "virtio"
#         bridge = "vmbr0"
#         tag = var.vlan_tag.dmz 
#         macaddr = var.dmz_mac_addresses[count.index]
#         firewall = true
#     }
#     ciupgrade = true
#     boot = var.boot_from
#     ipconfig0 = var.ip_config    
#     sshkeys = file("~/.ssh/id_rsa.pub")
#     ciuser = var.ci_user
#     cipassword = var.ci_password
# }