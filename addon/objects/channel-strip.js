/**
  @module ember-audio
*/
import Ember from 'ember';
import io from 'ember-audio/mixins/io';

var alias = Ember.computed.alias;
var observer = Ember.observer;

/**
  ## Channel Strip

  This is a processing chain - A chain of audio processor nodes connected in series.
  There is an gain node at either end of the chain that represent the input and
  output of the channel strip.

  @class ChannelStripObject
  @namespace EmberAudio
  @uses EmberAudio.IoMixin
*/
export default Ember.Object.extend(io, {

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
    This is only used for reference.

    @property id
    @type {Integer}
  */
  id: null,

  /**
    ## Input Gain Stage

    This is a Gain Object and is the first node in the processing chain.  It sets
    the input gain of the channel strip.

    @property inputGainStage
    @type {Object}
  */
  inputGainStage: null,

  /**
    ## Output Gain Stage

    This is a Gain Object and is the last node in the processing chain.  It sets
    the output gain of the channel strip.

    @property inputGainStage
    @type {Object}
  */
  outputGainStage: null,

  /**
    An array of processing nodes that sit between the input and output.  These
    nodes together with the input/output gain stages form the processing chain.

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
    Alias of `outputGainStage`.  This is for compatibility with the `IoMixin`.

    @property processor
    @type {Object}
    @private
  */
  processor: alias('outputGainStage'),

  /**
    @method init
    @private
  */
  init() {
    this._super(...arguments);
    this.set('nodes', Ember.A());
    if (!this.get('audioService')) {
      Ember.Logger.warn('`audioService` is not defined.');
    }
    this.createIO();
  },

  /**
    @method chainNodes
    @private
  */
  chainNodes() {
    var {inputGainStage, outputGainStage, nodes} = this.getProperties('inputGainStage', 'outputGainStage', 'nodes');
    var nodesLength = nodes.get('length');
    if (nodesLength === 0) {
      if (inputGainStage && outputGainStage) {
        inputGainStage.connectOutput(outputGainStage.get('processor'));
      }
    } else {
      inputGainStage.connectOutput(nodes.get('firstObject').get('processor'));
      for (var i = 0; i < nodesLength; i++) {
        var nextNodeIndex = i + 1;
        if (nextNodeIndex < nodesLength) {
          var nextNode = nodes[nextNodeIndex];
          if (nextNode) {
            nodes[i].connectOutput(nextNode.get('processor'));
          }
        }
      }
      nodes.get('lastObject').connectOutput(outputGainStage.get('processor'));
    }
  },

  /**
    @method createIO
    @private
  */
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
    Calls the `audioService.createGain` method.

    @method createGain
    @return {Object} gain
    @private
  */
  createGain() {
    var audioService = this.audioService;
    if (audioService && typeof audioService.createGain === 'function') {
      return audioService.createGain();
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
    @method changeInput
    @private
  */
  changeInput() {
    var input = this.get('input');
    var inputGainStage = this.get('inputGainStage');
    if (input && inputGainStage) {
      input.connectOutput(inputGainStage.get('processor'));
    }
  },

  /**
    If the `input` changes, connect it to the `inputGainStage`.

    @event inputChanged
    @private
  */
  inputChanged: observer('input', 'inputGainStage', function() {
    this.changeInput();
  }),

  /**
    If the output changes, connect the `outputGainStage` to it.

    @event outputChanged
    @private
  */
  outputChanged: observer('output', 'outputGainStage', function() {
    this.changeOutput();
  })
});
