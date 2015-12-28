import Ember from 'ember';
import ProcessorMixin from '../../../mixins/processor';
import { module, test } from 'qunit';

module('Unit | Mixin | processor');

// Replace this with your real tests.
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

// test('connect method', function(assert) {
//   assert.expect(3);
//   var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
//     createProcessor: function () {
//       return {
//         connect: function (obj) {
//           assert.ok(true, `'processor.connect' method has been called`);
//           assert.equal(obj.name, 'output', `processor is connected to output`);
//         }
//       };
//     }
//   });
//
//   var subject = ProcessorObject.create();
//   subject.connect({name: 'output'});
//   assert.ok(subject);
// });
//
// test('disconnect method', function(assert) {
//   assert.expect(3);
//   var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
//     createProcessor: function () {
//       return {
//         name: 'processor',
//         disconnect: function (obj) {
//           assert.ok(true, `'processor.disconnect' method has been called`);
//           assert.equal(obj.name, 'output', `processor is disconnected from output`);
//         }
//       };
//     }
//   });
//
//   var subject = ProcessorObject.create();
//   subject.disconnect({name: 'output'});
//   assert.ok(subject);
// });

// test('connectOutput method', function(assert) {
//   assert.expect(4);
//   var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
//     connect: function (obj) {
//       assert.ok(true, `'input.connect' method has been called`);
//       assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
//       assert.equal(obj.id, 1, `'obj.id' is 1`);
//     },
//     disconnect: function () {
//       assert.ok(true, `'input.disconnect' method has been called`);
//     }
//   });
//
//   var subject = ProcessorObject.create();
//   subject.connectOutput({id:1});
//   assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
// });

// test('connectOutput method disconnects existing output at same index', function(assert) {
//   assert.expect(8);
//   var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
//     connect: function (obj) {
//       assert.ok(true, `'input.connect' method has been called`);
//       assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
//       assert.equal(obj.id, 2, `'obj.id' should be 2`);
//     },
//     disconnect: function (obj) {
//       assert.ok(true, `'input.disconnect' method has been called`);
//       assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
//       assert.equal(obj.id, 1, `'obj.id' should be 1`);
//     }
//   });
//
//   var subject = ProcessorObject.create();
//   subject.set('outputs', [{id:1}]);
//   assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
//
//   subject.connectOutput({id:2});
//   assert.equal(subject.get('outputs')[0].id, 2, 'outputs[0].id should be 2');
// });

// test('connectOutput method does not disconnect other outputs', function(assert) {
//   assert.expect(12);
//   var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
//     connect: function (obj) {
//       assert.ok(true, `'input.connect' method has been called`);
//       assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
//       assert.equal(obj.id, 4, `'obj.id' should be 4`);
//     },
//     disconnect: function (obj) {
//       assert.ok(true, `'input.disconnect' method has been called`);
//       assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
//       assert.equal(obj.id, 2, `'obj.id' should be 2`);
//     }
//   });
//
//   var subject = ProcessorObject.create();
//   subject.set('outputs', [
//     {id:1},
//     {id:2},
//     {id:3}
//   ]);
//   assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
//   assert.equal(subject.get('outputs')[1].id, 2, 'outputs[1].id should be 2');
//   assert.equal(subject.get('outputs')[2].id, 3, 'outputs[2].id should be 3');
//
//   subject.connectOutput({id:4}, 1);
//   assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
//   assert.equal(subject.get('outputs')[1].id, 4, 'outputs[1].id should be 4');
//   assert.equal(subject.get('outputs')[2].id, 3, 'outputs[2].id should be 3');
// });

// test('changeInput method', function (assert) {
//   assert.expect(3);
//   var input = {
//     connect: function () {
//       assert.ok(true, `'input.connect' method has been called`);
//       // assert.equal(obj.name, 'processor', `input is connected to processor`);
//     },
//     disconnect: function () {
//       assert.ok(true, `'input.disconnect' method has been called`);
//       // assert.equal(obj, 0, `input is disconnected`);
//     }
//   };
//
//   var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
//     input: input,
//     processor: {}
//   });
//
//   var subject = ProcessorObject.create();
//   subject.changeInput();
//   assert.ok(subject);
// });

test('inputChanged observer', function(assert) {
  assert.expect(3);

  var ProcessorObject = Ember.Object.extend(ProcessorMixin, {
    connect: function () {},
    disconnect: function () {}
  });
  var subject = ProcessorObject.create();

  subject.set('changeInput', () => assert.ok('changeInput method has been called'));
  subject.set('changeOutput', () => {});

  subject.set('processor', {});
  subject.set('input', {});
  assert.ok(subject);
});

test('outputChanged observer', function(assert) {
  assert.expect(3);

  var ProcessorObject = Ember.Object.extend(ProcessorMixin);
  var subject = ProcessorObject.create();

  subject.set('changeInput', () => {});
  subject.set('changeOutput', () => assert.ok('changeOutput method has been called'));

  subject.set('processor', {});
  subject.set('output', {});
  assert.ok(subject);
});
