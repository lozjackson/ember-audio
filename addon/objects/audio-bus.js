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
export default Ember.Object.extend( AudioBusMixin );
