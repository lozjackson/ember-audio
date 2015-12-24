import { moduleFor, test } from 'ember-qunit';

moduleFor('service:audio-service', 'Unit | Service | audio service', {

});

test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});

test('audioContext', function(assert) {
  var service = this.subject();
  assert.ok(service.get('audioContext'));
});

test('busses', function(assert) {
  var service = this.subject();
  assert.equal(service.get('busses.length'), 0, `'busses.length' should be 0`);
});

test('output', function(assert) {
  var service = this.subject();
  var output = service.get('audioContext.destination');
  assert.equal(service.get('output'), output, `'output' should be 'audioContext.destination'`);
});

test('createBus method', function(assert) {
  assert.expect(3);
  var service = this.subject();
  assert.equal(service.get('busses.length'), 0, `'busses.length' should be 0`);

  service.createBus();
  assert.equal(service.get('busses.length'), 1, `'busses.length' should be 1`);

  service.createBus();
  assert.equal(service.get('busses.length'), 2, `'busses.length' should be 2`);
});

test('addBus method', function(assert) {
  assert.expect(3);
  var service = this.subject();
  service.set('createBus', () => assert.ok(true, `'createBus' method was called`));
  service.addBus();
  service.addBus(2);
});

test('busses should not be the same object', function(assert) {
  assert.expect(4);
  var service = this.subject();
  assert.equal(service.get('busses.length'), 0, `'busses.length' should be 0`);

  service.addBus(2);
  var bus1 = service.get('busses').objectAt(0);
  var bus2 = service.get('busses').objectAt(1);
  bus1.set('name', 'One');
  bus2.set('name', 'Two');

  assert.equal(service.get('busses.length'), 2, `'busses.length' should be 2`);
  assert.equal(service.get('busses').objectAt(0).get('name'), 'One', `first bus name should be 'One'`);
  assert.equal(service.get('busses').objectAt(1).get('name'), 'Two', `first bus name should be 'Two'`);
});

test('createGain method', function(assert) {
  assert.expect(1);
  var service = this.subject();
  var gainNode = service.createGain();
  assert.equal(gainNode.get('gain'), 1, `'gain' should be 1`);
});

// test('createGain method with params - input', function(assert) {
//   assert.expect(1);
//   var service = this.subject();
//   var gainNode = service.createGain({input: {test:1}});
//   assert.equal(gainNode.get('input.test'), 1, `'gain' should be 1`);
// });
