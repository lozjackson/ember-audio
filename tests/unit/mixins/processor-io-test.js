import Ember from 'ember';
import ProcessorIoMixin from 'ember-audio/mixins/processor-io';
import { module, test } from 'qunit';

module('Unit | Mixin | processor io');

// Replace this with your real tests.
test('it works', function(assert) {
  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin);
  var subject = ProcessorIoObject.create();
  assert.ok(subject);
});

test('createProcessor method is called when the object is created', function(assert) {
  assert.expect(2);
  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      assert.ok(true, `'createProcessor' method was called`);
    }
  });

  var subject = ProcessorIoObject.create();
  assert.ok(subject);
});

test('processor property is set when object is created', function(assert) {
  assert.expect(1);
  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return { test: 1 };
    }
  });

  var subject = ProcessorIoObject.create();
  assert.equal(subject.get('processor.test'), 1);
});

test('connectProcessor method is called when the object is created', function(assert) {
  assert.expect(2);
  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return { test: 1 };
    },
    connectProcessor: function () {
      assert.ok(true, `'connectProcessor' method was called`);
    }
  });

  var subject = ProcessorIoObject.create();
  assert.ok(subject);
});

test('connectProcessor method is called with correct params', function(assert) {
  assert.expect(3);
  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return Ember.Object.create({ test: 1 });
    },
    connectProcessor: function (processor) {
      assert.ok(true, `'connectProcessor' method was called`);
      assert.equal(processor.get('test'), 1, `'connectProcessor' method was called with the correct params`);
    }
  });

  var subject = ProcessorIoObject.create();
  assert.ok(subject);
});

test('connectProcessor method connects input to processor to output', function(assert) {
  assert.expect(3);
  var output = { name: 'output' };
  var input = {
    connect: function (obj) {
      assert.equal(obj.name, 'processor', `input is connected to processor`);
    }
  };

  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    input: input,
    output: output,
    createProcessor: function () {
      return {
        name: 'processor',
        connect: function (obj) {
          assert.equal(obj.name, 'output', `processor is connected to output`);
        }
      };
    }
  });

  var subject = ProcessorIoObject.create();
  assert.ok(subject);
});

test('connect method', function(assert) {
  assert.expect(3);
  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return {
        connect: function (obj) {
          assert.ok(true, `'processor.connect' method has been called`);
          assert.equal(obj.name, 'output', `processor is connected to output`);
        }
      };
    }
  });

  var subject = ProcessorIoObject.create();
  subject.connect({name: 'output'});
  assert.ok(subject);
});

test('disconnect method', function(assert) {
  assert.expect(3);
  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return {
        name: 'processor',
        disconnect: function (obj) {
          assert.ok(true, `'processor.disconnect' method has been called`);
          assert.equal(obj.name, 'output', `processor is disconnected from output`);
        }
      };
    }
  });

  var subject = ProcessorIoObject.create();
  subject.disconnect({name: 'output'});
  assert.ok(subject);
});

test('inputChanged observer - change input', function(assert) {
  assert.expect(5);

  var input = {
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(obj.name, 'processor', `input is connected to processor`);
    },
    disconnect: function (obj) {
      assert.ok(true, `'input.disconnect' method has been called`);
      assert.equal(obj, 0, `input is disconnected`);
    }
  };

  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return { name: 'processor' };
    }
  });

  var subject = ProcessorIoObject.create();
  subject.set('input', input);
  assert.ok(subject);
});

test('inputChanged observer - change processor', function(assert) {
  assert.expect(9);

  var input = {
    connect: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object');
      // assert.equal(obj.name, 'processor', `input is connected to processor`);
    },
    disconnect: function (obj) {
      assert.ok(true, `'input.disconnect' method has been called`);
      assert.equal(obj, 0, `input is disconnected`);
    }
  };

  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return {
        name: 'test',
        disconnect: function () {
        }
      };
    }
  });

  var subject = ProcessorIoObject.create();
  subject.set('input', input);
  subject.set('processor', {
    name: 'processor',
    disconnect: function () {
    }
  });
  assert.ok(subject);
});

test('outputChanged observer - change output', function(assert) {
  assert.expect(5);

  var output = {
    name: 'output'
  };

  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return {
        name: 'processor',
        connect: function (obj) {
          assert.ok(true, `'processor.connect' method has been called`);
          assert.equal(obj.name, 'output', `processor is connected to output`);
        },
        disconnect: function (obj) {
          assert.ok(true, `'processor.disconnect' method has been called`);
          assert.equal(obj, 0, `processor is disconnected`);
        }
      };
    }
  });

  var subject = ProcessorIoObject.create();
  subject.set('output', output);
  assert.ok(subject);
});

test('outputChanged observer - change processor', function(assert) {
  assert.expect(9);

  var output = {
    name: 'output'
  };

  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin, {
    createProcessor: function () {
      return {
        name: 'test',
        connect: function (obj) {
          assert.ok(true, `'processor.connect' method has been called`);
          assert.equal(obj.name, 'output', `processor is connected to output`);
        },
        disconnect: function (obj) {
          assert.ok(true, `'processor.disconnect' method has been called`);
          assert.equal(obj, 0, `processor is disconnected`);
        }
      };
    }
  });

  var subject = ProcessorIoObject.create();
  subject.set('output', output);
  subject.set('processor', {
    name: 'processor',
    connect: function (obj) {
      assert.ok(true, `'processor.connect' method has been called`);
      assert.equal(obj.name, 'output', `processor is connected to output`);
    },
    disconnect: function (obj) {
      assert.ok(true, `'processor.disconnect' method has been called`);
      assert.equal(obj, 0, `processor is disconnected`);
    }
  });
  assert.ok(subject);
});
