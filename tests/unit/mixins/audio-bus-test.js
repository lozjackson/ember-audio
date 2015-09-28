import Ember from 'ember';
import AudioBusMixin from '../../../mixins/audio-bus';
import { module, test } from 'qunit';

module('Unit | Mixin | audio bus');

// Replace this with your real tests.
test('it works', function(assert) {
  var AudioBusObject = Ember.Object.extend(AudioBusMixin);
  var subject = AudioBusObject.create();
  assert.ok(subject);
});
