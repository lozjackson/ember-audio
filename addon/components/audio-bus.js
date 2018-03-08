/**
  @module ember-audio
*/
import { inject as service } from '@ember/service';

import Component from '@ember/component';
import AudioBusMixin from 'ember-audio/mixins/audio-bus';
import layout from '../templates/components/audio-bus';

/**
  ## AudioBusComponent

  @class AudioBusComponent
  @namespace Components
  @uses EmberAudio.AudioBusMixin
*/
export default Component.extend( AudioBusMixin, {

  layout: layout,

  /**
    This is the `audioService` service.  It represents the audio system and gives
    us acces to the `AudioContext` object which among other things provides the
    audio output.

    @property audioService
    @type {Object}
    @private
  */
  audioService: service()
});
