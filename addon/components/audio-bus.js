/**
  @module ember-audio
*/
import Ember from 'ember';
import AudioBusMixin from 'ember-audio/mixins/audio-bus';
import layout from '../templates/components/audio-bus';

/**
  ## AudioBusComponent

  @class AudioBusComponent
  @namespace Components
  @uses Mixins.AudioBusMixin
*/
export default Ember.Component.extend( AudioBusMixin, {

  layout: layout,

  /**
    This is the `audioService` service.  It represents the audio system and gives
    us acces to the `AudioContext` object which among other things provides the
    audio output.

    @property audioService
    @type {Object}
    @private
  */
  audioService: Ember.inject.service()
});
