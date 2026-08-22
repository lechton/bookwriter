---
name: device-info
description: >-
    Get macOS device information (hardware specs, OS version, memory, CPU, disk, display, etc.). Use this skill whenever the user asks about their Mac's hardware or software details.
---

# device-info

## Execution

To get device information for the user, use the `run_command` tool to execute
native macOS terminal utilities.

**Performance Optimization (Crucial):** To minimize latency and avoid multiple
round-trips for the user, **ALWAYS parallelize execution** when fetching
multiple pieces of information. You can do this by running commands in the
background using `&` and collecting their output with `wait`.

**Example of fetching all info concurrently:**

```bash
{ echo "--- OS ---"; sw_vers; } &
{ echo "--- CPU/Mem ---"; sysctl -n machdep.cpu.brand_string; sysctl -n hw.perflevel0.physicalcpu; sysctl -n hw.physicalcpu; sysctl -n hw.memsize; } &
{ echo "--- Storage ---"; df -h /; } &
{ echo "--- Battery/Thermal ---"; pmset -g batt; pmset -g therm; } &
{ echo "--- Display ---"; system_profiler SPDisplaysDataType; } &
{ echo "--- Hardware ---"; system_profiler SPHardwareDataType; } &
wait
```

## Recipes for retrieving hardware and software info

**macOS Version and Build:**

```bash
sw_vers
```

**CPU & Memory Hardware Overview:**

```bash
sysctl -n machdep.cpu.brand_string
sysctl -n hw.perflevel0.physicalcpu
sysctl -n hw.physicalcpu
sysctl -n hw.memsize
system_profiler SPHardwareDataType
```

**Storage/Disk Space:**

```bash
df -h /
```

**Battery and Thermal Status:**

```bash
pmset -g batt
pmset -g therm
```

**Display / Monitor Info:**

```bash
system_profiler SPDisplaysDataType
```

**System Uptime:**

```bash
uptime
sysctl kern.boottime
```
