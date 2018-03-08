import Controller from '@ember/controller';
import { computed } from '@ember/object';
import GainObject from 'ember-audio/objects/gain';

export default Controller.extend({
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
