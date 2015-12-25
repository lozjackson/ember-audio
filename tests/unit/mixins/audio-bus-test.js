import Ember from 'ember';
import AudioBusMixin from '../../../mixins/audio-bus';
import { module, test } from 'qunit';

module('Unit | Mixin | audio bus');

// var AudioService = {
//   audioContext: {
//     createGain: function () {
//       return {
//         gain: {
//           value: 1
//         }
//       };
//     }
//   }
// };
var AudioContext = window.AudioContext;
var AudioService = {
  audioContext: new AudioContext()
};

// Replace this with your real tests.
test('it works', function(assert) {
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.ok(subject);
});

// bus

test('polarity should be true', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('polarity'), true, `'polarity' should be true`);
});

test('mute should be false', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('mute'), false, `'mute' should be false`);
});

test('gain should be 1', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('gain'), 1, `'gain' should be 1`);
});

test('bus.gain.value should be 0.5', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({
    audioService: AudioService,
    gain: 0.5
  });
  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);
});

test('audioContext alias', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: {
    audioContext: {
      name: 'audio-context',
      createGain: function () {
      }
    }
  }});
  assert.equal(subject.get('audioContext.name'), 'audio-context', `'audioContext.name' should be 'audio-context'`);
});

test('_gain computed property', function (assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('_gain'), 1, `'_gain' should be 1`);
});

test('_gain computed property - inverted polarity', function (assert) {
  // assert.expect(2);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({
    audioService: AudioService ,
    polarity: false
  });
  assert.equal(subject.get('_gain'), -1, `'_gain' should be -1`);
});

test('createBus method', function(assert) {
  assert.expect(2);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  var bus = subject.createBus();
  assert.equal(bus.gain.value, 1, `'bus.gain.value' should be 1`);
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
});

test('setGain method', function(assert) {
  assert.expect(2);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
  subject.setGain(0.5);
  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);
});

test('gainChanged', function(assert) {
  assert.expect(2);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
  subject.setGain(0.5);
  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);
});

test('polarityChanged', function(assert) {
  assert.expect(3);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);

  subject.set('polarity', false);
  assert.equal(subject.get('bus.gain.value'), -1, `'bus.gain.value' should be -1`);

  subject.set('polarity', true);
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
});

test('polarity and gain changed', function(assert) {
  assert.expect(4);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);

  subject.set('gain', 0.5);
  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);

  subject.set('polarity', false);
  assert.equal(subject.get('bus.gain.value'), -0.5, `'bus.gain.value' should be -0.5`);

  subject.set('polarity', true);
  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);
});

test('muteChanged', function(assert) {
  assert.expect(3);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: AudioService });
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);

  subject.set('mute', true);
  assert.equal(subject.get('bus.gain.value'), 0, `'bus.gain.value' should be 0`);

  subject.set('mute', false);
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
});

test('muteChanged with gain at half', function(assert) {
  assert.expect(3);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({
    audioService: AudioService,
    gain: 0.5
  });

  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);

  subject.set('mute', true);
  assert.equal(subject.get('bus.gain.value'), 0, `'bus.gain.value' should be 0`);

  subject.set('mute', false);
  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);
});

test('muteChanged with polarity inverted', function(assert) {
  assert.expect(3);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({
    audioService: AudioService,
    polarity: false
  });
  assert.equal(subject.get('bus.gain.value'), -1, `'bus.gain.value' should be -1`);

  subject.set('mute', true);
  assert.equal(subject.get('bus.gain.value'), 0, `'bus.gain.value' should be 0`);

  subject.set('mute', false);
  assert.equal(subject.get('bus.gain.value'), -1, `'bus.gain.value' should be -1`);
});
