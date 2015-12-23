/**
  @module ember-audio
*/
import Ember from 'ember';
import ProcessorIoMixin from 'ember-audio/mixins/processor-io';

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
    ## gain

    @property gain
    @type {Number}
    @default 1
  */
  gain: 1,

  min: 0,

  max: 1,

  /**
    @property linearGain
    @type {Boolean}
  */
  linearGain: false,

  createProcessor() {
    var gain = this.get('gain');
    var linearGain = this.get('linearGain');
    var audioContext = this.get('audioService.audioContext');
    if ( audioContext ) {
      var processor = audioContext.createGain();
      processor.gain.value = (linearGain) ? gain : gain * gain;
      return processor;
    }
  },

  /**
    @method volumeChanged
  */
  volumeChanged: Ember.observer( 'gain', 'linearGain', 'processor', function() {
    var amp = this.get('processor');
    var gain = this.get('gain');
    var linearGain = this.get('linearGain');
    amp.gain.value = (linearGain) ? gain : gain * gain;
  })
});
