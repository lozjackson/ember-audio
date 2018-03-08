/**
  @module ember-audio
*/
import { typeOf } from '@ember/utils';

import EmberObject, { observer } from '@ember/object';
import { A } from '@ember/array';
import Mixin from '@ember/object/mixin';

/**
  This mixin provides an `input` and `output` and methods for connecting to other objects.

  @class IoMixin
  @namespace Mixins
*/
export default Mixin.create({

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
    ## Inputs

    @property inputs
    @type {Array}
    @private
  */
  inputs: A(),

  /**
    ## Outputs

    This is an array of audioNodes that this object outputs to.  The index is the
    output number.  Index 0 is the main/default output.

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
    this.setProperties({
      inputs: A(),
      outputs: []
    });
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
    @method registerInput
  */
  registerInput(outputNode, outputNumber) {
    var inputs = this.get('inputs');
    if (outputNode) {
      inputs.pushObject(EmberObject.create({
        node: outputNode,
        output: outputNumber
      }));
    }
  },

  /**
    ## Unregister Input

    Unregister an input.  The `input` parameter is the source node to unregister.

      ```
      // this is the input that we want to un-register.
      var input = this.get('sourceNode');

      object.unregisterInput(input);
      ```

    NOTE:  This does not disconnect the input, it only un-registers it.  To
          disconnect an input/output call the source node's `disconnect` method.

    @method unregisterInput
    @param {Object} input
  */
  unregisterInput(input) {
    var inputs = this.get('inputs');
    var node = inputs.findBy('node', input);
    if (node) {
      inputs.removeObject(node);
    }
  },

  /**
    ## Connect Output

    Connect an output to a destination.

      ```
      // connect the main output of `source` to `destination`
      source.connectOutput(destination);

      // connect a second output (output 1) from `source` to `auxBus`.
      source.connectOutput(auxBus, 1);
      ```

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
    this.disconnectOutput(output);

    if (node) {
      outputs[output] = node; // store the node in the outputs array.
      this.connectNode(node); // connect to the node

      // register the input here
      if (typeof node.registerInput === 'function') {
        node.registerInput(this, output);
      }
    }
  },

  /**
    @method disconnectOutput
    @param {Integer} output
  */
  disconnectOutput(output) {
    // if the output is not specified, then assume output 0.
    if (isNaN(output)) {
      output = 0;
    }
    var outputs = this.get('outputs');

    // if there is a node in the outputs array at the index disconnect the node
    var node = outputs[output];
    if (node) {
      this.disconnectNode(node);
      outputs[output] = null;
      if (typeof node.unregisterInput === 'function') {
        node.unregisterInput(this);
      }
    }
  },

  /**
    @method connectNode
    @param {Object} node
    @private
  */
  connectNode(node) {
    /*
      We want the native `audioNode` object, not an `Ember.Object`.  If the
      `node` passed in is an instance of an `Ember.Object`, and it has a
      `processor` property then we need to use the `processor` object as the
      node to connect to.
    */
    if (typeOf(node) === 'instance' && node.get('processor')) {
      node = node.get('processor');
    }
    this.connect(node);
  },

  /**
    @method disconnectNode
    @param {Object} node
    @private
  */
  disconnectNode(node) {
    /*
      We want the native `audioNode` object, not an `Ember.Object`.  If the
      `node` passed in is an instance of an `Ember.Object`, and it has a
      `processor` property then we need to use the `processor` object as the
      node to connect to.
    */
    if (typeOf(node) === 'instance' && node.get('processor')) {
      node = node.get('processor');
    }
    this.disconnect(node);
  },

  /**
    @method changeInput
    @private
  */
  changeInput() {
    var input = this.get('input');
    if (input) {
      input.connectOutput(this);
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
  },

  /**
    If the input changes, connect it to the processor.

    @event inputChanged
    @private
  */
  inputChanged: observer('input', 'processor', function() {
    this.changeInput();
  }),

  /**
    If the output changes, connect the processor to it.

    @event outputChanged
    @private
  */
  outputChanged: observer('output', 'processor', function() {
    this.changeOutput();
  })
});
