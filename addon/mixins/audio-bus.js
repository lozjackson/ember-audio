/**
  @module ember-audio
*/
import Ember from 'ember';

/**
  ## AudioBusMixin

  @class AudioBusMixin
  @namespace EmberAudio
*/
export default Ember.Mixin.create({

  /**
    This is the bus.  It is actually a 'gainNode' pretending to be a bus.

    @property bus
    @type {Object}
  */
  bus: null,

  /**
    ## polarity

    If `true` then the polarity is positive.

    @property polarity
    @type {Boolean}
  */
  polarity: true,

  /**
    ## mute

    If `true` then the audio will be muted (no sound output).  This is the same
    as setting the gain to `0`.

    @property mute
    @type {Boolean}
  */
  mute: false,

  /**
    ## gain

    This is the gain for the bus..  A value of `1` is full volume.  0 is no output.

    @property gain
    @type {Number}
  */
  gain: 1,

  /**
    @method init
    @private
  */
  init() {
    this._super(...arguments);
    var bus = this.createBus();
    if ( bus ) {
      this.set( 'bus', bus );
    }
  },

  /**
    Create the bus and set the default parameters.

    @method createBus
    @private
  */
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
