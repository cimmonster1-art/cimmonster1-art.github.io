const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname + '/app.js', 'utf8').split('let items=[],questions=[];')[0];
const inspect = vm.runInNewContext(source + '\ninspectBrief');
const booking = text => inspect(text).find(x => x.rule.title === 'Booking workflow definition');

test('ordinary positive brief retains booking', () => {
  assert.ok(booking('A website with a booking link.').positive);
  assert.equal(booking('A website with a booking link.').negative, undefined);
});
test('explicit exclusions are review questions rather than positive suggestions', () => {
  for (const phrase of ['No booking system.', 'We do not need a custom booking system.', 'Without a booking integration.', 'Booking is not required.']) {
    assert.ok(booking(phrase).negative, phrase);
    assert.equal(booking(phrase).positive, undefined, phrase);
  }
});
test('positive and negative mentions both survive for clarification', () => {
  const result = booking('No custom booking system, but include a booking link.');
  assert.ok(result.positive);
  assert.ok(result.negative);
});
test('sentence boundaries and not-only phrasing do not negate a feature', () => {
  assert.ok(booking('No logo. Add booking.').positive);
  assert.ok(booking('Not only booking but contact details.').positive);
});
test('all occurrences are checked, including an initial negative one', () => {
  const result = booking('Booking is not needed. A calendar link is wanted.');
  assert.equal(result.negative.phrase, 'Booking');
  assert.equal(result.positive.phrase, 'calendar');
});
test('text without matching categories produces no fabricated matches', () => {
  assert.equal(inspect('Prepare a report about the quarterly figures.').length, 0);
});
