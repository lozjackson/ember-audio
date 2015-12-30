/**
  @module ember-audio
*/
import Ember from 'ember';
import ProcessorMixin from 'ember-audio/mixins/processor';
import layout from '../templates/components/audio-filter';

/**
  @class AudioFilterComponent
  @namespace Components
  @uses EmberAudio.ProcessorMixin
*/
export default Ember.Component.extend( ProcessorMixin, {

  layout: layout,

  type: 'lowpass',

  frequency: 1000,

  q: null,

  gain: 0,

  minValue: 20,

  maxValue: Ember.computed('audioService.audioContext', function() {
    var context = this.get('audioService.audioContext');
    return context.sampleRate / 2;
  }),

  createProcessor() {
    var audioContext = this.get('audioService.audioContext');
    var type = this.get('type');
    var frequency = this.get('frequency');
    var q = this.get('q');
    var gain = this.get('gain');
    if (!audioContext) {
      return null;
    }
    var filter = audioContext.createBiquadFilter();
    filter.type = (typeof filter.type === 'string') ? type : 0;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    filter.gain.value = gain;
    return filter;
  },

  _frequency: Ember.computed( 'frequency', 'processor', {
    get() {
      var filter = this.get('processor');
      return filter.frequency.value;
    },
    set( key, value ) {
      var filter = this.get('processor');
      return filter.frequency.value = value;
    }
  }),

  _q: Ember.computed('q', 'processor', {
    get() {
      var filter = this.get('processor');
      return filter.Q.value;
    },
    set( key, value ) {
      var filter = this.get('processor');
      return filter.Q.value = value;
    }
  }),

  _gain: Ember.computed('gain', 'processor', {
    get() {
      var filter = this.get('processor');
      return filter.gain.value;
    },
    set( key, value ) {
      var filter = this.get('processor');
      return filter.gain.value = value;
    }
  })
});
