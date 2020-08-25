module.exports = function (RED) {
    const { spawn } = require('child_process')

    // https://stackoverflow.com/a/20392392
    function tryParseJSON(jsonString) {
        try {
            var o = JSON.parse(jsonString)

            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object",
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === 'object') {
                return o
            }
        } catch (e) { }

        return false
    };

    function RtlAmr(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.cmd = 'rtlamr';
        node.args = ['-format', 'json'];
        node.child = null;

        function start() {
            try {
                node.child = spawn(node.cmd, node.args)
                node.status({ fill: 'green', shape: 'dot', text: 'listening' })

                node.child.stdout.on('data', function (data) {
                    const json = tryParseJSON(data)

                    if (json) {
                        var msg = {
                            payload: json
                        };
                        node.send(msg);
                    } else {
                        // not JSON
                        node.log('rtlamr STDOUT: ' + json)
                    }
                });

                node.child.stderr.on('data', function (data) {
                    node.log('rtlamr STDERR:  ' + data)
                })

                node.child.on('close', function (code, signal) {
                    node.child = null
                    node.status({ fill: 'red', shape: 'ring', text: 'stopped' })
                })

                node.child.on('error', function (err) {
                    if (err.errno === 'ENOENT') { node.warn('Command not found') } else if (err.errno === 'EACCES') { node.warn('Command not executable') } else { node.log('error: ' + err) }
                    node.status({ fill: 'red', shape: 'ring', text: 'error' })
                })
            } catch (e) {
                if (e.errno === 'ENOENT') { node.warn('Command not found: ' + node.cmd) } else if (e.errno === 'EACCES') { node.warn('Command not executable: ' + node.cmd) } else {
                    node.log('error: ' + e)
                    node.debug('rtlamr error: ' + e)
                }
                node.status({ fill: 'red', shape: 'ring', text: 'error' })
            }
        }

        node.on('close', function (done) {
            if (node.child != null) {
                node.child.on('exit', function () {
                    done()
                })
                node.child.kill('SIGKILL')
            }
            node.status({});
            done();
        });

        start();
    }

    RED.nodes.registerType("rtl-amr", RtlAmr);
}
