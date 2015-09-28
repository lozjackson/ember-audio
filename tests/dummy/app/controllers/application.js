import Ember from 'ember';
import AudioBusObject from 'ember-audio/objects/audio-bus';

var c = [false, false];

export default Ember.Controller.extend({
  audioService: Ember.inject.service(),
  output: Ember.computed.alias('audioService.output'),

  bus: null,

  init() {
    this._super(...arguments);
    var audioService = this.get('audioService');
    audioService.addBuss(4);
  },

  bus1: Ember.computed('audioService.busses.[]', function() {
    var busses = this.get('audioService.busses');
    return busses.objectAt(0).bus;
  }),

  bus2: Ember.computed('audioService.busses.[]', function() {
    var busses = this.get('audioService.busses');
    return busses.objectAt(1).bus;
  }),


  actions: {
    activateBus(src, b) {

      var busses = this.get('audioService.busses');
      var bus = busses.objectAt(b).bus;
      if (c[b]) {
        src.disconnect(bus);
        c[b] = false;
        Ember.Logger.log('disconnect Bus', src);
      } else {
        src.connect(bus);
        Ember.Logger.log('connect Bus', src);
        c[b] = true;
      }
    },

    invertPolarity(b) {
      var busses = this.get('audioService.busses');
      var bus = busses.objectAt(b);
      bus.toggleProperty('polarity');
    }
  }
});
