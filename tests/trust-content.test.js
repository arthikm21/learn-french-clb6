const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const trustFiles = [
  'app.js',
  'index.html',
  'how-to-score-clb6.html',
  'clb6-french-course.html',
  'free-french-course-canada.html',
  'tcf-canada-mock-test.html',
  'tef-vs-tcf-canada.html',
  'clb-6-vs-clb-7-french.html',
  'learn-french-express-entry.html',
  'clb-7-french.html',
  'tcf-canada-speaking.html',
  'tcf-canada-writing.html',
  'tef-canada.html',
  'modules/mock.js',
  'modules/tcfguide.js',
];

test('learner-facing trust surfaces contain no retired score or audio claims', () => {
  const corpus = trustFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  const retired = [
    /native Canadian French audio/i,
    /CLB band estimate/i,
    /abbreviated listening/i,
    /full mock test with a band estimate/i,
    /400[–-]457[^\n<]*400[–-]457/i,
    /level 10[–-]11/i,
  ];
  for (const pattern of retired) assert.doesNotMatch(corpus, pattern);
});

test('published NCLC 6 reference ranges match the current IRCC equivalencies', () => {
  const guide = fs.readFileSync('modules/tcfguide.js', 'utf8');
  const article = fs.readFileSync('how-to-score-clb6.html', 'utf8');
  assert.match(guide, /398-457/);
  assert.match(guide, /406-452/);
  assert.match(guide, /<b>7-9<\/b>/);
  assert.match(article, /398–457/);
  assert.match(article, /406–452/);
  assert.match(article, /217–248/);
  assert.match(article, /181–206/);
  assert.match(article, /271–309/);
});
