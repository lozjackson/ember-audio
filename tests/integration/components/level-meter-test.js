import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import AudioService from 'ember-audio/services/audio-service';

var audioService = AudioService.create();

moduleForComponent('level-meter', 'Integration | Component | level meter', {
  integration: true
});

test('it renders and has correct tag and class names', function(assert) {
  assert.expect(1);
  this.set('audioService', audioService);
  this.render(hbs`{{level-meter audioService=audioService}}`);
  assert.equal(this.$('canvas.ember-audio.level-meter').length, 1);
});
