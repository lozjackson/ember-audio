import { module, test } from 'qunit';
import Gain from 'ember-audio/objects/gain';
import AudioService from 'ember-audio/services/audio-service';

var audioService = AudioService.create();

module('Unit | Object | gain');

test('it works', function(assert) {
  var subject = Gain.create();
  assert.ok(subject);
});

test('gain should default to 1', function(assert) {
  var subject = Gain.create({ audioService: audioService });
  assert.equal(subject.get('gain'), 1, `'gain' should be 1`);
});

test('polarity should be true', function(assert) {
  assert.expect(1);
  var subject = Gain.create({ audioService: audioService });
  assert.equal(subject.get('polarity'), true, `'polarity' should be true`);
});

test('mute should be false', function(assert) {
  assert.expect(1);
  var subject = Gain.create({ audioService: audioService });
  assert.equal(subject.get('mute'), false, `'mute' should be false`);
});

test('min should default to 0', function(assert) {
  var subject = Gain.create();
  assert.equal(subject.get('min'), 0, `'min' should be 0`);
});

test('max should default to 1', function(assert) {
  var subject = Gain.create();
  assert.equal(subject.get('max'), 1, `'max' should be 1`);
});

test('audioContext alias', function(assert) {
  var subject = Gain.create();
  subject.set('audioService', {
    name: 'audio-service',
    audioContext: { name: 'audio-context' }
  });
  assert.equal(subject.get('audioContext.name'), 'audio-context', `'audioContext.name' should be 'audio-context'`);
});

test('_gain computed property', function (assert) {
  assert.expect(1);
  var subject = Gain.create({ audioService: audioService });
  assert.equal(subject.get('_gain'), 1, `'_gain' should be 1`);
});

test('_gain computed property - inverted polarity', function (assert) {
  assert.expect(1);
  var subject = Gain.create({
    audioService: audioService ,
    polarity: false
  });
  assert.equal(subject.get('_gain'), -1, `'_gain' should be -1`);
});

test('createProcessor method is called when the object is created', function(assert) {
  assert.expect(2);
  var GainObject = Gain.extend({
    createProcessor: function () {
      assert.ok(true, `'createProcessor' method was called`);
    }
  });

  test('setGain method', function(assert) {
    assert.expect(2);
    var subject = Gain.create({ audioService: audioService });
    assert.equal(subject.get('processor.gain.value'), 1, `'processor.gain.value' should be 1`);
    subject.setGain(0.5);
    assert.equal(subject.get('processor.gain.value'), 0.5, `'processor.gain.value' should be 0.5`);
  });

  var subject = GainObject.create();
  assert.ok(subject);
});

test('processor property is set when object is created', function(assert) {
  assert.expect(1);
  var GainObject = Gain.extend({
    createProcessor: function () {
      return { test: 1 };
    }
  });

  var subject = GainObject.create();
  assert.equal(subject.get('processor.test'), 1);
});

test('createProcessor method', function(assert) {
  assert.expect(4);
  var audioService = { audioContext: {
    createGain: function () {
      assert.ok(true, `'createGain' method is called`);
      return {name: 'gain-node', gain: { value: 1}};
    }
  }};
  var subject = Gain.create({ audioService: audioService });

  assert.ok(subject.get('processor'));
  assert.equal(subject.get('processor.name'), 'gain-node', `'processor.name' should be 1`);
  assert.equal(subject.get('processor.gain.value'), 1, `'processor.gain.value' should be 1`);
});

test('gainChanged', function(assert) {
  assert.expect(2);
  var subject = Gain.create({ audioService: audioService });
  assert.equal(subject.get('processor.gain.value'), 1, `'processor.gain.value' should be 1`);
  subject.setGain(0.5);
  assert.equal(subject.get('processor.gain.value'), 0.5, `'processor.gain.value' should be 0.5`);
});

test('polarityChanged', function(assert) {
  assert.expect(3);
  var subject = Gain.create({ audioService: audioService });
  assert.equal(subject.get('processor.gain.value'), 1, `'processor.gain.value' should be 1`);

  subject.set('polarity', false);
  assert.equal(subject.get('processor.gain.value'), -1, `'processor.gain.value' should be -1`);

  subject.set('polarity', true);
  assert.equal(subject.get('processor.gain.value'), 1, `'processor.gain.value' should be 1`);
});

test('polarity and gain changed', function(assert) {
  assert.expect(4);
  var subject = Gain.create({ audioService: audioService });
  assert.equal(subject.get('processor.gain.value'), 1, `'processor.gain.value' should be 1`);

  subject.set('gain', 0.5);
  assert.equal(subject.get('processor.gain.value'), 0.5, `'processor.gain.value' should be 0.5`);

  subject.set('polarity', false);
  assert.equal(subject.get('processor.gain.value'), -0.5, `'processor.gain.value' should be -0.5`);

  subject.set('polarity', true);
  assert.equal(subject.get('processor.gain.value'), 0.5, `'processor.gain.value' should be 0.5`);
});

test('muteChanged', function(assert) {
  assert.expect(3);
  var subject = Gain.create({ audioService: audioService });
  assert.equal(subject.get('processor.gain.value'), 1, `'processor.gain.value' should be 1`);

  subject.set('mute', true);
  assert.equal(subject.get('processor.gain.value'), 0, `'processor.gain.value' should be 0`);

  subject.set('mute', false);
  assert.equal(subject.get('processor.gain.value'), 1, `'processor.gain.value' should be 1`);
});

test('muteChanged with gain at half', function(assert) {
  assert.expect(3);
  var subject = Gain.create({
    audioService: audioService,
    gain: 0.5
  });

  assert.equal(subject.get('processor.gain.value'), 0.5, `'processor.gain.value' should be 0.5`);

  subject.set('mute', true);
  assert.equal(subject.get('processor.gain.value'), 0, `'processor.gain.value' should be 0`);

  subject.set('mute', false);
  assert.equal(subject.get('processor.gain.value'), 0.5, `'processor.gain.value' should be 0.5`);
});

test('muteChanged with polarity inverted', function(assert) {
  assert.expect(3);
  var subject = Gain.create({
    audioService: audioService,
    polarity: false
  });
  assert.equal(subject.get('processor.gain.value'), -1, `'processor.gain.value' should be -1`);

  subject.set('mute', true);
  assert.equal(subject.get('processor.gain.value'), 0, `'processor.gain.value' should be 0`);

  subject.set('mute', false);
  assert.equal(subject.get('processor.gain.value'), -1, `'processor.gain.value' should be -1`);
});
