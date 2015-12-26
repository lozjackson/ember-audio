import AudioBus from 'ember-audio/objects/audio-bus';
import AudioService from 'ember-audio/services/audio-service';
import { module, test } from 'qunit';

module('Unit | Object | audio bus');

var audioService = AudioService.create();

test('it works', function(assert) {
  var subject = AudioBus.create({ audioService: audioService });
  assert.ok(subject);
});

test('nodes should be empty array', function(assert) {
  var subject = AudioBus.create({ audioService: audioService });
  assert.equal(subject.get('nodes.length'), 0, `'nodes.length' should be 0`);
});

test('addGain', function(assert) {
  var subject = AudioBus.create({ audioService: audioService });
  assert.equal(subject.get('nodes.length'), 0, `'nodes.length' should be 0`);

  subject.addGain();
  assert.equal(subject.get('nodes.length'), 1, `'nodes.length' should be 1`);

  subject.addGain();
  assert.equal(subject.get('nodes.length'), 2, `'nodes.length' should be 2`);
});
