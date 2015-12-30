import Ember from 'ember';
import GainObject from 'ember-audio/objects/gain';

var computed = Ember.computed;

export default Ember.Controller.extend({
  channel: computed('audioService.channels.[]', function () {
    return this.audioService.get('channels').objectAt(0);
  }),

  actions: {

    addGainNode() {
      var channel = this.get('channel');
      channel.addNode(GainObject.create({ audioService: this.audioService }));
      channel.chainNodes();
    }
  }
});
