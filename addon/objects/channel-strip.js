/**
  @module ember-audio
*/
import Ember from 'ember';

var alias = Ember.computed.alias;
var observer = Ember.observer;

/**
  This mixin provides properties and methods for the i/o of the processing node.

  @class ChannelStripObject
  @namespace EmberAudio
*/
export default Ember.Object.extend({

  /**
    This is required and is not automatically injected.  Pass in the audioService
    when creating it.

      ```
      ChannelStripObject.create({
        audioService: this.get('audioService')
      });
      ```

    @property audioService
    @type {Object}
  */
  audioService: null,

  /**
    @property id
    @type {Integer}
  */
  id: null,

  /**
    The input of the channel strip.

    @property input
    @type {Object}
  */
  input: null,

  /**
    The output of the channel strip.

    @property output
    @type {Object}
  */
  output: null,

  inputGainStage: null,

  outputGainStage: null,

  /**
    An array of processing nodes that sit between the input and output.

    @property nodes
    @type {Array}
  */
  nodes: Ember.A(),

  /**
    Alias of `audioService.audioContext`

    @property audioContext
    @type {Object}
    @private
  */
  audioContext: alias('audioService.audioContext'),

  /**
    @method init
    @private
  */
  init() {
    this._super(...arguments);
    this.set('nodes', Ember.A());
    // this.createInputGainStage();
    // this.createOutputGainStage();
    if (!this.get('audioService')) {
      Ember.Logger.warn('`audioService` is not defined.');
    }
    // Ember.Logger.log('audioService', this.get('audioService'));
    this.createIO();

    // var inputGainStage = this.get('inputGainStage');
    // var outputGainStage = this.get('outputGainStage');
    // Ember.Logger.log('message', inputGainStage);
    // if (inputGainStage && outputGainStage) {
    //
    //   inputGainStage.connect(outputGainStage);
    // }
  },

  chainNodes() {
    var {inputGainStage, outputGainStage, nodes} = this.getProperties('inputGainStage', 'outputGainStage', 'nodes');
    var nodesLength = nodes.get('length');
    if (nodesLength === 0) {
      if (inputGainStage && outputGainStage) {
        inputGainStage.connect(outputGainStage);
      }
    } else if (nodesLength === 1) {
      nodes.get('firstObject').setProperties({
        input: inputGainStage,
        output: outputGainStage
      });
    } else {

      nodes.get('firstObject').set('input', inputGainStage);

      for (var i = 0; i < nodesLength; i++) {
        var nextNodeIndex = i + 1;
        if (nextNodeIndex < nodesLength) {
          var nextNode = nodes[nextNodeIndex];
          if (nextNode) {
            nodes[i].connectOutput(nextNode.get('processor'));
          }
        }
      }

      nodes.get('lastObject').connectOutput(outputGainStage);
      // nodes.get('lastObject').set('output', outputGainStage);
    }
  },

  createIO() {
    this.createInputGainStage();
    this.createOutputGainStage();
    this.chainNodes();
  },

  /**
    @method createInputGainStage
    @private
  */
  createInputGainStage() {
    this.set('inputGainStage', this.createGain());
  },

  /**
    @method createInputGainStage
    @private
  */
  createOutputGainStage() {
    this.set('outputGainStage', this.createGain());
  },

  /**
    @method createGain
    @return {Object} gain
    @private
  */
  createGain() {
    // var audioService = this.audioService;
    // if (audioService && typeof audioService.createGain === 'function') {
    //   return audioService.createGain();
    // }
    var audioContext = this.get('audioContext');
    if (audioContext && typeof audioContext.createGain === 'function') {
      return audioContext.createGain();
    }
  },

  /**
    @method addNode
    @param {Object} node
  */
  addNode(node) {
    var nodes = this.get('nodes');
    if (nodes) {
      nodes.pushObject(node);
    }
  },

  /**
    @method removeNode
    @param {Object} node
  */
  removeNode(node) {
    var nodes = this.get('nodes');
    if (nodes) {
      nodes.removeObject(node);
    }
  },

  /**
    If the `input` changes, connect it to the `inputGainStage`.

    @event inputChanged
    @private
  */
  inputChanged: observer('input', 'inputGainStage', function() {
    var {input, inputGainStage} = this.getProperties('input', 'inputGainStage');
    if ( input ) {
      input.disconnect(0);
      if ( inputGainStage ) {
        input.connect(inputGainStage);
      }
    }
  }),

  /**
    If the output changes, connect the `outputGainStage` to it.

    @event outputChanged
    @private
  */
  ouputChanged: observer('output', 'outputGainStage', function() {
    var {output, outputGainStage} = this.getProperties('output', 'outputGainStage');
    if ( outputGainStage ) {
      outputGainStage.disconnect(0);
      if ( output ) {
        outputGainStage.connect(output);
      }
    }
  }),

  // chainChanged: observer('inputGainStage', 'outputGainStage', 'nodes.[]', function () {
  //   this.chainNodes();
  // })

  // chainNodes: observer('inputGainStage', 'outputGainStage', 'nodes.[]', function () {
  //   var {inputGainStage, outputGainStage, nodes} = this.getProperties('inputGainStage', 'outputGainStage', 'nodes');
  //   if (nodes.get('length') === 0) {
  //     if (inputGainStage) {
  //       // Ember.Logger.log('message', inputGainStage);
  //       // inputGainStage.disconnect(0);
  //       if (outputGainStage && typeof inputGainStage.connect === 'function') {
  //         Ember.Logger.log('message', inputGainStage);
  //         // inputGainStage.connect(outputGainStage);
  //       }
  //     }
  //   } else {
  //     //chain nodes
  //   }
  // })
});
