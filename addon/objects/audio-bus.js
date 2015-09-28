/**
  @module ember-audio
*/
import Ember from 'ember';

/**
  ## AudioBusObject

  @class AudioBusObject
  @namespace EmberAudio
*/
export default Ember.Object.extend({

  bus: null,

  polarity: true,

  mute: false,

  gain: 1,

  /**
    Create the processor and connect it to the input and output.

    @method init
  */
  init() {
    this._super(...arguments);
    var bus = this.createBus();
    if ( bus ) {
      this.set( 'bus', bus );
    }
  },

  createBus() {

    var audioContext = this.get('audioService.audioContext');
    var polarity = this.get('polarity');
    var mute = this.get('mute');
    var bus = audioContext.createGain();
    if ( mute ) {
      bus.gain.value = 0;
    } else {
      this.setPolarity(polarity);
    }
    return bus;
  },

  setPolarity(polarity) {
    var bus = this.get('bus');
    var gain = parseFloat(this.get('gain'));
    if ( bus ) {
      bus.gain.value = (polarity) ? gain : gain * -1;
    }
  },

  gainChanged: Ember.observer('gain', function() {
    var bus = this.get('bus');
    var gain = this.get('gain');
    var polarity = this.get('polarity');
    bus.gain.value = (polarity) ? gain : gain * -1;
  }),

  polarityChanged: Ember.observer('polarity', function() {
    var polarity = this.get('polarity');
    this.setPolarity(polarity);
  }),

  muteChanged: Ember.observer('mute', function() {
    var mute = this.get('mute');
    var gain = parseFloat(this.get('gain'));
    if ( mute ) {
      var bus = this.get('bus');
      bus.gain.value = 0;
    } else {
      var polarity = this.get('polarity');
      this.setPolarity(polarity);
    }
  })
});
