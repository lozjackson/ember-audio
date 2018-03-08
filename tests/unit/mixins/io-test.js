import { A } from '@ember/array';
import EmberObject from '@ember/object';
import IoMixin from '../../../mixins/io';
import AudioService from 'ember-audio/services/audio-service';
import { module, test } from 'qunit';

module('Unit | Mixin | io');

var audioService = AudioService.create();

test('it works', function(assert) {
  var IoObject = EmberObject.extend(IoMixin);
  var subject = IoObject.create();
  assert.ok(subject);
});

test('inputs and outputs are reset on init', function(assert) {
  assert.expect(2);
  const inputs = [1,2,3];
  const outputs = [1,2,3];
  var IoObject = EmberObject.extend(IoMixin, {
    inputs,
    outputs
  });

  var subject = IoObject.create();
  assert.equal(subject.get('inputs.length'), 0, 'inputs.length should be 0');
  assert.equal(subject.get('outputs.length'), 0, 'outputs.length should be 0');
});

test('connect method', function(assert) {
  assert.expect(3);
  var IoObject = EmberObject.extend(IoMixin, {
    processor: {
      connect: function (obj) {
        assert.ok(true, `'processor.connect' method has been called`);
        assert.equal(obj.name, 'output', `processor is connected to output`);
      }
    }
  });

  var subject = IoObject.create();
  subject.connect({name: 'output'});
  assert.ok(subject);
});

test('disconnect method', function(assert) {
  assert.expect(3);
  var IoObject = EmberObject.extend(IoMixin, {
    processor: {
      name: 'processor',
      disconnect: function (obj) {
        assert.ok(true, `'processor.disconnect' method has been called`);
        assert.equal(obj.name, 'output', `processor is disconnected from output`);
      }
    }
  });

  var subject = IoObject.create();
  subject.disconnect({name: 'output'});
  assert.ok(subject);
});

test('registerInput method', function(assert) {
  assert.expect(7);
  var source1 = audioService.createGain({id:1});
  var source2 = audioService.createGain({id:2});
  var IoObject = EmberObject.extend(IoMixin, {
    inputs: A()
  });

  var subject = IoObject.create();
  assert.equal(subject.get('inputs.length'), 0, 'inputs.length should be 0');

  subject.registerInput(source1, 3);
  assert.equal(subject.get('inputs.length'), 1, 'inputs.length should be 1');
  assert.equal(subject.get('inputs').objectAt(0).get('node.id'), 1, 'inputs[0].node.id should be 1');
  assert.equal(subject.get('inputs').objectAt(0).get('output'), 3, 'inputs[0].output should be 3');

  subject.registerInput(source2, 0);
  assert.equal(subject.get('inputs.length'), 2, 'inputs.length should be 1');
  assert.equal(subject.get('inputs').objectAt(1).get('node.id'), 2, 'inputs[1].node.id should be 1');
  assert.equal(subject.get('inputs').objectAt(1).get('output'), 0, 'inputs[1].output should be 0');
});

test('unregisterInput method', function(assert) {
  assert.expect(7);
  var source1 = audioService.createGain({id:1});
  var source2 = audioService.createGain({id:2});
  var IoObject = EmberObject.extend(IoMixin, {
    inputs: A()
  });

  var subject = IoObject.create();
  assert.equal(subject.get('inputs.length'), 0, 'inputs.length should be 0');

  subject.registerInput(source1, 3);
  assert.equal(subject.get('inputs.length'), 1, 'inputs.length should be 1');
  assert.equal(subject.get('inputs').findBy('node', source1).get('output'), 3);

  subject.registerInput(source2, 0);
  assert.equal(subject.get('inputs.length'), 2, 'inputs.length should be 1');

  subject.unregisterInput(source1);
  assert.equal(subject.get('inputs.length'), 1, 'inputs.length should be 1');
  assert.equal(subject.get('inputs').findBy('node', source2).get('output'), 0);

  subject.unregisterInput(source2);
  assert.equal(subject.get('inputs.length'), 0, 'inputs.length should be 0');
});

test('connectOutput method - pass audioNode', function(assert) {
  assert.expect(5);
  var destination = audioService.createGain();
  var processor = destination.get('processor');
  processor.id = 1;
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: [],
    connectNode: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 1, `'obj.id' is 1`);
      assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
    },
    disconnect: function () {
      assert.ok(true, `'input.disconnect' method has been called`);
    }
  });

  var subject = IoObject.create();
  subject.connectOutput(destination.get('processor'));
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
});

