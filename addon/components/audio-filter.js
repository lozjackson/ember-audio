import Ember from 'ember';
import layout from '../templates/components/audio-filter';


export default Ember.Component.extend({
  layout: layout,

  audioService: Ember.inject.service(),

  input: null,

  filter: null,

  frequency: 1,

  q: null,

  minValue: 40,

  maxValue: Ember.computed('audioService.audioContext', function() {
    var context = this.get('audioService.audioContext');
    return context.sampleRate / 2;
  }),

  init() {
    this._super(...arguments);
    var input = this.get('input');
    var output = this.get('output');
    var context = this.get('audioService.audioContext');

    if (context) {
      // Create the filter.
      var filter = context.createBiquadFilter();
      filter.type = (typeof filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
      filter.frequency.value = 300;
      filter.Q.value = 40;

      if (input){
        input.connect(filter);
      }
      if (output) {
        filter.connect(output);
      }

      this.set('filter', filter)
    }
  },

  _frequency: Ember.computed( 'frequency', {
    get() {
      var filter = this.get('filter');
      return filter.frequency.value;
    },
    set( key, value ) {
      var filter = this.get('filter');
      return filter.frequency.value = value;
    }
  }),

  _q: Ember.computed('q', {
    get() {
      var filter = this.get('filter');
      return filter.Q.value
    },
    set( key, value ) {
      var filter = this.get('filter');
      return filter.Q.value = value;
    }
  }),

  inputChanged: Ember.observer('input', function() {
    var input = this.get('input');
    var filter = this.get('filter');
    if (input && filter){
      input.connect(filter);
    } else {
      input.disconnect(0);
    }
  }),

  ouputChanged: Ember.observer('output', function() {
    var output = this.get('output');
    var filter = this.get('filter');
    if (output && filter){
      filter.connect(output);
    } else {
      filter.disconnect(0);
    }
  })
});
