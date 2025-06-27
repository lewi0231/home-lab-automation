# Longhorn Notes

## Bug - [here](https://github.com/longhorn/longhorn/issues/6606)

There is a known issue that prevents the tolerations and nodeSelector from being applied to the csi related deployments and the daemonsets, engineimage and longhorn-csi-plugin.

### Interim Fix

The respective daemonsets or deployments can be edited, with the below added under `spec.template.spec`

```
      tolerations:
        - key: "dedicated"
          operator: "Equal"
          value: "longhorn-storage"
          effect: "NoSchedule"
      nodeSelector:
        storage: "true"
```

**NOTE**: This needs to occur each time an upgrade happens, until the bug is resolved.
