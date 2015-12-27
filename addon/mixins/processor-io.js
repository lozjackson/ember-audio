/**
  @module ember-audio
*/
import Ember from 'ember';

var alias = Ember.computed.alias;

/**
  This mixin provides properties and methods for the i/o of the processing node.

  @class ProcessorIoMixin
  @namespace EmberAudio
*/
export default Ember.Mixin.create({

  /**
    This represents the input of the `processor`.

    @property input
    @type {Object}
  */
  input: null,

  /**
    This represents the output of the `processor`.

    @property output
    @type {Object}
  */
  output: null,

  outputs: [],

  /**
    This is the audio processing module.

    @property processor
    @type {Object}
    @private
  */
  processor: null,

  /**
    Alias of `audioService.audioContext`

    @property audioContext
    @type {Object}
    @private
  */
  audioContext: alias('audioService.audioContext'),

  /**
    The component/object should override this method to implement the processor
    and set the processor's default values.

    @method createProcessor
  */
  createProcessor() {
    return null;
  },

  /**
    Create the processor and connect it to the input and output.

    @method init
    @private
  */
  init() {
    this._super(...arguments);
    var processor = this.createProcessor();
    this.set('outputs', []);
    if (processor) {
      this.set('processor', processor);
      this.connectProcessor(processor);
    }
  },

  /**
    ## Connect Processor

    Connect the processor to the input and output.

    @method connectProcessor
    @param {Object} processor
    @private
  */
  connectProcessor(processor) {
    var input = this.get('input');
    var output = this.get('output');
    if (input){
      input.connect(processor);
    }
    if (output) {
      processor.connect(output);
    }
  },

  /**
    ## connect

    Connect this `audioNode` to another `audioNode`.  This method is a proxy for
    the processor's `connect` method.

    @method connect
  */
  connect() {
    var processor = this.get('processor');
    if (processor) {
      processor.connect(...arguments);
    }
  },

  /**
    ## disconnect

    Disconnect the output of the `processor` from another `audioNode`.  This method is a proxy
    for the processor's `disconnect` method.

    @method disconnect
  */
  disconnect() {
    var processor = this.get('processor');
    if (processor) {
      processor.disconnect(...arguments);
    }
  },

  /**
    @method connectOutput
    @param {Object} node
    @param {Integer} output
      The index of the output in the `outputs` array.
  */
  connectOutput(node, output) {
    // if the output is not specified, then assume output 0.
    if (isNaN(output)) {
      output = 0;
    }
    var outputs = this.get('outputs');

    // if there is a node in the outputs array at the index disconnect the node
    var oldNode = outputs[output];
    if (oldNode) {
      this.disconnect(oldNode);
    }

    if (node) {
      // store the node in the outputs array.
      outputs[output] = node;
      // connect to the node
      this.connect(node);
    }
  },

  changeInput() {
    var input = this.get('input');
    var processor = this.get('processor');
    if ( input ) {
      input.disconnect(0);
      if ( processor ) {
        input.connect(processor);
      }
    }
  },

  changeOutput() {
    var output = this.get('output');
    if (output) {
      this.connectOutput(output);
    }
  },

  /**
    If the input changes, connect it to the processor.

    @event inputChanged
    @private
  */
  inputChanged: Ember.observer('input', 'processor', function() {
    this.changeInput();
  }),

  /**
    If the output changes, connect the processor to it.

    @event outputChanged
    @private
  */
  ouputChanged: Ember.observer('output', 'processor', function() {
    this.changeOutput();
  })
});
