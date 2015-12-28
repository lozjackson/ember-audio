import ChannelStrip from 'ember-audio/objects/channel-strip';
import GainObject from 'ember-audio/objects/gain';
import AudioService from 'ember-audio/services/audio-service';
import { module, test } from 'qunit';

module('Unit | Object | channel strip');

var audioService = AudioService.create();

test('it works', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.ok(subject);
});

test('audioContext alias', function(assert) {
  var subject = ChannelStrip.create({
    audioService: {
      name: 'audio-service',
      audioContext: { name: 'audio-context' }
    }
  });
  assert.equal(subject.get('audioContext.name'), 'audio-context', `'audioContext.name' should be 'audio-context'`);
});

test('createGain', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  // assert.equal(subject.get('nodes.length'), 0, `'nodes.length' should be 0`);

  var gainObject = subject.createGain();
  assert.equal(typeof gainObject, 'object', `'gainObject' should be an object`);
  assert.equal(gainObject.get('processor.gain.value'), 1, `'gainObject.processor.gain.value' should be 1`);
});

test('add input Gain Stage', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('inputGainStage.processor.gain.value'), 1, `'inputGainStage.processor.gain.value' should be 1`);
  // assert.equal(subject.get('inputGainStage.processor.gain.value'), 1, `'inputGainStage.processor.gain.value' should be 1`);
});

test('add output Gain Stage', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('outputGainStage.processor.gain.value'), 1, `'outputGainStage.processor.gain.value' should be 1`);
  // assert.equal(subject.get('outputGainStage.processor.gain.value'), 1, `'outputGainStage.processor.gain.value' should be 1`);
});

test('connect method', function(assert) {
  assert.expect(3);
  var gain = audioService.createGain({id:1});

  var subject = ChannelStrip.create({ audioService: audioService });
  subject.set('outputGainStage.connect', (obj) => {
    assert.ok(true, `'outputGainStage.connect' method has been called`);
    assert.equal(obj.get('id'), 1, `'obj.id' should be 1`);
  });
  subject.connect(gain);
  assert.ok(subject);
});

test('disconnect method', function(assert) {
  assert.expect(3);
  var gain = audioService.createGain({id:1});
  var subject = ChannelStrip.create({ audioService: audioService });
  subject.set('outputGainStage.disconnect', (obj) => {
    assert.ok(true, `'outputGainStage.disconnect' method has been called`);
    assert.equal(obj.get('id'), 1, `'obj.id' should be 1`);
  });

  subject.disconnect(gain);
  assert.ok(subject);
});

test('connectOutput method', function(assert) {
  assert.expect(4);

  var ChannelStripObject = ChannelStrip.extend({
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 1, `'obj.id' is 1`);
    },
    disconnect: function () {
      assert.ok(true, `'input.disconnect' method has been called`);
    }
  });

  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.connectOutput({id:1});
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
});

