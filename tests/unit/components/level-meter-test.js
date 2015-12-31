import { moduleForComponent, test } from 'ember-qunit';
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
