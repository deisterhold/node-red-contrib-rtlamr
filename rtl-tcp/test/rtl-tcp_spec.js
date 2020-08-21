var helper = require("node-red-node-test-helper");
var rtltcpNode = require("../rtl-tcp.js");

describe('rtl-tcp Node', function () {

  // beforeEach(function (done) {
  //   helper.startServer(done);
  // });

  // afterEach(function (done) {
  //   helper.unload();
  //   helper.stopServer(done);
  // });

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n1", type: "rtl-tcp", name: "test name" }];
    helper.load(rtltcpNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test name');
      done();
    });
  });

  xit('should make payload lower case', function (done) {
    var flow = [
      { id: "n1", type: "rtl-tcp", name: "test name", wires: [["n2"]] },
      { id: "n2", type: "helper" }
    ];

    helper.load(rtltcpNode, flow, function () {
      var n1 = helper.getNode("n1");
      var n2 = helper.getNode("n2");

      n2.on("input", function (msg) {
        msg.should.have.property('payload', 'uppercase');
        done();
      });

      n1.receive({ payload: "UpperCase" });
    });
  });
});