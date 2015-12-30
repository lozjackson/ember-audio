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

  tagName: 'canvas',

  attributeBindings: [ 'width', 'height' ],

  classNames: ['ember-audio', 'level-meter'],

  width: 40,

  height: 200,

  createProcessor() {
    var audioContext = this.get('audioService.audioContext');
    var processor = audioContext.createScriptProcessor(1024,1,1);
    return processor;
  },

  /**
    Connect the processor to the input and output.

    NOTE: Both input and output of the level meter must be connected, otherwise the
    level meter doesn't work.  So if `output` is not provided then the output is
    connected to the `audioContext.destination` object.

    @method connectProcessor
    @param {Object} processor
  */
  connectProcessor(processor) {
    var input = this.get('input');
    var output = this.get('output') || this.get('audioService.destination');
    if ( input ){
      input.connect(processor);
    }
    if ( output ) {
      processor.connect(output);
    }
  },

  /**
    If the output changes, connect the processor to it.

    @method outputChanged
  */
  ouputChanged: Ember.observer('output', 'processor', function() {
    var output = this.get('output') || this.get('audioService.destination');
    var processor = this.get('processor');
    if ( output && processor ) {
      processor.connect(output);
    } else {
      processor.disconnect(0);
    }
  }),

  didInsertElement() {
    var canvas = this.$()[0];
  	var ctx = canvas.getContext('2d');
  	var w = canvas.width;
  	var h = canvas.height;
    var processor = this.get('processor');

  	//fill the canvas first
  	ctx.fillStyle = '#555';
  	ctx.fillRect(0,0,w,h);

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
  		ctx.fillStyle="white";
  		ctx.font = "Arial 12pt";
  		ctx.textAlign = "center";
  		ctx.fillText(Math.round(db*100)/100+' dB',w/2,h-h*0.025);
  	};
  },
});
