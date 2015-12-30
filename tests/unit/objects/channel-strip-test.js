import { module, test } from 'qunit';
import Ember from 'ember';
import ChannelStrip from 'ember-audio/objects/channel-strip';
import GainObject from 'ember-audio/objects/gain';
import AudioService from 'ember-audio/services/audio-service';

module('Unit | Object | channel strip');

var audioService = AudioService.create();

test('it works', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.ok(subject);
});

test('bypass should be false', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('bypass'), false, `'bypass' should be false`);
});

test('polarity should be true', function(assert) {
  assert.expect(1);
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('polarity'), true, `'polarity' should be true`);
});

test('polarity should be the same as inputGainStage.polarity', function(assert) {
  assert.expect(5);
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('polarity'), subject.get('inputGainStage.polarity'), `'polarity' should be 'inputGainStage.polarity'`);

  subject.set('polarity', true);
  assert.equal(subject.get('polarity'), true, `'polarity' should be true`);
  assert.equal(subject.get('inputGainStage.polarity'), true, `'polarity' should be true`);

  subject.set('polarity', false);
  assert.equal(subject.get('polarity'), false, `'polarity' should be false`);
  assert.equal(subject.get('inputGainStage.polarity'), false, `'polarity' should be false`);
});

test('mute should be false', function(assert) {
  assert.expect(1);
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('mute'), false, `'mute' should be false`);
});

test('mute should be the same as outputGainStage.mute', function(assert) {
  assert.expect(5);
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('mute'), subject.get('outputGainStage.mute'), `'mute' should be 'outputGainStage.mute'`);

  subject.set('mute', true);
  assert.equal(subject.get('polarity'), true, `'polarity' should be true`);
  assert.equal(subject.get('inputGainStage.polarity'), true, `'polarity' should be true`);

  subject.set('mute', false);
  assert.equal(subject.get('mute'), false, `'mute' should be false`);
  assert.equal(subject.get('inputGainStage.mute'), false, `'mute' should be false`);
});

test('inputGain should be 1', function(assert) {
  assert.expect(1);
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('inputGain'), 1, `'inputGain' should be 1`);
});

test('inputGain should be the same as inputGainStage.gain', function(assert) {
  assert.expect(5);
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('inputGain'), subject.get('inputGainStage.gain'), `'inputGain' should be 'inputGainStage.gain'`);

  subject.set('inputGain', 0.5);
  assert.equal(subject.get('inputGain'), 0.5, `'inputGain' should be 0.5`);
  assert.equal(subject.get('inputGainStage.gain'), 0.5, `'inputGainStage.gain' should be 0.5`);

  subject.set('inputGain', 0);
  assert.equal(subject.get('inputGain'), 0, `'inputGain' should be 0`);
  assert.equal(subject.get('inputGainStage.gain'), 0, `'inputGainStage.gain' should be 0`);
});

test('outputGain should be the same as outputGainStage.gain', function(assert) {
  assert.expect(5);
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('outputGain'), subject.get('outputGainStage.gain'), `'inputGain' should be 'inputGainStage.gain'`);

  subject.set('outputGain', 0.5);
  assert.equal(subject.get('outputGain'), 0.5, `'outputGain' should be 0.5`);
  assert.equal(subject.get('outputGainStage.gain'), 0.5, `'outputGainStage.gain' should be 0.5`);

  subject.set('outputGain', 0);
  assert.equal(subject.get('outputGain'), 0, `'outputGain' should be 0`);
  assert.equal(subject.get('outputGainStage.gain'), 0, `'outputGainStage.gain' should be 0`);
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

test('bypassNodes method true', function (assert) {
  assert.expect(2);
  var ChannelStripObject = ChannelStrip.extend({
    createIO: () => {},
    inputGainStage: {
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'outputGainStage', `'node.name' should be 'outputGainStage'`);
      }
    },
    outputGainStage: {
      name: 'outputGainStage'
    }
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.bypassNodes(true);
});

test('bypassNodes method false - 0 nodes', function (assert) {
  assert.expect(2);
  var ChannelStripObject = ChannelStrip.extend({
    createIO: () => {},
    inputGainStage: {
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'outputGainStage', `'node.name' should be 'outputGainStage'`);
      }
    },
    outputGainStage: {
      name: 'outputGainStage'
    }
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.bypassNodes(false);
});

test('bypassNodes method false - 1 node', function (assert) {
  assert.expect(4);
  var ChannelStripObject = ChannelStrip.extend({
    createIO: () => {},
    inputGainStage: {
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'node', `'node.name' should be 'node'`);
      }
    },
    outputGainStage: {
      name: 'outputGainStage'
    }
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.set('nodes', Ember.A([
    {
      name: 'node',
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'outputGainStage', `'node.name' should be 'outputGainStage'`);
      }
    }
  ]));
  subject.bypassNodes(false);
});

