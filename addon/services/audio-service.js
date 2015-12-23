/**
  @module ember-audio
*/
import Ember from 'ember';
import AudioBusObject from 'ember-audio/objects/audio-bus';
import GainObject from 'ember-audio/objects/gain';


/**
  ## Audio Service

  This is the `audioService` service.  It represents the audio system and gives
  us acces to the `AudioContext` object which among other things provides the
  audio output.

  @class AudioService
  @namespace EmberAudio
*/
export default Ember.Service.extend({

  /**
    ## AudioContext

    The `AudioContext` object.

    @property audioService
    @type {Object}
  */
  audioContext: null,

  /**
    @property busses
    @type {Array}
  */
  busses: Ember.A(),

  /**
    ## Output

    The audio output.

    To connect something the audio output.

      var source = this.get('source');
      var output = this.get('output');
      source.connect( output );

    @property output
    @type {Object}
  */
  output: Ember.computed.alias('audioContext.destination'),

  /**
    Createa a new `AudioContext` object.

    @method init
  */
  init() {
    this._super(...arguments);
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    this.set('audioContext', context);
    if ( context.state === 'running' ) {
      Ember.Logger.debug(`Ember-audio: ${context.sampleRate} Khz; Channel count: ${context.destination.channelCount}`);
    }
  },

  /**
    @method createBus
    @private
  */
  createBus() {
    var audioBusObject = AudioBusObject.create({audioService:this});
    var busses = this.get('busses');
    busses.pushObject(audioBusObject);
  },

  /**
    @method addBuss
    @param {Integer} number The number of busses to add.
  */
  addBuss( number ) {
    if (typeof number === 'number') {
      for(var i = 0; i < parseInt(number); i++) {
        this.createBus();
      }
    } else {
      this.createBus();
    }
  },

  /**
    @method createGain
  */
  createGain() {
    var gainObject = GainObject.create({ audioService:this });
    return gainObject;
  }
});
