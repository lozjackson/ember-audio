/**
  @module ember-audio
*/
import Ember from 'ember';
import ProcessorIoMixin from 'ember-audio/mixins/processor-io';

var alias = Ember.computed.alias;
var observer = Ember.observer;

/**
  ## GainObject

  This is a gain component. A `gain` value of `1` will produce full volume ( 0dB )
  output.  The output will be the same level as the input with no attenuation or
  gain being applied.  A `gain` value of `0` will produce no output.

  @class GainObject
  @namespace EmberAudio
  @uses EmberAudio.ProcessorIoMixin
*/
export default Ember.Object.extend( ProcessorIoMixin, {

  /**
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
    Alias of `audioService.audioContext`

    @property audioContext
    @type {Object}
    @private
  */
  audioContext: alias('audioService.audioContext'),

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
    @event volumeChanged
  */
  volumeChanged: observer( 'gain', function() {
    var {gain, processor} = this.getProperties('gain', 'processor');
    processor.gain.value = gain;
  })
});
