import Ember from 'ember';
import ProcessorIoMixin from '../../../mixins/processor-io';
import { module, test } from 'qunit';

module('Unit | Mixin | processor io');

// Replace this with your real tests.
test('it works', function(assert) {
  var ProcessorIoObject = Ember.Object.extend(ProcessorIoMixin);
  var subject = ProcessorIoObject.create();
  assert.ok(subject);
});
