/**
  @module ember-audio
*/
import Mixin from '@ember/object/mixin';

import { alias } from '@ember/object/computed';

/**
  This mixin provides properties and methods for the i/o of the processing node.

  @class ProcessorMixin
  @namespace Mixins
*/
export default Mixin.create({


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
    if (processor) {
      if (input){
        input.connectOutput(processor);
      }
      if (output) {
        this.connectOutput(output);
      }
    }
  }
});
