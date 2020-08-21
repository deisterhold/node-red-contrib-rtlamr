module.exports = function (RED) {
    function RtlTcpNode(config) {
        RED.nodes.createNode(this, config);
        this.host = config.host;
        this.port = config.port;

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
    RED.nodes.registerType("rtl-tcp", RtlTcpNode);
}