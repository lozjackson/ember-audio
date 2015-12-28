/**
  @module ember-audio
*/
import Ember from 'ember';

/**
  This mixin provides an `input` and `output` and methods for connecting to other objects.

  @class IoMixin
  @namespace Arms
*/
export default Ember.Mixin.create({

  /**
    The audio input.

    @property input
    @type {Object}
  */
  input: null,

  /**
    The audio output.

    @property output
    @type {Object}
  */
  output: null,

  /**
    ## Outputs

    This is an array of audioNodes that this object is connected to.  The index
    is the output number.  Index 0 is the main/default output.

    NOTE:  This is used internally to keep track of output connections, you don't
          add to this array directly.  To connect an output use the `connectOutput`
          method.

            ```
            this.connectOutput(destination, 1);
            ```

    @property outputs
    @type {Array}
    @private
  */
  outputs: [],

  /**
    @method init
    @private
  */
  init() {
    this._super(...arguments);
    this.set('outputs', []);
  },

  /**
    ## connect

    Connect this `audioNode` to another `audioNode`.  This method is a proxy for
    the processor's `connect` method.

    @method connect
    @private
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
    @private
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
      outputs[output] = null;
    }

    if (node) {

      /*
        We want the native `audioNode` object, not an `Ember.Object`.  If the
        `node` passed in is an instance of an `Ember.Object`, and it has a
        `processor` property then we need to use the `processor` object as the
        node to connect to.
      */
      if (Ember.typeOf(node) === 'instance' && node.get('processor')) {
        node = node.get('processor');
      }

      // store the node in the outputs array.
      outputs[output] = node;
      // connect to the node
      this.connect(node);
    }
  },

  /**
    @method changeInput
    @private
  */
  changeInput() {
    var input = this.get('input');
    var processor = this.get('processor');
    if (input && processor) {
      input.connectOutput(processor);
    }
  },

  /**
    @method changeOutput
    @private
  */
  changeOutput() {
    var output = this.get('output');
    if (output) {
      this.connectOutput(output);
    }
  }
});
