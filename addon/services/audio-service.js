/**
  @module ember-audio
*/
import { assert } from '@ember/debug';

import { alias } from '@ember/object/computed';
import { A } from '@ember/array';
import Service from '@ember/service';
import Ember from 'ember';
import AudioBusObject from 'ember-audio/objects/audio-bus';
import ChannelStrip from 'ember-audio/objects/channel-strip';
import GainObject from 'ember-audio/objects/gain';

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

/**
  ## Audio Service

  This is the `audioService`.  It represents the audio system and gives
  us acces to the `AudioContext` object which among other things provides the
  audio output.

  The `audioService` has an array of `channels` and `busses`.  Channels can be
  used for processing audio streams, and busses for routing and summing.

  ### Channels

  To create a new channel you create a `ChannelStripObject` and add it to the
  `channels` array - This can be done easily with the `addChannel` method.

  ```
  // add 1 channel
  audioService.addChannel();

  // add 24 channels
  audioService.addChannel(24);
  ```

  Channel strips can then be accessed by looking up the channel in the `channels`
  array.  The array is indexed from 0 - You can use the `objectAt` method to find
  a channel using the index.

  ```
  var channels = audioService.get('channels');
  var ch1 = channels.objectAt(0);
  var ch6 = channels.objectAt(5);
  ```

  ### Busses

  Busses can be created in a similar way to channels.  You create an `AudioBusObject`
  and add it to the `busses` array  - This can be done easily with the `addBus`
  method.

  ```
  // add 1 bus
  audioService.addBus();

  // add 24 busses
  audioService.addBus(24);
  ```

  Busses can then be accessed by looking up the bus in the `busses` array.  The
  array is indexed from 0 - You can use the `objectAt` method to find a bus using
  the index.

  ```
  var busses = audioService.get('busses');
  var bus1 = busses.objectAt(0);
  var bus6 = busses.objectAt(5);
  ```

  @class AudioService
  @namespace Services
*/
export default Service.extend({

  /**
    ## AudioContext

    The `AudioContext` object.

    @property audioContext
    @type {Object}
    @private
  */
  audioContext: audioContext,

  /**
    ## Busses

    This is an array of `AudioBusObject`s.  Busses can be accessed by using the
    `objectAt` method to find a bus using the index.  The array is indexed from 0.

    ```
    var busses = audioService.get('busses');
    var bus1 = busses.objectAt(0);
    var bus6 = busses.objectAt(5);
    ```

    @property busses
    @type {Array}
  */
  busses: A(),

  /**
    ## Channels

    This is an array of `ChannelStripObject`s.  Channel strips can be accessed
    by using the `objectAt` method to find a channel using the index.  The array
    is indexed from 0.

    ```
    var channels = audioService.get('channels');
    var ch1 = channels.objectAt(0);
    var ch6 = channels.objectAt(5);
    ```

    @property channels
    @type {Array}
  */
  channels: A(),

  /**
    ## Destination

    Alias of `audioContext.destination`

    The represents the output of the audio system.

    ```
    var destination = audioService.get('destination');

    // connect a source to the `destination` object.
    source.connectOutput(destination);
    ```

    @property destination
    @type {Object}
  */
  destination: alias('audioContext.destination'),

  /**
    Createa a new `AudioContext` object.

    @method init
    @private
  */
  init() {
    this._super(...arguments);
    this.checkState();
    this.setProperties({
      busses: A(),
      channels: A()
    });
  },

  /**
    Checks the state of the `audioContext `object.

    @method checkState
    @private
  */
  checkState() {
    var context = this.get('audioContext');
    assert('`audioContext` should not be null', context);
    if ( context && context.state === 'running' ) {
      Ember.Logger.debug(`Ember-audio: ${context.sampleRate / 1000} Khz; Channel count: ${context.destination.channelCount}`);
    }
  },

  /**
    Create an `AudioBus` object.

    @method createBus
    @private
  */
  createBus() {
    var busses = this.get('busses');
    return AudioBusObject.create({
      audioService: this,
      id: busses.get('length') + 1
    });
  },

  /**
    ## Add Bus

    Use this method to add an `AudioBusObject` to the `busses` array.

    ```
    // add 1 bus
    audioService.addBus();

    // add 24 busses
    audioService.addBus(24);
    ```

    @method addBus
    @param {Integer} number The number of busses to add.
  */
  addBus(number) {
    var busses = this.get('busses');
    if (typeof number === 'number') {
      for(var i = 0; i < parseInt(number); i++) {
        busses.pushObject(this.createBus());
      }
    } else {
      busses.pushObject(this.createBus());
    }
  },

  /**
    Create a `ChannelStrip` object.

    @method createChannel
    @private
  */
  createChannel() {
    var channels = this.get('channels');
    return ChannelStrip.create({
      audioService: this,
      id: channels.get('length') + 1
    });
  },

  /**
    ## Add Channel

    Use this method to add a `ChannelStripObject` to the `channels` array.

    ```
    // add 1 channel
    audioService.addChannel();

    // add 24 channels
    audioService.addChannel(24);
    ```

    @method addChannel
    @param {Integer} number The number of channels to add.
  */
  addChannel(number) {
    var channels = this.get('channels');
    if (typeof number === 'number') {
      for(var i = 0; i < parseInt(number); i++) {
        channels.pushObject(this.createChannel());
      }
    } else {
      channels.pushObject(this.createChannel());
    }
  },

  /**
    ## Create Gain Object

    Use this method to create a `GainObject`.
    ```
    var gain = this.createGain({
      input: source,
      output: destination
    });
    ```

    Or...

    ```
    // create the gain object
    var gain = this.createGain();

    // connect the gain object to other objects.
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
