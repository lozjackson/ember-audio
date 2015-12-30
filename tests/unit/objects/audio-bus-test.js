import AudioBus from 'ember-audio/objects/audio-bus';
import AudioService from 'ember-audio/services/audio-service';
import { module, test } from 'qunit';

module('Unit | Object | audio bus');

var audioService = AudioService.create();

test('it works', function(assert) {
  var subject = AudioBus.create({ audioService: audioService });
  assert.ok(subject);
});

// test('nodes should be empty array', function(assert) {
//   var subject = AudioBus.create({ audioService: audioService });
//   assert.equal(subject.get('nodes.length'), 0, `'nodes.length' should be 0`);
// });

test('input should be bus', function(assert) {
  var subject = AudioBus.create({ audioService: audioService });
  assert.equal(subject.get('input'), subject.get('bus'), `'input' should bethe same as 'bus'`);
});

// test('output', function(assert) {
//   var subject = AudioBus.create({ audioService: audioService });
//   assert.equal(subject.get('output'), subject.get('bus'), `'output' should bethe same as 'bus'`);
//   var gain = subject.addGain();
//   assert.equal(subject.get('output'), gain.get('processor'), `'output' should bethe same as 'gain.processor'`);
// });

// test('connect method', function(assert) {
//   assert.expect(3);
//   var subject = AudioBus.create({ audioService: audioService });
//   // var AudioBusObject = Ember.Object.extend(AudioBusMixin, {
//   //   createBus: function () {
//   //     var bus = {
//   //       gain: {value: 1},
//   //       connect: function (obj) {
//   //         assert.ok(true, `'bus.connect' method has been called`);
//   //         assert.equal(obj.name, 'output', `bus is connected to output`);
//   //       }
//   //     };
//   //     this.set('bus', bus);
//   //     return bus;
//   //   }
//   // });
//   // var subject = AudioBusObject.create({ audioService: audioService });
//   subject.connect({name: 'output'});
//   assert.ok(subject);
// });

// test('connect method', function(assert) {
//   assert.expect(3);
//   var subject = AudioBus.create({ audioService: audioService });
//   // var AudioBusObject = Ember.Object.extend(AudioBusMixin, {
//   //   createBus: function () {
//   //     var bus = {
//   //       gain: {value: 1},
//   //       connect: function (obj) {
//   //         assert.ok(true, `'bus.connect' method has been called`);
//   //         assert.equal(obj.name, 'output', `bus is connected to output`);
//   //       }
//   //     };
//   //     this.set('bus', bus);
//   //     return bus;
//   //   }
//   // });
//   // var subject = AudioBusObject.create({ audioService: audioService });
//   subject.addGain();
//   subject.connect({name: 'output'});
//   assert.ok(subject);
// });

// test('addGain', function(assert) {
//   var subject = AudioBus.create({ audioService: audioService });
//   assert.equal(subject.get('nodes.length'), 0, `'nodes.length' should be 0`);
//
//   subject.addGain();
//   assert.equal(subject.get('nodes.length'), 1, `'nodes.length' should be 1`);
//
//   subject.addGain();
//   assert.equal(subject.get('nodes.length'), 2, `'nodes.length' should be 2`);
// });
