/**
  @module ember-audio
*/
import Ember from 'ember';
import AudioBusMixin from 'ember-audio/mixins/audio-bus';

/**
  ## AudioBusObject

  An `AudioBusObject` is a chain of audio nodes.

  @class AudioBusObject
  @namespace EmberAudio
  @uses EmberAudio.AudioBusMixin
*/
export default Ember.Object.extend( AudioBusMixin, {

  /**
    This is required and is not automatically injected.  Pass in the audioService
    when creating it.

      ```
      AudioBusObject.create({
        audioService: this.get('audioService')
      });
      ```

    @property audioService
    @type {Object}
  */
  audioService: null,

  /**
    @property id
    @type {Integer}
  */
  id: null,

  /**
    @property nodes
    @type {Array}
  */
  nodes: Ember.A(),

  /**
    @method init
  */
  init() {
    this._super(...arguments);
    this.set('nodes', Ember.A());
  },

  /**
    @method addGain
    @return {Object}
  */
  addGain() {
    var { audioService, bus, nodes } = this.getProperties('audioService', 'bus', 'nodes');
    if (audioService) {
      var gain = audioService.createGain({
        input: bus,
        output: audioService.get('output')
      });
      nodes.pushObject(gain);
      return gain;
    }
  }
});
