import Ember from 'ember';
import layout from '../templates/components/audio-player';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'audio',

  attributeBindings: [ 'src', 'controls'],

  controls: true,

  src: ''
});
