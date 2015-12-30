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
  @namespace Objects
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

    @property outputGainStage
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
    @property bypass
    @type {Boolean}
    @default false
  */
  bypass: false,

  /**
    ## polarity

    If `true` then the `polarity` is positive. The polarity is applied to the `inputGainStage`

    @property polarity
    @type {Boolean}
  */
  polarity: alias('inputGainStage.polarity'),

  /**
    ## mute

    If `true` then the audio will be muted - no audio output from the `outputGainStage`.
    Mute will be applied to the `outputGainStage`.

    @property mute
    @type {Boolean}
  */
  mute: alias('outputGainStage.mute'),

  /**
    ## inputGain

    This is the gain for the `inputGainStage`..  A value of `1` is full volume.  0 is no output.

    @property inputGain
    @type {Number}
  */
  inputGain: alias('inputGainStage.gain'),

  /**
    ## outputGain

    This is the gain for the `outputGainStage`..  A value of `1` is full volume.  0 is no output.

    @property outputGain
    @type {Number}
  */
  outputGain: alias('outputGainStage.gain'),

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
    @method bypassNodes
    @param {Boolean} bypass
    @private
  */
  bypassNodes(bypass) {
    const {inputGainStage, outputGainStage, nodes} = this.getProperties('inputGainStage', 'outputGainStage', 'nodes');
    if (bypass || !nodes.get('length')) {
      if (inputGainStage && outputGainStage) {
        inputGainStage.connectOutput(outputGainStage);
      }
    } else {
      inputGainStage.connectOutput(nodes.get('firstObject'));
      nodes.get('lastObject').connectOutput(outputGainStage);
    }
  },

  /**
    @method chainNodes
    @private
  */
  chainNodes() {
    var {inputGainStage, outputGainStage, nodes} = this.getProperties('inputGainStage', 'outputGainStage', 'nodes');
    var nodesLength = nodes.get('length');
    if (nodesLength === 0) {
      this.bypassNodes(true);
    } else {
      inputGainStage.connectOutput(nodes.get('firstObject'));
      for (var i = 0; i < nodesLength; i++) {
        var nextNodeIndex = i + 1;
        if (nextNodeIndex < nodesLength) {
          var nextNode = nodes[nextNodeIndex];
          if (nextNode) {
            nodes[i].connectOutput(nextNode);
          }
        }
      }
      nodes.get('lastObject').connectOutput(outputGainStage);
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
    @method createOutputGainStage
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
  }),

  /**
    If the `bypass` changes, bypass the `nodes` array.

    @event bypassChanged
    @private
  */
  bypassChanged: observer('bypass', function() {
    this.bypassNodes(this.get('bypass'));
  })
});
