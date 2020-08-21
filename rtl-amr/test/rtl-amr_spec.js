var helper = require("node-red-node-test-helper");
var rtlamrNode = require("../rtl-amr.js");

describe('rtl-amr Node', function () {

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
    var flow = [{ id: "n1", type: "rtl-amr", name: "test name" }];
    helper.load(rtlamrNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test name');
      done();
    });
  });

  xit('should make payload lower case', function (done) {
    var flow = [
      { id: "n1", type: "rtl-amr ", name: "test name", wires: [["n2"]] },
      { id: "n2", type: "helper" }
    ];

    helper.load(rtlamrNode, flow, function () {
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