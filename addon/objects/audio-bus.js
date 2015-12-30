/**
  @module ember-audio
*/
import Ember from 'ember';
import AudioBusMixin from 'ember-audio/mixins/audio-bus';

/**
  ## AudioBusObject

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
    This is only used for reference.

    @property id
    @type {Integer}
  */
  id: null
});
