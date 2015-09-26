import Ember from 'ember';

export default Ember.Controller.extend({
  audioService: Ember.inject.service(),
  output: Ember.computed.alias('audioService.output'),
});
