const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserModule } = require('./helpers');

function router() {
  const context = loadBrowserModule('modules/router.js', { URLSearchParams });
  return context.window.Router;
}

test('router round-trips unicode and reserved parameter characters', () => {
  const Router = router();
  const hash = Router.build('scenario', { id: 'café & travail', next: 'a=b' });
  const parsed = Router.parse(hash);
  assert.equal(parsed.route, 'scenario');
  assert.deepEqual({ ...parsed.params }, { id: 'café & travail', next: 'a=b' });
});

test('router safely recovers from malformed or unsafe hashes', () => {
  const Router = router();
  assert.equal(Router.parse('#listen?text=%E0%A4%A').params.text, '�%A');
  assert.equal(Router.parse('#<script>?x=1').route, 'home');
  assert.equal(Router.build('../profile', {}).startsWith('#home'), true);
});
