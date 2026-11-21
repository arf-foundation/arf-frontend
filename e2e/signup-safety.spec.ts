import { expect, test, visit } from './fixtures';

test('a signup outage focuses recovery and preserves the request', async ({ page }) => {
  await page.route('**/api/pilot-request', route => route.fulfill({
    status: 503,
    json: { error: 'Synthetic service outage' },
  }));
  await visit(page, '/signup?offer=write-access-review');
  await expect(page.getByRole('radio', { name: /Write-Access Review/ })).toBeChecked();
  await expect(page.getByRole('radio', { name: /Pilot Snapshot/ })).not.toBeChecked();
  await page.getByLabel('Work email').fill('engineer@example.com');
  await page.getByLabel('What write does the agent need to make?').fill('A synthetic write.');
  await page.getByLabel('What decision is it holding up?').fill('A synthetic decision.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send request' }).click();

  const alert = page.getByRole('alert').filter({ hasText: 'Your request could not be sent.' });
  await expect(alert).toBeFocused();
  await expect(alert.getByRole('link', { name: 'Email ARF' })).toHaveAttribute('href', 'mailto:juan@arf-ai.com');
  await expect(page.getByLabel('Work email')).toHaveValue('engineer@example.com');
  await expect(page.getByRole('button', { name: 'Send request' })).toBeEnabled();
});

test('the public agent labels its advisory boundary near the incident input', async ({ page, problems }) => {
  await visit(page, '/agent');
  await expect(page.getByText('It cannot authorize or execute changes.', { exact: false })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Incident description' }))
    .toHaveAccessibleDescription('Keep credentials and customer records out of the description.');
  problems.expectNone();
});

test('the homepage serves the narrowed script policy and hydrates', async ({ page, problems }) => {
  const response = await visit(page, '/');
  const policy = response?.headers()['content-security-policy'];
  expect(policy?.match(/(?:^|;)\s*script-src\s+([^;]+)/)?.[1]).toBe("'self' 'unsafe-inline'");
  const foreignScripts = await page.locator('script[src]').evaluateAll(scripts => scripts
    .map(script => new URL((script as HTMLScriptElement).src).origin)
    .filter(origin => origin !== window.location.origin));
  expect(foreignScripts).toEqual([]);
  problems.expectNone();
});
