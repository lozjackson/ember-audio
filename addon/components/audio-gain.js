/**
  @module ember-audio
*/
import Ember from 'ember';
// import ProcessorMixin from 'ember-audio/mixins/processor';
import layout from '../templates/components/audio-gain';

/**
  ## AudioGainComponent

  This is a gain component. A `gain` value of `1` will produce full volume ( 0dB )
  output.  The output will be the same level as the input with no attenuation or
  gain being applied.  A `gain` value of `0` will produce no output.

  @class AudioGainComponent
  @namespace Components
  @uses Mixins.ProcessorMixin
*/
export default Ember.Component.extend( /*ProcessorMixin,*/{

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
  gain: Ember.computed.alias('gainObject.gain'),
  //gain: 0.3,

  /**
    @property linearGain
    @type {Boolean}
  */
  //linearGain: false,

  gainObject: null,

  init() {
    this._super(...arguments);
    // var gainObject = this.get('gainObject');
    // if ( !gainObject ) {
      // var audioService = this.get('audioService');
      // gainObject = audioService.createGain();
      this.set('gainObject', this.audioService.createGain());
    // }
  }
});
