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
  assert.equal(gainObject.gain.value, 1, `'gainObject.gain.value' should be 1`);
});

test('add input Gain Stage', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('inputGainStage.gain.value'), 1, `'inputGainStage.gain.value' should be 1`);
  // assert.equal(subject.get('inputGainStage.processor.gain.value'), 1, `'inputGainStage.processor.gain.value' should be 1`);
});

test('add output Gain Stage', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('outputGainStage.gain.value'), 1, `'outputGainStage.gain.value' should be 1`);
  // assert.equal(subject.get('outputGainStage.processor.gain.value'), 1, `'outputGainStage.processor.gain.value' should be 1`);
});

test('inputChanged observer - change input', function(assert) {
  assert.expect(5);

  var input = {
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
    },
    disconnect: function (obj) {
      assert.ok(true, `'input.disconnect' method has been called`);
      assert.equal(obj, 0, `input is disconnected`);
    }
  };

  var subject = ChannelStrip.create({ audioService: audioService });
  subject.set('input', input);
  assert.ok(subject);
});

test('inputChanged observer - change inputGainStage', function(assert) {
  assert.expect(9);

  var input = {
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object');
    },
    disconnect: function (obj) {
      assert.ok(true, `'input.disconnect' method has been called`);
      assert.equal(obj, 0, `input is disconnected`);
    }
  };

  var subject = ChannelStrip.create({ audioService: audioService });
  subject.set('input', input);
  subject.set('inputGainStage', {
    connect: function () {

    },
    disconnect: function () {}
  });
  assert.ok(subject);
});

test('outputChanged observer - change output', function(assert) {
  assert.expect(3);

  // var output = {
  //   name: 'output'
  // };

  var output = audioService.get('audioContext').createGain();

  var ChannelStripObject = ChannelStrip.extend({
    createInputGainStage: function () {
      this.set('inputGainStage', {
        connect: function () {
          assert.ok(true, `'inputGainStage.connect' method has been called`);
          // assert.equal(obj.name, 'output', `outputGainStage is connected to output`);
        },
        disconnect: function () {}
      });
    },
    createOutputGainStage: function () {
      this.set('outputGainStage', {
        connect: function () {
          assert.ok(true, `'outputGainStage.connect' method has been called`);
          // assert.equal(obj.name, 'output', `outputGainStage is connected to output`);
        },
        disconnect: function () {}
      });
    }
  });

  var subject = ChannelStripObject.create({ audioService: audioService });
  // subject.set('outputGainStage', {
  //   connect: function (obj) {
  //     assert.ok(true, `'outputGainStage.connect' method has been called`);
  //     assert.equal(obj.name, 'output', `outputGainStage is connected to output`);
  //   },
  //   disconnect: function () {}
  // });
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
