/**
  @module ember-audio
*/
import { observer } from '@ember/object';

import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/audio-player';

/**
  This component is rendered with the `<audio>` tag.

  @class AudioPlayerComponent
  @namespace Components
*/
export default Component.extend({
  layout: layout,

  /**
    @property audioService
    @type {Object}
    @private
  */
  audioService: service(),

  /**
    @property tagName
    @type {String}
  */
  tagName: 'audio',

  /**
    @property attributeBindings
    @type {Array}
  */
  attributeBindings: [ 'src', 'controls'],

  /**
    ## controls

    This property is bound to the `controls` attribute of the audio element.  When set
    to true the audio player will display the browser's default audio player interface.

    @property controls
    @type {Boolean}
    @default true
  */
  controls: true,

  /**
    ## src
    This property is bound to the `src` attribute of the audio element.

    @property src
    @type {String}
  */
  src: '',

  /**
    This is a reference to the audio player object.

    @property player
    @type {Object}
    @private
  */
  player: null,

  /**
    ## output

    The destination `audioNode` to output to.  If this property is not set, then
    the player will be connected to the `audioService.output`.

    @property output
    @type {Object}
  */
  output: null,

  didInsertElement() {
    var audioContext = this.get('audioService.audioContext');
    var player = audioContext.createMediaElementSource(this.$()[0]);
    this.set('player', player);
    this.connectPlayer(player);

  },

  /**
    Connect the player to the output.

    If the output isn't set, then set the output to `audioService.output`.

    @method connectPlayer
    @param {Object} player
    @private
  */
  connectPlayer(player) {
    var output = this.get('output') || this.get('audioService.output');

    if ( output ) {
      player.connect(output);
    }
  },

  /**
    ## connect

    Connect the player to another `audioNode`.  This method is a proxy for the
    player's `connect` method.

    @method connect
  */
  connect() {
    var player = this.get('player');
    player.connect(...arguments);
  },

  /**
    ## disconnect

    Disconnect the player from another `audioNode`.  This method is a proxy for
    the player's `disconnect` method.

    @method disconnect
  */
  disconnect() {
    var player = this.get('player');
    player.disconnect(...arguments);
  },

  /**
    If the output changes, connect the player to it.

    @method outputChanged
  */
  ouputChanged: observer('output', 'player', function() {
    var output = this.get('output');
    var player = this.get('player');
    if ( player ) {
      player.disconnect(0);
      if ( output ) {
        player.connect(output);
      }
    }
  })
});
