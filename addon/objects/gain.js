/**
  @module ember-audio
*/
import EmberObject, { computed, observer } from '@ember/object';

import ProcessorMixin from 'ember-audio/mixins/processor';
import io from 'ember-audio/mixins/io';

/**
  ## GainObject

  This is a gain object. A `gain` value of `1` will produce full volume ( 0dB )
  output.  The output will be the same level as the input with no attenuation or
  gain being applied.  A `gain` value of `0` will produce no output.

  @class GainObject
  @namespace Objects
  @uses EmberAudio.IoMixin
  @uses EmberAudio.ProcessorMixin
*/
export default EmberObject.extend( io, ProcessorMixin, {

  /**
    This is required and is not automatically injected.  Pass in the audioService
    when creating it.

      ```
      GainObject.create({
        audioService: this.get('audioService')
      });
      ```
    @property audioService
    @type {Object}
    @private
  */
  audioService: null,

  /**
    ## gain

    @property gain
    @type {Number}
    @default 1
  */
  gain: 1,

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
    This is the minimum value for this gain range.  It can be used for setting
    the minimum value of the range slider.

    @property min
    @type {Number}
  */
  min: 0,

  /**
    This is the maximum value for this gain range.  It can be used for setting
    the maximum value of the range slider.

    @property max
    @type {Number}
  */
  max: 1,

  /**
    @method init
    @private
  */
  init() {
    this._super(...arguments);
    this.setGain();
  },

  /**
    Computed Property.  The gain/polarity.

    @property _gain
    @type {Number}
    @private
  */
  _gain: computed('gain', 'polarity', function () {
    var {gain, polarity} = this.getProperties('gain', 'polarity');
    return (polarity) ? gain : gain * -1;
  }),

  /**
    @method createProcessor
  */
  createProcessor() {
    var gain = this.get('gain');
    var audioContext = this.get('audioContext');
    if ( audioContext && typeof audioContext.createGain === 'function' ) {
      var processor = audioContext.createGain();
      processor.gain.value = gain;
      return processor;
    }
  },

  /**
    Set the gain.

    @method setGain
    @param {Number} gain
    @private
  */
  setGain(gain) {
    const { processor, _gain, mute } = this.getProperties('processor', '_gain', 'mute');
    if (isNaN(gain)) {
      gain = parseFloat(_gain);
    }
    if (processor && processor.gain) {
      processor.gain.value = (mute) ? 0 : gain;
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
