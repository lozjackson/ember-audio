import { observer, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/tone-generator';

export default Component.extend({

  layout: layout,

  classNames: [ 'ember-audio', 'tone-generator'],

  audioService: service(),

  osc: null,

  amp: null,

  frequency: 500,

  gain: 0.3,

  linearGain: false,

  output: null,

  init() {
    this._super(...arguments);
    var context = this.get('audioService.audioContext');
    var amp = context.createGain();

    var output = this.get('output');
    if (output) {
      amp.connect(output);
    }
    this.setProperties({
      audioContext: context,
      amp: amp
    });
  },

  volumeChanged: observer( 'gain', 'linearGain', function() {
    var amp = this.get('amp');
    var gain = this.get('gain');
    var linearGain = this.get('linearGain');
    amp.gain.value = (linearGain) ? gain : gain * gain;
  }),

  _frequency: computed( 'osc', 'frequency', {
    get() {
      var osc = this.get('osc');
      if (!osc) {
        return this.get('frequency');
      }
      return osc.frequency.value;
    },
    set( key, value ) {
      var osc = this.get('osc');
      if (osc) {
        this.set('frequency', value);
        return osc.frequency.value = value;
      }
    }
  }),

  start() {
    var osc = this.get('osc');
    if (!osc) {
      var amp = this.get('amp');
      var gain = this.get('gain');
      var context = this.get('audioContext');
      var frequency = this.get('frequency') || 440;
      osc = context.createOscillator();
      this.set('osc', osc);
      osc.frequency.value = parseFloat(frequency);
      amp.gain.value = gain;
      osc.connect(amp);
      osc.start(0);
    }
  },

  stop() {
    var osc = this.get('osc');
    if (osc) {
      osc.stop(0);
      this.set('osc', null);
    }
  },

  actions: {
    start() {
      this.start();
    },

    stop() {
      this.stop();
    }
  }
});
