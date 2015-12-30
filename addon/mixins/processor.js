/**
  @module ember-audio
*/
import Ember from 'ember';

var alias = Ember.computed.alias;

/**
  ## Processor Mixin

  Processor Objects should include this mixin.

  NOTE:  This mixin relies on properties and methods provided by the `IoMixin`.
         Therefore any classes that include this mixin should also include the
         `IoMixin`.

  @class ProcessorMixin
  @namespace Mixins
*/
export default Ember.Mixin.create({


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
    if (processor) {
      this.set('processor', processor);
      this.connectProcessor();
    }
  },

  /**
    ## Connect Processor

    Connect the processor to the input and output.

    @method connectProcessor
    @param {Object} processor
    @private
  */
  connectProcessor() {
    var {input, output} = this.getProperties('input', 'output');
    if (typeof this.connectOutput !== 'function' || typeof this.connectInput !== 'function') {
      Ember.Logger.warn(`The 'ProcessorMixin' relies on properties and methods provided by the 'IoMixin'.`);
    } else {
      this.connectInput(input);
      this.connectOutput(output);
    }
  }
});
