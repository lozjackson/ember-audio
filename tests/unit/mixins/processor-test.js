import Ember from 'ember';
import ProcessorMixin from '../../../mixins/processor';
import { module, test } from 'qunit';

module('Unit | Mixin | processor');

test('it works', function(assert) {
  var ProcessorObject = Ember.Object.extend(ProcessorMixin);
  var subject = ProcessorObject.create();
  assert.ok(subject);
});

test('audioContext alias', function(assert) {
  var ProcessorObject = Ember.Object.extend(ProcessorMixin);
  var subject = ProcessorObject.create();
  subject.set('audioService', {
    name: 'audio-service',
    audioContext: { name: 'audio-context' }
  });
  assert.equal(subject.get('audioContext.name'), 'audio-context', `'audioContext.name' should be 'audio-context'`);
});

test('createProcessor method is called when the object is created', function(assert) {
  assert.expect(2);
  var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
    createProcessor: function () {
      assert.ok(true, `'createProcessor' method was called`);
    }
  });

  var subject = ProcessorObject.create();
  assert.ok(subject);
});

test('processor property is set when object is created', function(assert) {
  assert.expect(1);
  var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
    createProcessor: function () {
      return { test: 1 };
    }
  });

  var subject = ProcessorObject.create();
  assert.equal(subject.get('processor.test'), 1);
});

test('connectProcessor method is called when the object is created', function(assert) {
  assert.expect(2);
  var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
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
  assert.expect(3);
  var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
    createProcessor: function () {
      return Ember.Object.create({ test: 1 });
    },
    connectProcessor: function (processor) {
      assert.ok(true, `'connectProcessor' method was called`);
      assert.equal(processor.get('test'), 1, `'connectProcessor' method was called with the correct params`);
    }
  });

  var subject = ProcessorObject.create();
  assert.ok(subject);
});

test('connectProcessor method connects input to processor to output', function(assert) {
  assert.expect(3);
  var output = { name: 'output' };
  var input = {
    connectOutput: function (obj) {
      assert.equal(obj.name, 'processor', `input is connected to processor`);
    }
  };

  var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
    input: input,
    output: output,
    connectOutput: function (obj) {
      assert.equal(obj.name, 'output', `processor is connected to output`);
    },
    createProcessor: function () {
      return {
        name: 'processor'
        // connect: function (obj) {
        //   assert.equal(obj.name, 'output', `processor is connected to output`);
        // }
      };
    }
  });

  var subject = ProcessorObject.create();
  assert.ok(subject);
});

// test('inputChanged observer', function(assert) {
//   assert.expect(3);
//
//   var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
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
//   var ProcessorObject = Ember.Object.extend(ProcessorMixin);
//   var subject = ProcessorObject.create();
//
//   subject.set('changeInput', () => {});
//   subject.set('changeOutput', () => assert.ok('changeOutput method has been called'));
//
//   subject.set('processor', {});
//   subject.set('output', {});
//   assert.ok(subject);
// });
