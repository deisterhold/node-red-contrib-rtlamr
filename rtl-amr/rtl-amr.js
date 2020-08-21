module.exports = function (RED) {
    function RtlAmr(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.server = RED.nodes.getNode(config.server);

        if (node.server) {
            node.log("Using server: " + node.server);
        } else {
            node.warn("No server specified.");
        }

        node.on('input', function (msg, send, done) {
            // For maximum backwards compatibility, check that send exists.
            // If this node is installed in Node-RED 0.x, it will need to
            // fallback to using `node.send`
            send = send || function () { node.send.apply(node, arguments) }

            // red, green, yellow, blue, grey
            // this.status({fill:"red", shape:"ring", text:"disconnected"});
            // this.status({fill:"green", shape:"dot", text:"connected"});
            // this.status({});

            msg.payload = msg.payload.toLowerCase();
            send(msg);
            done();

            if (err) {
                if (done) {
                    // Node-RED 1.0 compatible
                    done(err);
                } else {
                    // Node-RED 0.x compatible
                    node.error(err, msg);
                }
            }
        });

        node.on('close', function (removed, done) {
            // tidy up any state
            if (removed) {
                // This node has been disabled/deleted
            } else {
                // This node is being restarted
            }
            done();
        });
    }
    RED.nodes.registerType("rtl-amr", RtlAmr);
}
