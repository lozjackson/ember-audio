/**
  @module ember-audio
*/
import Ember from 'ember';

/**
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

  /**
    This is the audio processing module.

    @property processor
    @type {Object}
  */
  processor: null,

  /**
    The component should override this method to implement the processor and set
    the processor's default values.

    @method createProcessor
  */
  createProcessor() {
    return null;
  },

  /**
    Create the processor and connect it to the input and output.

    @method init
  */
  init() {
    this._super(...arguments);
    var processor = this.createProcessor();
    if (processor) {
      this.set('processor', processor);
      this.connectProcessor(processor);
    }
  },

  /**
    Connect the processor to the input and output.

    @method connectProcessor
    @param {Object} processor
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
    processor.connect(...arguments);
  },

  /**
    ## disconnect

    Disconnect the `audioNode` from another `audioNode`.  This method is a proxy
    for the processor's `disconnect` method.

    @method disconnect
  */
  disconnect() {
    var processor = this.get('processor');
    processor.disconnect(...arguments);
  },

  /**
    If the input changes, connect it to the processor.

    @method inputChanged
  */
  inputChanged: Ember.observer('input', 'processor', function() {
    var input = this.get('input');
    var processor = this.get('processor');
    if ( input ) {
      input.disconnect(0);
      if ( processor ) {
        input.connect(processor);
      }
    }
  }),

  /**
    If the output changes, connect the processor to it.

    @method outputChanged
  */
  ouputChanged: Ember.observer('output', 'processor', function() {
    var output = this.get('output');
    var processor = this.get('processor');
    if ( processor ) {
      processor.disconnect(0);
      if ( output ) {
        processor.connect(output);
      }
    }
  })
});