test('connectOutput method calls registerInput', function(assert) {
  assert.expect(3);
  var destination = audioService.createGain();
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: []
  });

  var subject = IoObject.create();

  destination.set('registerInput', (outputNode, outputNumber) => {
    assert.ok(true, `'registerInput' method was called`);
    assert.equal(outputNode, subject, `'outputNode' should be 'subject'`);
    assert.equal(outputNumber, 0, `'outputNumber' should be 0`);
  });

  subject.connectOutput(destination);
});

test('disconnectOutput method calls unregisterInput', function(assert) {
  assert.expect(2);
  var destination = audioService.createGain();
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: []
  });

  var subject = IoObject.create();

  destination.set('unregisterInput', (node) => {
    assert.ok(true, `'registerInput' method was called`);
    assert.equal(node, subject, `'node' should be 'subject'`);
  });

  subject.connectOutput(destination);
  subject.disconnectOutput(destination);
});

test('connectOutput method does not break when audioNode is passed in', function(assert) {
  assert.expect(1);
  var destination = audioService.createGain();
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: []
  });

  var subject = IoObject.create();
  subject.connectOutput(destination.get('processor'));
  assert.ok(subject);
});

test('disconnectOutput method does not break when audioNode is passed in', function(assert) {
  assert.expect(1);
  var destination = audioService.createGain();
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: []
  });

  var subject = IoObject.create();
  subject.connectOutput(destination.get('processor'));
  subject.disconnectOutput(destination.get('processor'));
  assert.ok(subject);
});

test('connectOutput method - pass object instead of audioNode', function(assert) {
  assert.expect(5);
  var destination = audioService.createGain({id:1});
  var processor = destination.get('processor');
  processor.id = 2;
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: [],
    connectNode: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 1, `'obj.id' is 1`);
      assert.equal(obj.get('processor.gain.value'), 1, `'obj.gain.value' should be 1`);
    },
    disconnect: function () {
      assert.ok(true, `'input.disconnect' method has been called`);
    }
  });

  var subject = IoObject.create();
  subject.connectOutput(destination);
  assert.equal(subject.get('outputs')[0].get('id'), 1, 'outputs[0].id should be 1');
});

test('connectOutput method - check destination inputs reference', function(assert) {
  assert.expect(4);
  var destination = audioService.createGain();
  var IoObject = EmberObject.extend(IoMixin);

  var subject = IoObject.create();
  subject.connectOutput(destination, 2);

  var output = subject.get('outputs')[2];
  assert.equal(output, destination, `'output' should be 'destination'`);
  assert.equal(output.get('inputs.firstObject.node'), subject, `'inputs.firstObject.node' should be 'destination'`);
  assert.equal(output.get('inputs.firstObject.output'), 2, `'inputs.firstObject.output' should be 2`);
  assert.equal(output.get('inputs').findBy('output', 2).get('node'), subject);
});

test('connectOutput method - pass null', function(assert) {
  assert.expect(4);
  var destination = audioService.createGain({id:1});
  var IoObject = EmberObject.extend(IoMixin, { outputs: [] });
  var subject = IoObject.create();

  subject.connectOutput(destination);
  assert.equal(subject.get('outputs.length'), 1, 'outputs.length should be 1');
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');

  subject.connectOutput();
  assert.equal(subject.get('outputs.length'), 1, 'outputs.length should be 1');
  assert.equal(subject.get('outputs')[0], null, 'outputs[0] should be null');
});

test('connectOutput method - pass null, output 2', function(assert) {
  assert.expect(6);
  var destination1 = audioService.createGain();
  var destination2 = audioService.createGain();
  var destination3 = audioService.createGain();
  var destination4 = audioService.createGain();

  var IoObject = EmberObject.extend(IoMixin, { outputs: [] });

  var subject = IoObject.create();

  subject.connectOutput(destination1, 0);
  subject.connectOutput(destination2, 1);
  subject.connectOutput(destination3, 2);
  subject.connectOutput(destination4, 3);

  assert.equal(subject.get('outputs.length'), 4, 'outputs.length should be 4');
  // assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');

  subject.connectOutput(null, 2);
  assert.equal(subject.get('outputs.length'), 4, 'outputs.length should be 4');
  assert.ok(subject.get('outputs')[0], 'outputs[0] should not be null');
  assert.ok(subject.get('outputs')[1], 'outputs[1] should not be null');
  assert.equal(subject.get('outputs')[2], null, 'outputs[2] should be null');
  assert.ok(subject.get('outputs')[3], 'outputs[3] should not be null');

});

