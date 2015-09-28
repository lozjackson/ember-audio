/**
  @module ember-audio
*/
import Ember from 'ember';
import ProcessorIoMixin from 'ember-audio/mixins/processor-io';
import layout from '../templates/components/audio-gain';

/**
  ## AudioGainComponent

  This is a gain component (actually an attenuator). A `gain` value of `1` will
  produce full volume output.  The output will be the same level as the input with
  no attenuation being applied.  A `gain` value of of `0` will produce no output.

  @class AudioGainComponent
  @namespace EmberAudio
  @uses EmberAudio.ProcessorIoMixin
*/
export default Ember.Component.extend( ProcessorIoMixin, {

  layout: layout,

  /**
    @property classNames
    @type {Array}
    @default [ 'ember-audio', 'audio-gain' ]
  */
  classNames: [ 'ember-audio', 'audio-gain' ],

  /**

    @property gain
    @type {Number}
  */
  gain: 0.3,

  /**
    @property linearGain
    @type {Boolean}
  */
  linearGain: false,

  createProcessor() {
    var audioContext = this.get('audioService.audioContext');
    var gain = this.get('gain');
    var linearGain = this.get('linearGain');
    var processor = audioContext.createGain();
    processor.gain.value = (linearGain) ? gain : gain * gain;
    return processor;
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
