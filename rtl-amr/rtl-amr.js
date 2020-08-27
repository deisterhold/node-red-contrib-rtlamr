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
        node.rtlamr = null;
        node.server = config.server;

        if (node.server) {
            node.args.push('-server', node.server);
        }

        function start() {
            try {
                node.rtlamr = spawn(node.cmd, node.args);
                node.status({ fill: 'green', shape: 'dot', text: 'listening' });

                node.rtlamr.stdout.on('data', function (data) {
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

                node.rtlamr.stderr.on('data', function (data) {
                    node.log('rtlamr STDERR:  ' + data)
                });

                node.rtlamr.on('close', function (code, signal) {
                    node.rtlamr = null;
                    node.status({ fill: 'red', shape: 'ring', text: 'stopped' });
                });

                node.rtlamr.on('error', function (e) {
                    switch (e.errno) {
                        case 'ENOENT':
                            node.warn('Command not found: ' + node.cmd);
                            break;
                        case 'EACCES':
                            node.warn('Command not executable: ' + node.cmd);
                            break;
                        default:
                            node.log('error: ' + e);
                            node.debug('rtlamr error: ' + e);
                            break;
                    }

                    node.status({ fill: 'red', shape: 'ring', text: 'error' });
                });
            } catch (e) {
                switch (e.errno) {
                    case 'ENOENT':
                        node.warn('Command not found: ' + node.cmd);
                        break;
                    case 'EACCES':
                        node.warn('Command not executable: ' + node.cmd);
                        break;
                    default:
                        node.log('error: ' + e);
                        node.debug('rtlamr error: ' + e);
                        break;
                }

                node.status({ fill: 'red', shape: 'ring', text: 'error' });
            }

        }

        node.on('close', function (done) {
            // Clear status
            node.status({});

            // If rtlamr is running try to kill it
            if (node.rtlamr != null) {
                node.rtlamr.on('exit', function () {
                    done();
                });
                node.rtlamr.kill('SIGKILL');
            } else {
                done();
            }
        });
        start();
    }

    RED.nodes.registerType("rtl-amr", RtlAmr);
}
