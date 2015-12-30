import Ember from 'ember';

var c = [false, false];

export default Ember.Controller.extend({

  init() {
    this._super(...arguments);
    var audioService = this.audioService;
    audioService.addBus(3);
    audioService.addChannel(1);

    var bus1 = audioService.get('busses').objectAt(0);
    var bus2 = audioService.get('busses').objectAt(1);
    var bus3 = audioService.get('busses').objectAt(2);

    bus3.connectOutput(audioService.get('destination'));
    var master = bus3.get('input');

    bus2.connectOutput(master);

    var channel = audioService.get('channels').objectAt(0);
    this.set('channel', channel);

    channel.setProperties({
      input: bus1,
      output: master
    });
  },

  channel: null,

  bus1: Ember.computed('audioService.busses.[]', function() {
    var busses = this.get('audioService.busses');
    return busses.objectAt(0);
  }),

  bus2: Ember.computed('audioService.busses.[]', function() {
    var busses = this.get('audioService.busses');
    return busses.objectAt(1);
  }),


  actions: {

    // activateBus(src, b) {
    //
    //   var busses = this.get('audioService.busses');
    //   var bus = busses.objectAt(b).bus;
    //   if (c[b]) {
    //     src.disconnect(bus);
    //     c[b] = false;
    //     Ember.Logger.log('disconnect Bus', src);
    //   } else {
    //     src.connect(bus);
    //     Ember.Logger.log('connect Bus', src);
    //     c[b] = true;
    //   }
    // },
    //
    // invertPolarity(b) {
    //   var busses = this.get('audioService.busses');
    //   var bus = busses.objectAt(b);
    //   bus.toggleProperty('polarity');
    // }
  }
});
