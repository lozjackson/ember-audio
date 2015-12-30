export function initialize(/* container, application */) {
  const app = arguments[1] || arguments[0];
  app.inject('controller', 'audioService', 'service:audioService');
  app.inject('component', 'audioService', 'service:audioService');
}

export default {
  name: 'audio-service',
  initialize: initialize
};
