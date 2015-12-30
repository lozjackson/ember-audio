/**
  @module ember-audio
*/
import Ember from 'ember';
import AudioBusObject from 'ember-audio/objects/audio-bus';
import ChannelStrip from 'ember-audio/objects/channel-strip';
import GainObject from 'ember-audio/objects/gain';

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

/**
  ## Audio Service

  This is the `audioService` service.  It represents the audio system and gives
  us acces to the `AudioContext` object which among other things provides the
  audio output.

  @class AudioService
  @namespace Services
*/
export default Ember.Service.extend({

  /**
    ## AudioContext

    The `AudioContext` object.

    @property audioContext
    @type {Object}
  */
  audioContext: audioContext,

  /**
    @property busses
    @type {Array}
  */
  busses: Ember.A(),

  /**
    @property channels
    @type {Array}
  */
  channels: Ember.A(),

  /**
    ## Distination

    Alias of `audioContext.destination`

    The represents the output of the audio system.

      ```
      var destination = this.get('audioService.destination');
      source.connectOutput(destination);
      ```

    @property destination
    @type {Object}
  */
  destination: Ember.computed.alias('audioContext.destination'),

  /**
    Createa a new `AudioContext` object.

    @method init
    @private
  */
  init() {
    this._super(...arguments);
    this.checkState();
    this.setProperties({
      busses: Ember.A(),
      channels: Ember.A()
    });
  },

  /**
    Checks the state of the `audioContext `object.

    @method checkState
    @private
  */
  checkState() {
    var context = this.get('audioContext');
    Ember.assert('`audioContext` should not be null', context);
    if ( context && context.state === 'running' ) {
      Ember.Logger.debug(`Ember-audio: ${context.sampleRate / 1000} Khz; Channel count: ${context.destination.channelCount}`);
    }
  },

  /**
    Create a single `AudioBus` object and add it to the `busses` array.

    @method createBus
    @private
  */
  createBus() {
    var busses = this.get('busses');
    var audioBusObject = AudioBusObject.create({
      audioService: this,
      id: busses.get('length') + 1
    });
    busses.pushObject(audioBusObject);
  },

  /**
    ## Add Bus

    Add an audio bus.

    @method addBus
    @param {Integer} number The number of busses to add.
  */
  addBus(number) {
    if (typeof number === 'number') {
      for(var i = 0; i < parseInt(number); i++) {
        this.createBus();
      }
    } else {
      this.createBus();
    }
  },

  /**
    Create a single `ChannelStrip` object and add it to the `channels` array.

    @method createChannel
    @private
  */
  createChannel() {
    var channels = this.get('channels');
    var channel = ChannelStrip.create({
      audioService: this,
      id: channels.get('length') + 1
    });
    channels.pushObject(channel);
  },

  /**
    ## Add Channel

    Add an audio channel.

    @method addChannel
    @param {Integer} number The number of channels to add.
  */
  addChannel(number) {
    if (typeof number === 'number') {
      for(var i = 0; i < parseInt(number); i++) {
        this.createChannel();
      }
    } else {
      this.createChannel();
    }
  },

  /**

      ```
      var gain = this.createGain({
        input: source,
        output: destination
      });

      // or

      var gain = this.createGain();
      source.connectOutput(gain);
      gain.connectOutput(destination);
      ```

    @method createGain
    @param {Object} params
  */
  createGain(params) {
    var gainObject = GainObject.create({ audioService:this });
    if (params) {
      gainObject.setProperties(params);
    }
    return gainObject;
  }
});
