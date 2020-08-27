# node-red-contrib-rtlamr
A node red node for listening to rtlamr.

## Usage
The node allows you to specify the rtl_tcp server and port used by rtlamr.
You can use either a hostname or IP address and port (Ex. `192.168.1.5:1234` or `myrtltcpserver:1234`).
If a server is not specified it defaults to `127.0.0.1:1234`

![Example Node Config](https://raw.githubusercontent.com/deisterhold/node-red-contrib-rtlamr/master/img/node_config.png)

## Example Flow

```json
[{"id":"bf73a772.b69008","type":"tab","label":"Flow 3","disabled":false,"info":""},{"id":"838aebc4.f584f8","type":"rtl-amr","z":"bf73a772.b69008","name":"Meter Reader","device":"","x":110,"y":40,"wires":[["80a73d0a.8d815"]]},{"id":"80a73d0a.8d815","type":"debug","z":"bf73a772.b69008","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":270,"y":40,"wires":[]}]
```