import $ from 'jquery';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({

  audioService: service(),

  busses: alias('audioService.busses'),

  channel: 0,

  bus: computed('channel', 'busses.[]', function() {
    var busses = this.get('busses');
    var channel = this.get('channel');
    return busses.objectAt(channel).bus;
  }),

  actions: {
    selectBus() {
      const selectedEl    = $('.bus-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      this.set('channel', selectedIndex);
    }
  }
});
