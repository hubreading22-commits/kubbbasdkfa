import test from 'node:test';
import assert from 'node:assert/strict';
import {
  maskAadhaarNumber,
  maskSensitiveNumber,
  evaluateExpiryStatus,
  getNextReminderMilestone,
  canAccessTenantDocument,
  validateWaitlistInput,
} from './vaultLogic';

test('maskAadhaarNumber always masks first 8 digits and preserves only last 4', () => {
  assert.equal(maskAadhaarNumber('7482 9103 4821'), 'XXXX-XXXX-4821');
  assert.equal(maskAadhaarNumber('748291034821'), 'XXXX-XXXX-4821');
  assert.equal(maskAadhaarNumber('12'), 'XXXX-XXXX-XXXX');
});

test('maskSensitiveNumber applies Aadhaar masking for AADHAAR and standard masking for passports', () => {
  assert.equal(maskSensitiveNumber('9988-7766-5544', 'AADHAAR'), 'XXXX-XXXX-5544');
  assert.equal(maskSensitiveNumber('N8472910', 'PASSPORT'), '•••• •••• 2910');
});

test('evaluateExpiryStatus returns CRITICAL, WARNING, and HEALTHY with paired icons and bilingual labels', () => {
  const expired = evaluateExpiryStatus('2026-10-20', '2026-10-25');
  assert.equal(expired.state, 'CRITICAL');
  assert.equal(expired.iconName, 'AlertTriangle');
  assert.equal(expired.daysRemaining, -5);
  assert.ok(expired.labelMl.includes('5'));

  const urgent = evaluateExpiryStatus('2026-10-29', '2026-10-25');
  assert.equal(urgent.state, 'CRITICAL');
  assert.equal(urgent.daysRemaining, 4);

  const warning = evaluateExpiryStatus('2026-11-20', '2026-10-25');
  assert.equal(warning.state, 'WARNING');
  assert.equal(warning.iconName, 'Clock');
  assert.equal(warning.daysRemaining, 26);

  const healthy = evaluateExpiryStatus('2027-06-15', '2026-10-25');
  assert.equal(healthy.state, 'HEALTHY');
  assert.equal(healthy.iconName, 'CheckCircle2');
});

test('getNextReminderMilestone schedules 60, 30, 7, 1 and weekly overdue offsets', () => {
  assert.equal(getNextReminderMilestone(90), 60);
  assert.equal(getNextReminderMilestone(45), 30);
  assert.equal(getNextReminderMilestone(12), 7);
  assert.equal(getNextReminderMilestone(3), 1);
  assert.equal(getNextReminderMilestone(-2), -7);
  assert.equal(getNextReminderMilestone(-9), -14);
});

test('canAccessTenantDocument strictly prevents cross-tenant reads and enforces private visibility', () => {
  const tenantADocPrivate = {
    id: 'doc-1',
    tenantId: 'tenant-nair-family',
    createdByUserId: 'user-appachan',
    visibility: 'PRIVATE' as const,
  };

  const tenantADocShared = {
    id: 'doc-2',
    tenantId: 'tenant-nair-family',
    createdByUserId: 'user-appachan',
    visibility: 'SHARED' as const,
  };

  // Cross-tenant attempt by another household OWNER must ALWAYS fail
  assert.equal(
    canAccessTenantDocument(
      { tenantId: 'tenant-menon-family', userId: 'user-menon', role: 'OWNER' },
      tenantADocShared
    ),
    false
  );

  // Same-tenant VIEWER can read SHARED doc, but NOT someone else's PRIVATE doc
  assert.equal(
    canAccessTenantDocument(
      { tenantId: 'tenant-nair-family', userId: 'user-son-dubai', role: 'VIEWER' },
      tenantADocShared
    ),
    true
  );
  assert.equal(
    canAccessTenantDocument(
      { tenantId: 'tenant-nair-family', userId: 'user-son-dubai', role: 'VIEWER' },
      tenantADocPrivate
    ),
    false
  );

  // Same-tenant OWNER or creator can read PRIVATE doc
  assert.equal(
    canAccessTenantDocument(
      { tenantId: 'tenant-nair-family', userId: 'user-owner', role: 'OWNER' },
      tenantADocPrivate
    ),
    true
  );
});

test('validateWaitlistInput rejects invalid phones/names and accepts Kerala & Gulf contacts', () => {
  assert.equal(
    validateWaitlistInput({
      name: 'A',
      phoneOrEmail: '9447123456',
      familyType: 'KERALA_RESIDENT',
      districtOrCountry: 'Kozhikode',
    }).valid,
    false
  );

  assert.equal(
    validateWaitlistInput({
      name: 'Rajesh Nair',
      phoneOrEmail: 'invalid',
      familyType: 'GULF_NRI',
      districtOrCountry: 'Dubai, UAE',
    }).valid,
    false
  );

  assert.equal(
    validateWaitlistInput({
      name: 'Rajesh Nair',
      phoneOrEmail: '+971 50 482 9102',
      familyType: 'GULF_NRI',
      districtOrCountry: 'Dubai, UAE',
    }).valid,
    true
  );
});
