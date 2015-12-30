import { module, test } from 'qunit';
import Ember from 'ember';
import ProcessorMixin from '../../../mixins/processor';
import io from '../../../mixins/io';
import AudioService from 'ember-audio/services/audio-service';

var audioService = AudioService.create();

module('Unit | Mixin | processor');

test('it works', function(assert) {
  var ProcessorObject = Ember.Object.extend(io, ProcessorMixin);
  var subject = ProcessorObject.create();
  assert.ok(subject);
});

test('audioContext alias', function(assert) {
  var ProcessorObject = Ember.Object.extend(io, ProcessorMixin);
  var subject = ProcessorObject.create();
  subject.set('audioService', {
    name: 'audio-service',
    audioContext: { name: 'audio-context' }
  });
  assert.equal(subject.get('audioContext.name'), 'audio-context', `'audioContext.name' should be 'audio-context'`);
});

test('createProcessor method is called when the object is created', function(assert) {
  assert.expect(2);
  var ProcessorObject = Ember.Object.extend(io, ProcessorMixin, {
    createProcessor: function () {
      assert.ok(true, `'createProcessor' method was called`);
    }
  });

  var subject = ProcessorObject.create();
  assert.ok(subject);
});

test('processor property is set when object is created', function(assert) {
  assert.expect(1);
  var ProcessorObject = Ember.Object.extend(io, ProcessorMixin, {
    createProcessor: function () {
      return { test: 1 };
    }
  });

  var subject = ProcessorObject.create();
  assert.equal(subject.get('processor.test'), 1);
});

test('connectProcessor method is called when the object is created', function(assert) {
  assert.expect(2);
  var ProcessorObject = Ember.Object.extend(io, ProcessorMixin, {
    createProcessor: function () {
      return { test: 1 };
    },
    connectProcessor: function () {
      assert.ok(true, `'connectProcessor' method was called`);
    }
  });

  var subject = ProcessorObject.create();
  assert.ok(subject);
});

test('connectProcessor method is called with correct params', function(assert) {
  assert.expect(2);
  var ProcessorObject = Ember.Object.extend(io, ProcessorMixin, {
    createProcessor: function () {
      return Ember.Object.create({ test: 1 });
    },
    connectProcessor: function () {
      assert.ok(true, `'connectProcessor' method was called`);
      // assert.equal(processor.get('test'), 1, `'connectProcessor' method was called with the correct params`);
    }
  });

  var subject = ProcessorObject.create();
  assert.ok(subject);
});

// test('connectProcessor method is called with correct params', function(assert) {
//   assert.expect(3);
//   var ProcessorObject = Ember.Object.extend(io, ProcessorMixin, {
//     createProcessor: function () {
//       return Ember.Object.create({ test: 1 });
//     },
//     connectProcessor: function (processor) {
//       assert.ok(true, `'connectProcessor' method was called`);
//       assert.equal(processor.get('test'), 1, `'connectProcessor' method was called with the correct params`);
//     }
//   });
//
//   var subject = ProcessorObject.create();
//   assert.ok(subject);
// });

test('connectProcessor method connects input to processor to output', function(assert) {
  assert.expect(3);
  var destination = audioService.createGain({ name: 'Output' });
  var source = audioService.createGain({ name: 'Output' });
  source.set('connectOutput', (obj) => {
    assert.equal(obj.get('name'), 'ProcessorObject', `'obj.name' should be 'ProcessorObject'`);
  });

  var ProcessorObject = Ember.Object.extend(io, ProcessorMixin, {
    name: 'ProcessorObject',
    input: source,
    output: destination,
    connectOutput: function (obj) {
      assert.equal(obj.get('name'), 'Output', `'obj.name' should be 'Output'`);
    },
    createProcessor: function () {
      return audioService.createGain({ name: 'processor' });
    }
  });

  var subject = ProcessorObject.create();
  assert.ok(subject);
});

test('connectProcessor method warns when IoMixin is not included', function(assert) {
  var warn = Ember.Logger.warn;

  assert.expect(2);
  Ember.Logger.warn = (str) => assert.equal(str, `The 'ProcessorMixin' relies on properties and methods provided by the 'IoMixin'.`);

  var destination = audioService.createGain({ name: 'Output' });
  var source = audioService.createGain({ name: 'Output' });

  var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
    name: 'ProcessorObject',
    input: source,
    output: destination,
    createProcessor: function () {
      return audioService.createGain({ name: 'processor' });
    }
  });

  var subject = ProcessorObject.create();
  assert.ok(subject);

  Ember.Logger.warn = warn;
});

// test('inputChanged observer', function(assert) {
//   assert.expect(3);
//
//   var ProcessorObject = Ember.Object.extend(io, ProcessorMixin, {
//     connect: function () {},
//     disconnect: function () {}
//   });
//   var subject = ProcessorObject.create();
//
//   subject.set('changeInput', () => assert.ok('changeInput method has been called'));
//   subject.set('changeOutput', () => {});
//
//   subject.set('processor', {});
//   subject.set('input', {});
//   assert.ok(subject);
// });

// test('outputChanged observer', function(assert) {
//   assert.expect(3);
//
//   var ProcessorObject = Ember.Object.extend(io, ProcessorMixin);
//   var subject = ProcessorObject.create();
//
//   subject.set('changeInput', () => {});
//   subject.set('changeOutput', () => assert.ok('changeOutput method has been called'));
//
//   subject.set('processor', {});
//   subject.set('output', {});
//   assert.ok(subject);
// });
