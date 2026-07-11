const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserModules } = require('./helpers');

test('practice simulation matches official section counts and total duration', () => {
  const context = loadBrowserModules([
    'data/listening.js',
    'data/dialogues.js',
    'data/listening_tcf.js',
    'data/reading.js',
    'data/reading_tcf.js',
    'data/mock.js',
  ]);
  const [listen, read, write, speak] = context.MOCK_TEST.sections;
  const limitedCount = (questions, limit) => limit ? Math.min(limit, questions.length) : questions.length;
  const listeningCount = listen.dialogueIds.reduce((sum, id) => sum + limitedCount(context.DIALOGUES[id].questions, listen.questionLimitById?.[id]), 0)
    + listen.tcfSegmentIds.reduce((sum, id) => sum + limitedCount(context.LISTENING_TCF[id].questions, listen.questionLimitById?.[id]), 0);
  const readingCount = read.textIds.reduce((sum, id) => sum + limitedCount(context.READINGS[id].questions, read.questionLimitById?.[id]), 0);

  assert.equal(listeningCount, 39);
  assert.equal(readingCount, 39);
  assert.equal(listen.duration, 35 * 60);
  assert.equal(read.duration, 60 * 60);
  assert.equal(write.duration, 60 * 60);
  assert.equal(speak.duration, 12 * 60);
  assert.equal(context.MOCK_TEST.sections.reduce((sum, section) => sum + section.duration, 0), 167 * 60);
});
