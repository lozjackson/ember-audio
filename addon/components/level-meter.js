import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'canvas',

  attributeBindings: [ 'width', 'height' ],

  classNames: ['ember-audio', 'level-meter'],

  analyser: null,

  input: null,

  width: 40,

  height: 200,

  init() {
    this._super(...arguments);
    var input = this.get('input');
    var context = input.context;
    if (context)
    {
      var analyser = context.createScriptProcessor(1024,1,1);
      this.set('analyser', analyser);
      input.connect(analyser);
      analyser.connect(context.destination);
    }
  },

  didInsertElement() {
    var canvas = this.$()[0];
  	var ctx = canvas.getContext('2d');
  	var w = canvas.width;
  	var h = canvas.height;
    var analyser = this.get('analyser');

  	//fill the canvas first
  	ctx.fillStyle = '#555';
  	ctx.fillRect(0,0,w,h);

    analyser.onaudioprocess = function(e){
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
