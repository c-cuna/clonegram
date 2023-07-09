### Script start.sh
```
Pre-requisite:
Need to add compose plugin added to docker

How to use the script:
    $0 --build
    $0 --start
    $0 --stop --build --start --logs
    $0 --run-all

The available arguments:
    -b, --build             :    Build docker images
    -i, --image             :    Image name. Must be with --build
    -s, --start             :    Start
    -t, --start             :    Stop
    -l, --logs              :    Show Logs
    -h, --help              :    Rebuild, run, and show logs
```
