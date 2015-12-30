import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('audio-bus', 'Integration | Component | audio bus', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{audio-bus}}`);

  assert.equal(this.$('div').length, 1);

  // Template block usage:
  // this.render(hbs`
  //   {{#audio-bus}}
  //     template block text
  //   {{/audio-bus}}
  // `);

  // assert.equal(this.$().text().trim(), 'template block text');
});
