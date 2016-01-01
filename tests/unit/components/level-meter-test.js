import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import AudioService from 'ember-audio/services/audio-service';

var audioService = AudioService.create();

moduleForComponent('level-meter', 'Unit | Component | level meter', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  component.set('audioService', audioService);

  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('tagName should be canvas', function(assert) {
  assert.expect(1);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  assert.equal(component.get('tagName'), 'canvas', `'tagName' should be 'canvas'`);
});

test('attributeBindings', function(assert) {
  assert.expect(4);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  assert.equal(component.get('attributeBindings.length'), 3, `'attributeBindings.length' should be 3`);
  assert.equal(component.get('attributeBindings')[0], 'ariaRole:role', `'attributeBindings[0]' should be 'ariaRole:role'`);
  assert.equal(component.get('attributeBindings')[1], 'width', `'attributeBindings[1]' should be 'width'`);
  assert.equal(component.get('attributeBindings')[2], 'height', `'attributeBindings[0]' should be 'height'`);
});

test('classNames', function(assert) {
  assert.expect(4);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  assert.equal(component.get('classNames.length'), 3, `'attributeBindings.length' should be 2`);
  assert.equal(component.get('classNames')[0], 'ember-view', `'classNames[0]' should be 'ember-view'`);
  assert.equal(component.get('classNames')[1], 'ember-audio', `'classNames[0]' should be 'ember-audio'`);
  assert.equal(component.get('classNames')[2], 'level-meter', `'classNames[1]' should be 'level-meter'`);
});

test('width should be 20', function(assert) {
  assert.expect(1);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  assert.equal(component.get('width'), 20, `'width' should be 20`);
});

test('height should be 100', function(assert) {
  assert.expect(1);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  assert.equal(component.get('height'), 100, `'height' should be 100`);
});

test('backgroundColor property exists', function(assert) {
  assert.expect(1);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  assert.equal(component.get('backgroundColor'), '#555', `'backgroundColor' element should be '#555'`);
});

test('canvas property exists', function(assert) {
  assert.expect(1);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  assert.equal(component.get('canvas'), component.$()[0], `'canvas' element should be set`);
});

// test('context property exists', function(assert) {
//   assert.expect(1);
//   var component = this.subject();
//   component.set('audioService', audioService);
//   this.render();
//   assert.equal(typeof component.get('context'), 'object', `'typeof context' should be 'object'`);
// });

test('createProcessor method should return an object', function(assert) {
  assert.expect(1);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  var scriptProcessor = component.createProcessor();
  assert.equal(typeof scriptProcessor, 'object', `'typeof scriptProcessor' should be 'object'`);
});

// test('connectProcessor method connects input to processor to output', function(assert) {
//   assert.expect(3);
//   var component = this.subject();
//   component.set('audioService', audioService);
//   var output = { name: 'output' };
//   var input = {
//     connectOutput: function (obj) {
//       assert.equal(obj.name, 'processor', `input is connected to processor`);
//     }
//   };
//
//   this.render();
//   component.setProperties({
//     // input: input,
//     // output: output,
//     connectOutput: function (obj) {
//       assert.equal(obj.name, 'output', `processor is connected to output`);
//     },
//     createProcessor: function () {
//       return {
//         name: 'processor'
//       };
//     }
//   });
//
//   component.setProperties({
//     input: input,
//     output: output
//   });
//
//   var subject = ProcessorObject.create();
//   assert.ok(subject);
// });

test('connectInput method calls connect of source', function(assert) {
  assert.expect(3);

  var source = Ember.Object.create({ outputs: [] });

  source.set('connect', (obj) => {
    assert.ok(true, `'source.connect' method has been called`);
    assert.equal(obj.get('name'), 'Processor', `'obj.name' is 'Processor'`);
  });
  var component = this.subject();
  component.set('audioService', audioService);
  component.set('connectOutput', ()=>{});
  component.set('processor', Ember.Object.create({
    name: 'Processor'
  }));
  this.render();
  component.connectInput(source);
  assert.equal(source.get('outputs').length, 0, 'sourceoutputs.length should be 0');
});

test('connectOutput method should use audioContext.destination', function(assert) {
  assert.expect(4);
  var destination = audioService.get('destination');
  var component = this.subject();
  component.set('audioService', audioService);
  component.setProperties({
    outputs: [],
    connectNode: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj, destination, `'obj' should be 'destination'`);
    },
    disconnect: function () {
      assert.ok(true, `'input.disconnect' method has been called`);
    }
  });

  this.render();
  component.connectOutput();

  assert.equal(component.get('outputs').length, 1, 'outputs.length should be 1');
});

