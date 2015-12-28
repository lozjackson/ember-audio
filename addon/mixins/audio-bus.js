/**
  @module ember-audio
*/
import Ember from 'ember';

var computed = Ember.computed;
var alias = computed.alias;
var readOnly = computed.readOnly;
var observer = Ember.observer;

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
    Alias of `audioService.audioContext`

    @property audioContext
    @type {Object}
    @private
  */
  audioContext: alias('audioService.audioContext'),

  /**
    @property input
    @type {Object}
  */
  input: readOnly('bus'),

  /**
    @property output
    @type {Object}
  */
  output: readOnly('bus'),

  /**
    Computed Property.  The gain/polarity of the bus.

    @property _gain
    @type {Number}
    @private
  */
  _gain: computed('gain', 'polarity', function () {
    var {gain, polarity} = this.getProperties('gain', 'polarity');
    return (polarity) ? gain : gain * -1;
  }),

  /**
    Create the bus and set the gain.

    @method init
    @private
  */
  init() {
    this._super(...arguments);
    this.createBus();
    this.setGain();
  },

  /**
    Create the bus.

    @method createBus
    @private
  */
  createBus() {
    var audioContext = this.get('audioContext');
    var bus = audioContext.createGain();
    this.set( 'bus', bus );
    return bus;
  },

  /**
    Set the gain of the bus.

    @method setGain
    @param {Number} gain
    @private
  */
  setGain(gain) {
    const { bus, _gain, mute } = this.getProperties('bus', '_gain', 'mute');
    if (isNaN(gain)) {
      gain = parseFloat(_gain);
    }
    if (bus) {
      bus.gain.value = (mute) ? 0 : gain;
    }
  },

  /**
    @method connectOutput
    @param {Object} node
  */
  connectOutput(node) {
    this.connect(node);
  },

  /**
    ## connect

    Connect the `bus` to another `audioNode`.  This method is a proxy for
    the `bus` object's `connect` method.

    @method connect
  */
  connect() {
    var bus = this.get('bus');
    if (bus) {
      bus.connect(...arguments);
    }
  },

  /**
    ## disconnect

    Disconnect the `bus` from another `audioNode`.  This method is a proxy
    for the `bus` object's `disconnect` method.

    @method disconnect
  */
  disconnect() {
    var bus = this.get('bus');
    if (bus) {
      bus.disconnect(...arguments);
    }
  },

  /**
    @event gainChanged
  */
  gainChanged: observer('gain', function() {
    this.setGain();
  }),

  /**
    @event polarityChanged
  */
  polarityChanged: observer('polarity', function() {
    this.setGain();
  }),

  /**
    @event muteChanged
  */
  muteChanged: observer('mute', function() {
    this.setGain();
  })
});
