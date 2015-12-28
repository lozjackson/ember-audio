import Ember from 'ember';
import IoMixin from '../../../mixins/io';
import AudioService from 'ember-audio/services/audio-service';
import { module, test } from 'qunit';

module('Unit | Mixin | io');

var audioService = AudioService.create();

test('it works', function(assert) {
  var IoObject = Ember.Object.extend(IoMixin);
  var subject = IoObject.create();
  assert.ok(subject);
});

test('connect method', function(assert) {
  assert.expect(3);
  var IoObject = Ember.Object.extend(IoMixin, {
    processor: {
      connect: function (obj) {
        assert.ok(true, `'processor.connect' method has been called`);
        assert.equal(obj.name, 'output', `processor is connected to output`);
      }
    }
  });

  var subject = IoObject.create();
  subject.connect({name: 'output'});
  assert.ok(subject);
});

test('disconnect method', function(assert) {
  assert.expect(3);
  var IoObject = Ember.Object.extend(IoMixin, {
    processor: {
      name: 'processor',
      disconnect: function (obj) {
        assert.ok(true, `'processor.disconnect' method has been called`);
        assert.equal(obj.name, 'output', `processor is disconnected from output`);
      }
    }
  });

  var subject = IoObject.create();
  subject.disconnect({name: 'output'});
  assert.ok(subject);
});

test('connectOutput method', function(assert) {
  assert.expect(5);
  var destination = audioService.createGain();
  var processor = destination.get('processor');
  processor.id = 1;
  var IoObject = Ember.Object.extend(IoMixin, {
    outputs: [],
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 1, `'obj.id' is 1`);
      assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
    },
    disconnect: function () {
      assert.ok(true, `'input.disconnect' method has been called`);
    }
  });

  var subject = IoObject.create();
  subject.connectOutput(destination.get('processor'));
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
});

test('connectOutput method - pass object instead of audioNode', function(assert) {
  assert.expect(5);
  var destination = audioService.createGain();
  var processor = destination.get('processor');
  processor.id = 1;
  var IoObject = Ember.Object.extend(IoMixin, {
    outputs: [],
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.id, 1, `'obj.id' is 1`);
      assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
    },
    disconnect: function () {
      assert.ok(true, `'input.disconnect' method has been called`);
    }
  });

  var subject = IoObject.create();
  subject.connectOutput(destination);
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
});

test('connectOutput method - pass null', function(assert) {
  assert.expect(4);
  var destination = audioService.createGain();
  var processor = destination.get('processor');
  processor.id = 1;
  var IoObject = Ember.Object.extend(IoMixin, { outputs: [] });

  var subject = IoObject.create();

  subject.connectOutput(destination);
  assert.equal(subject.get('outputs.length'), 1, 'outputs.length should be 1');
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');

  subject.connectOutput();
  assert.equal(subject.get('outputs.length'), 1, 'outputs.length should be 1');
  assert.equal(subject.get('outputs')[0], null, 'outputs[0] should be null');
});

test('connectOutput method - pass null, output 2', function(assert) {
  assert.expect(6);
  var destination1 = audioService.createGain();
  var destination2 = audioService.createGain();
  var destination3 = audioService.createGain();
  var destination4 = audioService.createGain();

  var IoObject = Ember.Object.extend(IoMixin, { outputs: [] });

  var subject = IoObject.create();

  subject.connectOutput(destination1, 0);
  subject.connectOutput(destination2, 1);
  subject.connectOutput(destination3, 2);
  subject.connectOutput(destination4, 3);

  assert.equal(subject.get('outputs.length'), 4, 'outputs.length should be 4');
  // assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');

  subject.connectOutput(null, 2);
  assert.equal(subject.get('outputs.length'), 4, 'outputs.length should be 4');
  assert.ok(subject.get('outputs')[0], 'outputs[0] should not be null');
  assert.ok(subject.get('outputs')[1], 'outputs[1] should not be null');
  assert.equal(subject.get('outputs')[2], null, 'outputs[2] should be null');
  assert.ok(subject.get('outputs')[3], 'outputs[3] should not be null');

});

// test('connectOutput method', function(assert) {
//   assert.expect(4);
//   var destination = audioService.createGain({id:1});
//   var IoObject = Ember.Object.extend(IoMixin, {
//     outputs: [],
//     connect: function (obj) {
//       assert.ok(true, `'input.connect' method has been called`);
//       assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
//       // assert.equal(obj.id, 1, `'obj.id' is 1`);
//       assert.equal(obj.gain.value, 1, `'obj.gain.value' should be 1`);
//     },
//     disconnect: function () {
//       assert.ok(true, `'input.disconnect' method has been called`);
//     }
//   });
//
//   var subject = IoObject.create();
//   subject.connectOutput(destination);
//   assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
// });

// test('connectOutput method', function(assert) {
//   assert.expect(4);
//   var destination = audioService.createGain({id:1});
//   var IoObject = Ember.Object.extend(IoMixin, {
//     outputs: [],
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
//   var subject = IoObject.create();
//   subject.connectOutput(destination);
//   assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');
// });

test('connectOutput method disconnects existing output at same index', function(assert) {
  assert.expect(8);
  var IoObject = Ember.Object.extend(IoMixin, {
    outputs: [],
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

  var subject = IoObject.create();
  subject.set('outputs', [{id:1}]);
  assert.equal(subject.get('outputs')[0].id, 1, 'outputs[0].id should be 1');

  subject.connectOutput({id:2});
  assert.equal(subject.get('outputs')[0].id, 2, 'outputs[0].id should be 2');
});

test('connectOutput method does not disconnect other outputs', function(assert) {
  assert.expect(12);
  var IoObject = Ember.Object.extend(IoMixin, {
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

  var subject = IoObject.create();
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
//   var IoObject = Ember.Object.extend(IoMixin, {
//     input: input,
//     processor: {}
//   });
//
//   var subject = IoObject.create();
//   subject.changeInput();
//   assert.ok(subject);
// });

test('changeInput method', function (assert) {
  assert.expect(3);

  var input = audioService.createGain({id:1});
  var gain = audioService.createGain({id:2});
  input.set('connectOutput', (obj) => {
    assert.ok(true, `'connectOutput' method has been called`);
    // Ember.Logger.log('obj', obj);
    assert.equal(obj.get('processor.gain.value'), 1, `'obj.gain.value' should be 1`);
    // assert.equal(obj.get('id'), 1, `obj.id should be 1`);
  });
  // var ChannelStripObject = ChannelStrip.extend({
  //   output: output,
  //   connectOutput: function (obj) {
  //     assert.ok(true, `'connectOutput' method has been called`);
  //     assert.equal(obj.get('id'), 1, `obj.id should be 1`);
  //   }
  // });
  var IoObject = Ember.Object.extend(IoMixin);
  var subject = IoObject.create({
    input: input
  });
  subject.set('processor', gain);
  subject.changeInput();
  assert.ok(subject);
});

test('changeOutput method', function (assert) {
  assert.expect(3);

  var IoObject = Ember.Object.extend(IoMixin, {
    output: {id:1},
    connectOutput: function (obj) {
      assert.ok(true, `'connectOutput' method has been called`);
      assert.equal(obj.id, 1, `obj.id should be 1`);
    }
  });

  var subject = IoObject.create();

  subject.changeOutput();
  assert.ok(subject);
});
