/**
  @module ember-audio
*/
import Ember from 'ember';
import io from 'ember-audio/mixins/io';
import ProcessorMixin from 'ember-audio/mixins/processor';

var computed = Ember.computed;

// var maxdB = null;

/**
  ## Level Meter Component

  @class LevelMeterComponent
  @namespace Components
  @uses EmberAudio.IoMixin
  @uses EmberAudio.ProcessorMixin
*/
export default Ember.Component.extend(io, ProcessorMixin, {

  /**
    @property tagName
    @type {String}
    @default `canvas`
  */
  tagName: 'canvas',

  // displayText: true,

  /**
    @property attributeBindings
    @type {Array}
    @default `['width', 'height']`
  */
  attributeBindings: ['width', 'height'],

  /**
    @property classNames
    @type {Array}
    @default `['ember-audio', 'level-meter']`
  */
  classNames: ['ember-audio', 'level-meter'],

  /**
    @property width
    @type {Number}
  */
  width: 20,

  /**
    @property height
    @type {Number}
  */
  height: 100,



  // /**
  //   @property maxdB
  //   @type {Number}
  // */
  // maxdB: null,

  /**
    ## Background Color

    The background colour of the level meter.

    @property backgroundColor
    @type {String}
  */
  backgroundColor: '#555',

  /**
    @property canvas
    @type {Object}
    @private
  */
  canvas: computed(function () {
    return this.$()[0];
  }),

  /**
    @method createProcessor
    @private
  */
  createProcessor() {
    var audioContext = this.get('audioService.audioContext');
    if (audioContext && typeof audioContext.createScriptProcessor === 'function') {
      return audioContext.createScriptProcessor(1024,1,1);
    }
  },

  /**
    ## Connect Input

    Connect `source` to an input of the level meter.  This method calls `source.connect`.

    ```
    // connect `source` to `levelMeter`
    levelMeter.connectInput(source);
    ```

    NOTE: When using the `connectInput` method, the source connects to the
          `LevelMeterComponent` anonymously.. that is the source audio node
          connects directly to the level meter's `processor` and doesn't register
          inputs/outputs - This is to prevent the `LevelMeterComponent` from being
          disconnected when the source is connected to other audio nodes.

    @method connectInput
    @param {Object} source
  */
  connectInput(source) {
    var processor = this.get('processor');
    if (source && typeof source.connect === 'function' && processor) {
      source.connect(processor);
    }
  },

  /**
    ## Connect Output

    NOTE: Both input and output of the level meter must be connected, otherwise the
    level meter doesn't work.  So if `output` is not provided then the output is
    connected directly to the `audioService.destination` object.

    @method connectOutput
    @param {Object} node
    @param {Integer} output
      The index of the output in the `outputs` array.
  */
  connectOutput(node, output) {
    if (!node) {
      node = this.get('audioService.destination');
    }
    this._super(node, output);
  },

  /**
    @method draw
  */
  draw() {
    var {processor, canvas, backgroundColor} = this.getProperties('processor', 'canvas', 'backgroundColor');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0,0,w,h);

    var grad = ctx.createLinearGradient(w/10,h*0.2,w/10,h*0.95);
    grad.addColorStop(0,'red');
    grad.addColorStop(-6/-72,'yellow');
    grad.addColorStop(1,'green');

    if (processor) {
      processor.onaudioprocess = function(e){
        var out = e.outputBuffer.getChannelData(0);
        var int = e.inputBuffer.getChannelData(0);
        var max = 0;

        for(var i = 0; i < int.length; i++){
          out[i] = 0;
          max = int[i] > max ? int[i] : max;
        }

        var dB = 20*Math.log(Math.max(max,Math.pow(10,-72/20)))/Math.LN10;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = grad;
        ctx.fillRect(w/10,h*0.8*(dB/-72),w*8/10,(h*0.95)-h*0.8*(dB/-72));

        // if (dB > maxdB || maxdB === null || typeof maxdB === 'undefined') {
        //   // _this.setMaxdB(dB);
        //   maxdB = dB;
        //   _this.set('maxdB', Number(maxdB).toFixed(1));
        // }
        // ctx.fillStyle="white";
        // ctx.font = "Arial 12pt";
        // ctx.textAlign = "center";
        // ctx.fillText(Math.round(maxdB*100)/100+' dB',w/2,h-h*0.025);
      };
    }
  },

  /**
    @method didInsertElement
    @private
  */
  didInsertElement() {
    this.draw();
  },

  // /**
  //   @method setMaxdB
  //   @param {Number} dB
  // */
  // setMaxdB(dB) {
  //   maxdB = dB;
  //   this.set('maxdB', Number(dB).toFixed(1));
  // },

  // /**
  //   @method _resetMaxdB
  // */
  // _resetMaxdB() {
  //   // maxdB = undefined;
  //   // this.set('maxdB', null);
  //   // this.setMaxdB();
  // },

  // actions: {
  //   resetMaxdB() {
  //     this._resetMaxdB();
  //   }
  // }
});
