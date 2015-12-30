import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

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

test('channels', function(assert) {
  var service = this.subject();
  assert.equal(service.get('channels.length'), 0, `'channels.length' should be 0`);
});

test('destination', function(assert) {
  var service = this.subject();
  var destination = service.get('audioContext.destination');
  assert.equal(service.get('destination'), destination, `'destination' should be 'audioContext.destination'`);
});

// test('output', function(assert) {
//   var service = this.subject();
//   var output = service.get('audioContext.destination');
//   assert.equal(service.get('output'), output, `'output' should be 'audioContext.destination'`);
// });


test('checkState method', function(assert) {
  assert.expect(0);
  var service = this.subject();
  service.checkState();
});

test('createBus method should return AudioBusObject', function(assert) {
  assert.expect(1);
  var service = this.subject();
  var channel = service.createBus();
  assert.equal(Ember.typeOf(channel), 'instance', `'Ember.typeOf(channel)' should be 'instance'`);
});

// test('createBus method', function(assert) {
//   assert.expect(3);
//   var service = this.subject();
//   assert.equal(service.get('busses.length'), 0, `'busses.length' should be 0`);
//
//   service.createBus();
//   assert.equal(service.get('busses.length'), 1, `'busses.length' should be 1`);
//
//   service.createBus();
//   assert.equal(service.get('busses.length'), 2, `'busses.length' should be 2`);
// });

test('addBus method calls createBus', function(assert) {
  assert.expect(3);
  var service = this.subject();
  service.set('createBus', () => assert.ok(true, `'createBus' method was called`));
  service.addBus();
  service.addBus(2);
});

test('addBus method method adds to the busses array', function(assert) {
  assert.expect(4);
  var service = this.subject();
  assert.equal(service.get('busses.length'), 0, `'busses.length' should be 0`);

  service.addBus();
  assert.equal(service.get('busses.length'), 1, `'busses.length' should be 1`);

  service.addBus();
  assert.equal(service.get('busses.length'), 2, `'busses.length' should be 2`);

  service.addBus(2);
  assert.equal(service.get('busses.length'), 4, `'busses.length' should be 4`);
});

test('busses should be numbered', function(assert) {
  // assert.expect(3);
  var service = this.subject();
  assert.equal(service.get('busses.length'), 0, `'busses.length' should be 0`);

  service.addBus();
  assert.equal(service.get('busses.length'), 1, `'busses.length' should be 1`);
  assert.equal(service.get('busses').objectAt(0).get('id'), 1, `'busses[0].id' should be 1`);

  service.addBus();
  assert.equal(service.get('busses.length'), 2, `'busses.length' should be 2`);
  assert.equal(service.get('busses').objectAt(1).get('id'), 2, `'busses[1].id' should be 2`);

  service.addBus(2);
  assert.equal(service.get('busses.length'), 4, `'busses.length' should be 4`);
  assert.equal(service.get('busses').objectAt(2).get('id'), 3, `'busses[2].id' should be 3`);
  assert.equal(service.get('busses').objectAt(3).get('id'), 4, `'busses[3].id' should be 4`);
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

// test('busses should not share nodes', function(assert) {
//   assert.expect(9);
//   var service = this.subject();
//
//   service.addBus(2);
//   assert.equal(service.get('busses.length'), 2, `'busses.length' should be 2`);
//
//   var bus1 = service.get('busses').objectAt(0);
//   assert.equal(bus1.get('nodes.length'), 0, `'bus1.nodes.length' should be 0`);
//
//   var bus2 = service.get('busses').objectAt(1);
//   assert.equal(bus2.get('nodes.length'), 0, `'bus2.nodes.length' should be 0`);
//
//   bus1.addGain();
//
//   assert.equal(bus1.get('nodes.length'), 1, `'bus1.nodes.length' should be 1`);
//   assert.equal(bus2.get('nodes.length'), 0, `'bus2.nodes.length' should be 0`);
//
//   bus1.addGain();
//   assert.equal(bus1.get('nodes.length'), 2, `'bus1.nodes.length' should be 2`);
//   assert.equal(bus2.get('nodes.length'), 0, `'bus2.nodes.length' should be 0`);
//
//   bus2.addGain();
//   assert.equal(bus1.get('nodes.length'), 2, `'bus1.nodes.length' should be 2`);
//   assert.equal(bus2.get('nodes.length'), 1, `'bus2.nodes.length' should be 1`);
// });

test('createChannel method should return ChannelStripObject', function(assert) {
  assert.expect(1);
  var service = this.subject();
  // assert.equal(service.get('channels.length'), 0, `'channels.length' should be 0`);

  var channel = service.createChannel();
  assert.equal(Ember.typeOf(channel), 'instance', `'Ember.typeOf(channel)' should be 'instance'`);
});

// test('createChannel method', function(assert) {
//   assert.expect(3);
//   var service = this.subject();
//   assert.equal(service.get('channels.length'), 0, `'channels.length' should be 0`);
//
//   service.createChannel();
//   assert.equal(service.get('channels.length'), 1, `'channels.length' should be 1`);
//
//   service.createChannel();
//   assert.equal(service.get('channels.length'), 2, `'channels.length' should be 2`);
// });

test('addChannel method', function(assert) {
  assert.expect(3);
  var service = this.subject();
  service.set('createChannel', () => assert.ok(true, `'createChannel' method was called`));
  service.addChannel();
  service.addChannel(2);
});

test('addChannel method adds to the channels array', function(assert) {
  assert.expect(3);
  var service = this.subject();
  assert.equal(service.get('channels.length'), 0, `'channels.length' should be 0`);

  service.addChannel();
  assert.equal(service.get('channels.length'), 1, `'channels.length' should be 1`);

  service.addChannel();
  assert.equal(service.get('channels.length'), 2, `'channels.length' should be 2`);
});

test('channels should be numbered', function(assert) {
  assert.expect(8);
  var service = this.subject();
  assert.equal(service.get('channels.length'), 0, `'channels.length' should be 0`);

  service.addChannel();
  assert.equal(service.get('channels.length'), 1, `'channels.length' should be 1`);
  assert.equal(service.get('channels').objectAt(0).get('id'), 1, `'channels[0].id' should be 1`);

  service.addChannel();
  assert.equal(service.get('channels.length'), 2, `'channels.length' should be 2`);
  assert.equal(service.get('channels').objectAt(1).get('id'), 2, `'channels[1].id' should be 2`);

  service.addChannel(2);
  assert.equal(service.get('channels.length'), 4, `'channels.length' should be 4`);
  assert.equal(service.get('channels').objectAt(2).get('id'), 3, `'channels[2].id' should be 3`);
  assert.equal(service.get('channels').objectAt(3).get('id'), 4, `'channels[3].id' should be 4`);
});

test('channels should not be the same object', function(assert) {
  assert.expect(4);
  var service = this.subject();
  assert.equal(service.get('channels.length'), 0, `'channels.length' should be 0`);

  service.addChannel(2);
  var channel1 = service.get('channels').objectAt(0);
  var channel2 = service.get('channels').objectAt(1);
  channel1.set('name', 'One');
  channel2.set('name', 'Two');

  assert.equal(service.get('channels.length'), 2, `'channels.length' should be 2`);
  assert.equal(service.get('channels').objectAt(0).get('name'), 'One', `first channel name should be 'One'`);
  assert.equal(service.get('channels').objectAt(1).get('name'), 'Two', `first channel name should be 'Two'`);
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