test('connectOutput method disconnects existing output at same index', function(assert) {
  assert.expect(8);
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: [],
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 2, `'obj.id' should be 2`);
    },
    disconnect: function (obj) {
      assert.ok(true, `'input.disconnect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 1, `'obj.id' should be 1`);
    }
  });

  var subject = IoObject.create();
  subject.set('outputs', [{id:1}]);
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');

  subject.connectOutput({id:2});
  assert.equal(subject.get('outputs')[0].id, 2, 'outputs[0].id should be 2');
});

test('connectOutput method does not disconnect other outputs', function(assert) {
  assert.expect(12);
  var IoObject = EmberObject.extend(IoMixin, {
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 4, `'obj.id' should be 4`);
    },
    disconnect: function (obj) {
      assert.ok(true, `'input.disconnect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 2, `'obj.id' should be 2`);
    }
  });

  var subject = IoObject.create();
  subject.set('outputs', [
    {id:1},
    {id:2},
    {id:3}
  ]);
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
  assert.equal(subject.get('outputs')[1].id, 2, 'outputs[1].id should be 2');
  assert.equal(subject.get('outputs')[2].id, 3, 'outputs[2].id should be 3');

  subject.connectOutput({id:4}, 1);
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
  assert.equal(subject.get('outputs')[1].id, 4, 'outputs[1].id should be 4');
  assert.equal(subject.get('outputs')[2].id, 3, 'outputs[2].id should be 3');
});

test('disconnectOutput method', function(assert) {
  assert.expect(3);
  var destination = audioService.createGain();
  var processor = destination.get('processor');
  processor.id = 1;
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: [],
    disconnectNode: function () {
      assert.ok(true, `'input.disconnectNode' method has been called`);
    }
  });

  var subject = IoObject.create();
  subject.connectOutput(destination.get('processor'));
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
  subject.disconnectOutput();
  assert.equal(subject.get('outputs')[0], null, 'outputs[0] should be null');
});


test('connectNode method', function(assert) {
  assert.expect(4);
  var destination = audioService.createGain();
  var processor = destination.get('processor');
  processor.id = 1;
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: [],
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 1, `'obj.id' is 1`);
      assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
    }
  });

  var subject = IoObject.create();
  subject.connectNode(destination.get('processor'));
});

test('disconnectNode method', function(assert) {
  assert.expect(4);
  var destination = audioService.createGain();
  var processor = destination.get('processor');
  processor.id = 1;
  var IoObject = EmberObject.extend(IoMixin, {
    outputs: [],
    disconnect: function (obj) {
      assert.ok(true, `'input.disconnect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 1, `'obj.id' is 1`);
      assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
    }
  });

  var subject = IoObject.create();
  subject.disconnectNode(destination.get('processor'));
});

// test('bypassProcessor method', function(assert) {
//   assert.expect(5);
//   var source = audioService.createGain({name: 'source'});
//   var destination = audioService.createGain({id:1});
//   var processor = destination.get('processor');
//   processor.id = 2;
//
//   var bypassNode = {
//       name: 'bypassNode',
//       connect: function (node) {
//         assert.ok(true, `'connect' method has been called`);
//         assert.equal(node.get('name'), 'destination', `'node.name' should be 'destination'`);
//       },
//     };
//
//   var IoObject = Ember.Object.extend(IoMixin, {
//     outputs: [],
//     bypassNode: bypassNode,
//     processor: audioService.get('audioContext').createGain(),
//     inputChanged: Ember.observer('input', 'processor', function() {
//       this.changeInput();
//     })
//   });
//
//   var subject = IoObject.create();
//   // source.connectOutput(subject);
//   subject.set('input', source);
//   subject.connectOutput(destination);
//
//   source.set('connectOutput', (node) => {
//     assert.ok(true, `'connectOutput' method has been called`);
//     assert.equal(node.name, 'bypassNode', `'node.name' should be 'bypassNode'`);
//   });
//
//   assert.equal(subject.get('outputs')[0].get('id'), 1, 'outputs[0].id should be 1');
//
//   subject.bypassProcessor(true);
// });

test('changeInput method', function (assert) {
  assert.expect(3);
  var input = audioService.createGain({id:1});
  var gain = audioService.get('audioContext').createGain({id:2});
  var IoObject = EmberObject.extend(IoMixin);
  var subject = IoObject.create({
    input: input
  });
  subject.set('processor', gain);

  input.set('connectOutput', (obj) => {
    assert.ok(true, `'connectOutput' method has been called`);
    assert.equal(obj.get('processor.gain.value'), 1, `'obj.gain.value' should be 1`);
  });

  subject.changeInput();
  assert.ok(subject);
});

test('changeOutput method', function (assert) {
  assert.expect(3);

  var IoObject = EmberObject.extend(IoMixin, {
    output: {id:1},
    connectOutput: function (obj) {
      assert.ok(true, `'connectOutput' method has been called`);
      assert.equal(obj.id, 1, `obj.id should be 1`);
    }
  });

  var subject = IoObject.create();

  subject.changeOutput();
  assert.ok(subject);
});
