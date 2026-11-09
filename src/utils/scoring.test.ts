import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCompletenessScore,
  getCompletenessGrade,
  validateNia,
  evaluateUnitIndicators,
  DEFAULT_WEIGHTS,
} from './scoring';

test('calculateCompletenessScore computes sum of active indicator weights', () => {
  const fullIndicators = {
    profile: true,
    officers: true,
    members: true,
    sp: true,
    activities: true,
    documentation: true,
  };
  assert.equal(calculateCompletenessScore(fullIndicators, DEFAULT_WEIGHTS), 100);

  const partialIndicators = {
    profile: true,      // 10
    officers: true,     // 20
    members: false,     // 0
    sp: true,           // 20
    activities: false,  // 0
    documentation: false// 0
  };
  assert.equal(calculateCompletenessScore(partialIndicators, DEFAULT_WEIGHTS), 50);
});

test('getCompletenessGrade maps scores accurately to official categories', () => {
  assert.equal(getCompletenessGrade(100), 'Sangat Baik');
  assert.equal(getCompletenessGrade(90), 'Sangat Baik');
  assert.equal(getCompletenessGrade(89), 'Baik');
  assert.equal(getCompletenessGrade(75), 'Baik');
  assert.equal(getCompletenessGrade(74), 'Cukup');
  assert.equal(getCompletenessGrade(50), 'Cukup');
  assert.equal(getCompletenessGrade(49), 'Perlu Pembinaan');
  assert.equal(getCompletenessGrade(1), 'Perlu Pembinaan');
  assert.equal(getCompletenessGrade(0), 'Belum Terdata');
});

test('validateNia catches empty, short, or duplicate NIAs', () => {
  const existing = ['NIA-DUK-001', 'NIA-DUK-002'];

  const emptyRes = validateNia('', existing);
  assert.equal(emptyRes.isValid, false);

  const shortRes = validateNia('12', existing);
  assert.equal(shortRes.isValid, false);

  const dupRes = validateNia('NIA-DUK-001', existing);
  assert.equal(dupRes.isValid, false);

  const validRes = validateNia('NIA-DUK-003', existing);
  assert.equal(validRes.isValid, true);
});

test('evaluateUnitIndicators computes accurate completeness criteria', () => {
  const unit = {
    leaderIpnu: 'Ahmad Fauzi',
    leaderIppnu: 'Siti Aminah',
    address: 'Jl. Raya Dukun No. 12',
    officersCount: 4,
    membersCount: 12,
    spIpnuStatus: 'AKTIF',
    spIppnuStatus: 'AKTIF',
    activitiesCount: 2,
    hasDocumentation: true,
  };

  const indicators = evaluateUnitIndicators(unit);
  assert.equal(indicators.profile, true);
  assert.equal(indicators.officers, true);
  assert.equal(indicators.members, true);
  assert.equal(indicators.sp, true);
  assert.equal(indicators.activities, true);
  assert.equal(indicators.documentation, true);
});