test('connectOutput method works normally when passing in an destination object', function(assert) {
  assert.expect(4);
  var destination = audioService.createGain({name: 'destination'});
  var component = this.subject();
  component.set('audioService', audioService);
  component.setProperties({
    outputs: [],
    connectNode: function (obj) {
      assert.ok(true, `'input.connect' method has been called`);
      assert.equal(typeof obj, 'object', `typeof 'obj' is an object`);
      assert.equal(obj.get('name'), 'destination', `'obj.name' should be 'destination'`);
    },
    disconnect: function () {
      assert.ok(true, `'input.disconnect' method has been called`);
    }
  });

  this.render();
  component.connectOutput(destination);

  assert.equal(component.get('outputs').length, 1, 'outputs.length should be 1');
});

test('draw method', function(assert) {
  assert.expect(1);
  var component = this.subject();
  component.set('audioService', audioService);
  this.render();
  component.draw();
  assert.ok(component);
  // assert.equal(component.get('tagName'), 'canvas', `'tagName' should be 'canvas'`);
});

test('draw method is called from didInsertElement', function(assert) {
  assert.expect(2);
  var component = this.subject();
  component.set('audioService', audioService);
  component.set('draw', () => assert.ok(true, `'draw' method has been called`));
  this.render();
  assert.ok(component);
});

// test('onAudioProcess method', function(assert) {
//   assert.expect(1);
//   var component = this.subject();
//   component.set('audioService', audioService);
//   this.render();
//   component.onAudioProcess();
//   assert.ok(component);
//   // assert.equal(component.get('tagName'), 'canvas', `'tagName' should be 'canvas'`);
// });

test('didInsertElement is called when element is inserted', function(assert) {
  assert.expect(2);
  var component = this.subject();
  component.set('audioService', audioService);
  component.set('didInsertElement', () => assert.ok(true, `'didInsertElement' method has been called`));
  this.render();
  assert.ok(component);
});

// test('setMaxdB method', function (assert) {
//   assert.expect(2);
//   var component = this.subject();
//   component.set('audioService', audioService);
//   this.render();
//   assert.equal(component.get('maxdB'), null, `'maxdB' should be null`);
//   component.setMaxdB(-1);
//   assert.equal(component.get('maxdB'), -1, `'maxdB' should be -1`);
//   // component.setMaxdB();
//   // assert.equal(component.get('maxdB'), null, `'maxdB' should be -1`);
// });

// test('_resetMaxdB method', function(assert) {
//   assert.expect(2);
//   var maxdB = -1;
//   var component = this.subject();
//   component.set('audioService', audioService);
//   this.render();
//   component.set('maxdB', maxdB);
//   assert.equal(component.get('maxdB'), -1, `'maxdB' should be -1`);
//   component._resetMaxdB();
//   assert.equal(component.get('maxdB'), undefined, `'maxdB' should be undefined`);
// });

// test('resetMaxdB action calls _resetMaxdB method', function(assert) {
//   assert.expect(2);
//   var component = this.subject();
//   component.set('audioService', audioService);
//   component.set('_resetMaxdB', ()=> assert.ok(`'_resetMaxdB' has been called`));
//   this.render();
//   component.send('resetMaxdB');
//   assert.ok(component);
//   // assert.equal(component.get('tagName'), 'canvas', `'tagName' should be 'canvas'`);
// });
