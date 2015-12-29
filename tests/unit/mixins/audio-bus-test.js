import Ember from 'ember';
import AudioBusMixin from '../../../mixins/audio-bus';
import AudioService from 'ember-audio/services/audio-service';
import { module, test } from 'qunit';

module('Unit | Mixin | audio bus');

var audioService = AudioService.create();

// Replace this with your real tests.
test('it works', function(assert) {
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.ok(subject);
});

// bus

test('polarity should be true', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('polarity'), true, `'polarity' should be true`);
});

test('mute should be false', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('mute'), false, `'mute' should be false`);
});

test('gain should be 1', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('gain'), 1, `'gain' should be 1`);
});

test('bus.gain.value should be 0.5', function(assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({
    audioService: audioService,
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

test('input should be bus', function(assert) {
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('input'), subject.get('bus'), `'input' should bethe same as 'bus'`);
});

test('output should be bus', function(assert) {
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('output'), subject.get('bus'), `'output' should bethe same as 'bus'`);
});

test('_gain computed property', function (assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('_gain'), 1, `'_gain' should be 1`);
});

test('_gain computed property - inverted polarity', function (assert) {
  assert.expect(1);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({
    audioService: audioService ,
    polarity: false
  });
  assert.equal(subject.get('_gain'), -1, `'_gain' should be -1`);
});

test('createBus method', function(assert) {
  assert.expect(2);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  var bus = subject.createBus();
  assert.equal(bus.gain.value, 1, `'bus.gain.value' should be 1`);
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
});

test('setGain method', function(assert) {
  assert.expect(2);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
  subject.setGain(0.5);
  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);
});

test('connectOutput method', function(assert) {
  assert.expect(3);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin, {
    connect: function (obj) {
      assert.ok(true, `'bus.connectOutput' method has been called`);
      assert.equal(obj.get('id'), 1, `'obj.id' should be 1`);
    }
  });
  var output = audioService.createGain({id:1});
  var subject = AudioBusObject.create({ audioService: audioService });
  subject.connectOutput(output);
  assert.ok(subject);
});

test('connect method', function(assert) {
  assert.expect(3);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin, {
    createBus: function () {
      var bus = {
        gain: {value: 1},
        connect: function (obj) {
          assert.ok(true, `'bus.connect' method has been called`);
          assert.equal(obj.name, 'output', `bus is connected to output`);
        }
      };
      this.set('bus', bus);
      return bus;
    }
  });
  var subject = AudioBusObject.create({ audioService: audioService });
  subject.connect({name: 'output'});
  assert.ok(subject);
});

test('disconnect method', function(assert) {
  assert.expect(3);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin, {
    createBus: function () {
      var bus = {
        gain: {value: 1},
        disconnect: function (obj) {
          assert.ok(true, `'bus.disconnect' method has been called`);
          assert.equal(obj.name, 'output', `bus is disconnected from output`);
        }
      };
      this.set('bus', bus);
      return bus;
    }
  });
  var subject = AudioBusObject.create({ audioService: audioService });
  subject.disconnect({name: 'output'});
  assert.ok(subject);
});

test('gainChanged', function(assert) {
  assert.expect(2);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
  subject.setGain(0.5);
  assert.equal(subject.get('bus.gain.value'), 0.5, `'bus.gain.value' should be 0.5`);
});

test('polarityChanged', function(assert) {
  assert.expect(3);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);

  subject.set('polarity', false);
  assert.equal(subject.get('bus.gain.value'), -1, `'bus.gain.value' should be -1`);

  subject.set('polarity', true);
  assert.equal(subject.get('bus.gain.value'), 1, `'bus.gain.value' should be 1`);
});

test('polarity and gain changed', function(assert) {
  assert.expect(4);
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create({ audioService: audioService });
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
  var subject = AudioBusObject.create({ audioService: audioService });
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
    audioService: audioService,
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
    audioService: audioService,
    polarity: false
  });
  assert.equal(subject.get('bus.gain.value'), -1, `'bus.gain.value' should be -1`);

  subject.set('mute', true);
  assert.equal(subject.get('bus.gain.value'), 0, `'bus.gain.value' should be 0`);

  subject.set('mute', false);
  assert.equal(subject.get('bus.gain.value'), -1, `'bus.gain.value' should be -1`);
});