test('chainNodes method - 0 nodes', function (assert) {
  assert.expect(2);
  var ChannelStripObject = ChannelStrip.extend({
    createIO: () => {},
    inputGainStage: {
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'outputGainStage', `'node.name' should be 'outputGainStage'`);
      }
    },
    outputGainStage: {
      name: 'outputGainStage'
    }
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.chainNodes();
});

test('chainNodes method - 0 nodes, calls bypassNodes method', function (assert) {
  assert.expect(3);
  var ChannelStripObject = ChannelStrip.extend({
    bypassNodes: (bypass) => {
      assert.ok(true, `'bypassNodes' method has been called`);
      assert.ok(bypass, `'bypass' should be true`);
    }
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  // subject.chainNodes();
  assert.ok(subject);
});

test('chainNodes method - 1 node', function (assert) {
  assert.expect(4);
  var ChannelStripObject = ChannelStrip.extend({
    createIO: () => {},
    inputGainStage: {
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'node', `'node.name' should be 'node'`);
      }
    },
    outputGainStage: {
      name: 'outputGainStage'
    }
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.set('nodes', Ember.A([
    {
      name: 'node',
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'outputGainStage', `'node.name' should be 'outputGainStage'`);
      }
    }
  ]));
  subject.chainNodes();
});

test('chainNodes method - 2 nodes', function (assert) {
  assert.expect(6);
  var ChannelStripObject = ChannelStrip.extend({
    createIO: () => {},
    inputGainStage: {
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'node1', `'node.name' should be 'node1'`);
      }
    },
    outputGainStage: {
      name: 'outputGainStage'
    }
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  subject.set('nodes', Ember.A([
    {
      name: 'node1',
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'node2', `'node.name' should be 'node2'`);
      }
    },
    {
      name: 'node2',
      connectOutput: (node) => {
        assert.ok(true, `'connectOutput' method has been called`);
        assert.equal(node.name, 'outputGainStage', `'node.name' should be 'outputGainStage'`);
      }
    }
  ]));
  subject.chainNodes();
});

test('createIO method', function(assert) {
  assert.expect(3);
  var subject = ChannelStrip.create({ audioService: audioService });
  subject.setProperties({
    createInputGainStage: () => assert.ok(true, `'createInputGainStage' method has been called`),
    createOutputGainStage: () => assert.ok(true, `'createOutputGainStage' method has been called`),
    chainNodes: () => assert.ok(true, `'chainNodes' method has been called`)
  });
  subject.createIO();
});

test('createIO method is called on init', function(assert) {
  assert.expect(2);
  var ChannelStripObject = ChannelStrip.extend({
    createIO: () => assert.ok(true, `'createIO' method has been called`)
  });
  var subject = ChannelStripObject.create({ audioService: audioService });
  assert.ok(subject);
});

test('createInputGainStage method', function(assert) {
  assert.expect(2);
  var subject = ChannelStrip.create({ audioService: audioService });
  subject.set('createGain', () => {
    assert.ok(true, `'createGain' method has been called`);
    return {id:1};
  });
  subject.createInputGainStage();
  assert.equal(subject.get('inputGainStage.id'), 1, `'inputGainStage.id' should be 1`);
});

test('createOutputGainStage method', function(assert) {
  assert.expect(2);
  var subject = ChannelStrip.create({ audioService: audioService });
  subject.set('createGain', () => {
    assert.ok(true, `'createGain' method has been called`);
    return {id:1};
  });
  subject.createOutputGainStage();
  assert.equal(subject.get('outputGainStage.id'), 1, `'outputGainStage.id' should be 1`);
});

test('createGain', function(assert) {
  assert.expect(2);
  var subject = ChannelStrip.create({ audioService: audioService });
  var gainObject = subject.createGain();
  assert.equal(typeof gainObject, 'object', `'gainObject' should be an object`);
  assert.equal(gainObject.get('processor.gain.value'), 1, `'gainObject.processor.gain.value' should be 1`);
});

test('add input Gain Stage', function(assert) {
  assert.expect(1);
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('inputGainStage.processor.gain.value'), 1, `'inputGainStage.processor.gain.value' should be 1`);
});

test('add output Gain Stage', function(assert) {
  var subject = ChannelStrip.create({ audioService: audioService });
  assert.equal(subject.get('outputGainStage.processor.gain.value'), 1, `'outputGainStage.processor.gain.value' should be 1`);
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

test('changeInput method', function (assert) {
  assert.expect(3);

  var input = audioService.createGain();
  input.set('connectOutput', (obj) => {
    assert.ok(true, `'connectOutput' method has been called`);
    assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
  });
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

test('bypassChanged observer', function(assert) {
  assert.expect(4);
  var subject = ChannelStrip.create({ audioService: audioService });

  subject.set('bypassNodes', (bypass) => {
    assert.ok(`'bypassNodes' method has been called`);
    assert.equal(bypass, true, `'bypass' should be true`);
  });
  subject.set('bypass', true);

  subject.set('bypassNodes', (bypass) => {
    assert.ok(`'bypassNodes' method has been called`);
    assert.equal(bypass, false, `'bypass' should be false`);
  });
  subject.set('bypass', false);
});
