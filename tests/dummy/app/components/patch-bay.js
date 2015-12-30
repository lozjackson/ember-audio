import Ember from 'ember';

export default Ember.Component.extend({

  audioService: Ember.inject.service(),

  busses: Ember.computed.alias('audioService.busses'),

  channel: 0,

  bus: Ember.computed('channel', 'busses.[]', function() {
    var busses = this.get('busses');
    var channel = this.get('channel');
    return busses.objectAt(channel).bus;
  }),

  actions: {
    selectBus() {
      const selectedEl    = Ember.$('.bus-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      this.set('channel', selectedIndex);
    }
  }
});
