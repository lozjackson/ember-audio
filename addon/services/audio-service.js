import Ember from 'ember';

export default Ember.Service.extend({

  audioContext: null,

  output: Ember.computed.alias('audioContext.destination'),

  init() {
    var context = new AudioContext();
    this.set('audioContext', context);
  }
});
