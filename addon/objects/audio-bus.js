/**
  @module ember-audio
*/
import EmberObject from '@ember/object';
import AudioBusMixin from 'ember-audio/mixins/audio-bus';

/**
  ## AudioBusObject

  @class AudioBusObject
  @namespace Objects
  @uses EmberAudio.AudioBusMixin
*/
export default EmberObject.extend( AudioBusMixin, {

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
