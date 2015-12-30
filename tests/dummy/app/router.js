import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('audio-player');
  this.route('tone-generator');
  this.route('channel-strip');
});

export default Router;