test('connectOutput method disconnects existing output at same index', function(assert) {
  assert.expect(8);
  var ChannelStripObject = ChannelStrip.extend({
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

  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.set('outputs', [{id:1}]);
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');

  subject.connectOutput({id:2});
  assert.equal(subject.get('outputs')[0].id, 2, 'outputs[0].id should be 2');
});

test('connectOutput method does not disconnect other outputs', function(assert) {
  assert.expect(12);
  var ChannelStripObject = ChannelStrip.extend({
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

  var subject = ChannelStripObject.create({ audioService: audioService });
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

// test('changeInput method', function (assert) {
//   assert.expect(3);
//   var input = audioService.createGain({id:1});
//   input.setProperties({
//     connect: function () {
//       assert.ok(true, `'input.connect' method has been called`);
//       // assert.equal(obj.name, 'processor', `input is connected to processor`);
//     },
//     disconnect: function () {
//       assert.ok(true, `'input.disconnect' method has been called`);
//       // assert.equal(obj, 0, `input is disconnected`);
//     }
//   });
//
//   var ChannelStripObject = ChannelStrip.extend({
//     input: input,
//     inputGainStage: {}
//   });
//
//   var subject = ChannelStripObject.create({ audioService: audioService });
//   subject.changeInput();
//   assert.ok(subject);
// });

test('changeInput method', function (assert) {
  assert.expect(3);

  var input = audioService.createGain();
  input.set('connectOutput', (obj) => {
    assert.ok(true, `'connectOutput' method has been called`);
    // Ember.Logger.log('obj', obj);
    assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
    // assert.equal(obj.get('id'), 1, `obj.id should be 1`);
  });
  // var ChannelStripObject = ChannelStrip.extend({
  //   output: output,
  //   connectOutput: function (obj) {
  //     assert.ok(true, `'connectOutput' method has been called`);
  //     assert.equal(obj.get('id'), 1, `obj.id should be 1`);
  //   }
  // });
  var subject = ChannelStrip.create({
    audioService: audioService,
    input: input
  });
  subject.set('inputGainStage.id', 1);
  subject.changeInput();
  assert.ok(subject);
});

test('changeOutput method', function (assert) {
  assert.expect(3);

  var output = audioService.createGain({id:1});

  var ChannelStripObject = ChannelStrip.extend({
    output: output,
    connectOutput: function (obj) {
      assert.ok(true, `'connectOutput' method has been called`);
      assert.equal(obj.get('id'), 1, `obj.id should be 1`);
    }
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.changeOutput();
  assert.ok(subject);
});

test('inputChanged observer', function(assert) {
  assert.expect(3);

  var input = audioService.createGain({id:1});
  var gain = audioService.createGain({id:2});
  var subject = ChannelStrip.create({ audioService: audioService });

  subject.set('changeInput', () => assert.ok('changeInput method has been called'));

  subject.set('inputGainStage', gain);
  subject.set('input', input);
  assert.ok(subject);
});

// test('inputChanged observer - change input', function(assert) {
//   assert.expect(1);
//
//   var input = audioService.createGain({id:1});
//
//   // var input = {
//   //   connect: function (obj) {
//   //     assert.ok(true, `'input.connect' method has been called`);
//   //     assert.equal(obj.get('processor.gain.value'), 1, `'obj.processor.gain.value' should be 1`);
//   //   },
//   //   disconnect: function (obj) {
//   //     assert.ok(true, `'input.disconnect' method has been called`);
//   //     assert.equal(obj, 0, `input is disconnected`);
//   //   }
//   // };
//
//   var subject = ChannelStrip.create({ audioService: audioService });
//   subject.set('input', input);
//   assert.ok(subject);
// });

// test('inputChanged observer - change inputGainStage', function(assert) {
//   // assert.expect(9);
//
//   var input = audioService.createGain({id:1});
//   input.set('connectOutput', (obj) => {
//     assert.ok(true, `'input.connectOutput' method has been called`);
//     assert.equal(obj.get('id'), 1, `obj.id should be 1`);
//   });
//   // var input = {
//   //   connect: function (obj) {
//   //     assert.ok(true, `'input.connect' method has been called`);
//   //     assert.equal(typeof obj, 'object');
//   //   },
//   //   disconnect: function (obj) {
//   //     assert.ok(true, `'input.disconnect' method has been called`);
//   //     assert.equal(obj, 0, `input is disconnected`);
//   //   }
//   // };
//
//   var subject = ChannelStrip.create({ audioService: audioService });
//   subject.set('input', input);
//   subject.set('inputGainStage', {
//     connect: function () {
//
//     },
//     disconnect: function () {}
//   });
//   assert.ok(subject);
// });

// test('outputChanged observer - change output', function(assert) {
//   assert.expect(3);
//
//   var output = audioService.createGain({id:1});
//
//   var ChannelStripObject = ChannelStrip.extend({
//     createOutputGainStage: function () {
//       this.set('outputGainStage', {
//         connectOutput: function (obj) {
//           assert.ok(true, `'outputGainStage.connectOutput' method has been called`);
//           assert.equal(obj.get('id'), 1, `obj.id should be 1`);
//         }
//       });
//     }
//   });
//
//   var subject = ChannelStripObject.create({ audioService: audioService });
//   subject.set('output', output);
//   assert.ok(subject);
// });

test('outputChanged observer', function(assert) {
  assert.expect(3);
  var output = audioService.createGain({id:1});
  var gain = audioService.createGain({id:2});
  var subject = ChannelStrip.create({ audioService: audioService });
  subject.set('changeOutput', () => assert.ok('changeOutput method has been called'));

  subject.set('outputGainStage', gain);
  subject.set('output', output);
  assert.ok(subject);
});

test('addNode method', function (assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('nodes.length'), 0, `'nodes.length' should be 0`);

  subject.addNode(GainObject.create());
  assert.equal(subject.get('nodes.length'), 1, `'nodes.length' should be 1`);

  subject.addNode(GainObject.create());
  assert.equal(subject.get('nodes.length'), 2, `'nodes.length' should be 1`);
});

test('removeNode method', function (assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('nodes.length'), 0, `'nodes.length' should be 0`);
  var gain = GainObject.create();
  subject.addNode(gain);
  assert.equal(subject.get('nodes.length'), 1, `'nodes.length' should be 1`);

  subject.addNode(GainObject.create());
  assert.equal(subject.get('nodes.length'), 2, `'nodes.length' should be 1`);

  subject.removeNode(gain);
  assert.equal(subject.get('nodes.length'), 1, `'nodes.length' should be 1`);
});

// test('chain', function (assert) {
//   assert.expect(1);
//   // var ChannelStripObject = ChannelStrip.extend({
//   //   createInputGainStage: function () {
//   //     this.set('inputGainStage', {
//   //       connect: function () {
//   //         assert.ok(true, `'inputGainStage.connect' method has been called`);
//   //         // assert.equal(obj.name, 'output', `outputGainStage is connected to output`);
//   //       },
//   //       disconnect: function () {}
//   //     });
//   //   },
//   //   createOutputGainStage: function () {
//   //     this.set('outputGainStage', {
//   //       connect: function () {
//   //         assert.ok(true, `'outputGainStage.connect' method has been called`);
//   //         // assert.equal(obj.name, 'output', `outputGainStage is connected to output`);
//   //       },
//   //       disconnect: function () {}
//   //     });
//   //   }
//   // });
//   var subject = ChannelStrip.create({ audioService: audioService });
//   assert.ok(subject);
//
//   var gain1 = GainObject.create({ audioService: audioService });
//   // Ember.Logger.log('message', gain1);
//   if (gain1) {
//     subject.addNode(gain1);
//   }
//
//   // subject.removeNode(gain);
//
//   // subject.chainNodes();
//   // assert.equal(subject.get('inputGainStage.gain'), 1, `'outputGainStage.gain' should be 1`);
//   // assert.equal(subject.get('outputGainStage.processor.gain.value'), 1, `'outputGainStage.processor.gain.value' should be 1`);
// });
