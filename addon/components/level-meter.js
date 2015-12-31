/**
  @module ember-audio
*/
import Ember from 'ember';
import io from 'ember-audio/mixins/io';
import ProcessorMixin from 'ember-audio/mixins/processor';

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
    Connect the processor to the input and output.

    NOTE: Both input and output of the level meter must be connected, otherwise the
    level meter doesn't work.  So if `output` is not provided then the output is
    connected to the `audioContext.destination` object.

    @method connectProcessor
    @param {Object} processor
    @private
  */
  connectProcessor() {
    var input = this.get('input');
    var output = this.get('output');// || this.get('audioService.destination');
    var processor = this.get('processor');
    if (input && processor){
      input.connect(processor);
    }
    this.connectOutput(output);
  },

  /**
    ## Connect Input

    Connect `source` to an input of the level meter.  This method calls `source.connect`.

    ```
    // connect `source` to `levelMeter`
    levelMeter.connectInput(source);
    ```

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

    @method connectOutput
    @param {Object} node
    @param {Integer} output
      The index of the output in the `outputs` array.
  */
  connectOutput(node, output) {
    if (!node) {
      node = this.get('audioService.destination');
      // Ember.Logger.log('node', node);
    }
    this._super(node, output);
  },

  // /**
  //   @method changeOutput
  //   @private
  // */
  // changeOutput() {
  //   var output = this.get('output') || this.get('audioService.destination');
  //   if (output) {
  //     this.connectOutput(output);
  //   }
  // },

  // /**
  //   If the output changes, connect the processor to it.
  //
  //   @method outputChanged
  // */
  // ouputChanged: Ember.observer('output', 'processor', function() {
  //   var output = this.get('output') || this.get('audioService.destination');
  //   var processor = this.get('processor');
  //   if ( output && processor ) {
  //     processor.connect(output);
  //   } else {
  //     processor.disconnect(0);
  //   }
  // }),

  /**
    @method didInsertElement
    @private
  */
  didInsertElement() {
    var canvas = this.$()[0];
  	var ctx = canvas.getContext('2d');
  	var w = canvas.width;
  	var h = canvas.height;
    var processor = this.get('processor');

  	//fill the canvas first
  	ctx.fillStyle = '#555';
  	ctx.fillRect(0,0,w,h);
    if (processor) {
      processor.onaudioprocess = function(e){
    		var out = e.outputBuffer.getChannelData(0);
    		var int = e.inputBuffer.getChannelData(0);
    		var max = 0;

    		for(var i = 0; i < int.length; i++){
    			out[i] = 0;//prevent feedback and we only need the input data
    			max = int[i] > max ? int[i] : max;
    		}
    		//convert from magitude to decibel
    		var db = 20*Math.log(Math.max(max,Math.pow(10,-72/20)))/Math.LN10;
    		//It's time to draw on the canvas
    		//create the gradient
    		var grad = ctx.createLinearGradient(w/10,h*0.2,w/10,h*0.95);
    		grad.addColorStop(0,'red');
    		grad.addColorStop(-6/-72,'yellow');
    		grad.addColorStop(1,'green');

    		//fill the background
    		ctx.fillStyle = '#555';
    		ctx.fillRect(0,0,w,h);
    		ctx.fillStyle = grad;
    		//draw the rectangle
    		ctx.fillRect(w/10,h*0.8*(db/-72),w*8/10,(h*0.95)-h*0.8*(db/-72));
    		//draw the text out
        // if (displayText) {
        //   ctx.fillStyle="white";
      	// 	ctx.font = "Arial 12pt";
      	// 	ctx.textAlign = "center";
      	// 	ctx.fillText(Math.round(db*100)/100+' dB',w/2,h-h*0.025);
        // }
    	};
    }
  },
});
