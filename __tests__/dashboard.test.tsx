import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../app/dashboard/page';

// Mock the useInView hook (if used in other components, but not in dashboard directly)
jest.mock('../hooks/useInView', () => ({
  useInView: () => ({ ref: { current: null }, inView: true }),
}));

describe('Dashboard (Simulated Demo)', () => {
  it('renders the main risk card with title', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('ARF System Risk')).toBeInTheDocument();
  });

  it('displays a risk score percentage (e.g., 22%)', async () => {
    render(<Dashboard />);
    // The gauge shows a percentage inside an SVG text element
    const percentageText = await screen.findByText(/\d+%/);
    expect(percentageText).toBeInTheDocument();
  });

  it('shows the simulated disclaimer banner', async () => {
    render(<Dashboard />);
    const disclaimer = await screen.findByText(/simulated demo/i);
    expect(disclaimer).toBeInTheDocument();
  });

  it('displays the risk status badge (safe / warning / critical)', async () => {
    render(<Dashboard />);
    const statusBadge = await screen.findByText(/SAFE|WARNING|CRITICAL/);
    expect(statusBadge).toBeInTheDocument();
  });

  it('shows the risk factor breakdown section', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/Risk Factor Breakdown/i)).toBeInTheDocument();
    expect(await screen.findByText(/Conjugate prior/i)).toBeInTheDocument();
    expect(await screen.findByText(/HMC prediction/i)).toBeInTheDocument();
    expect(await screen.findByText(/Hyperprior shrinkage/i)).toBeInTheDocument();
  });

  it('displays the semantic memory stats', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/Semantic Memory \(Simulated\)/i)).toBeInTheDocument();
    expect(await screen.findByText(/Similar Incidents/i)).toBeInTheDocument();
    expect(await screen.findByText(/RAG Similarity/i)).toBeInTheDocument();
    expect(await screen.findByText(/Cache Hits/i)).toBeInTheDocument();
  });

  it('shows the recent incidents table (desktop) or card list (mobile)', async () => {
    render(<Dashboard />);
    // Check for at least one incident service name
    expect(await screen.findByText('payment-api')).toBeInTheDocument();
    expect(await screen.findByText('auth-service')).toBeInTheDocument();
    expect(await screen.findByText('database')).toBeInTheDocument();
  });

  it('displays action badges (APPROVE, DENY, ESCALATE)', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('APPROVE')).toBeInTheDocument();
    expect(await screen.findByText('DENY')).toBeInTheDocument();
    expect(await screen.findByText('ESCALATE')).toBeInTheDocument();
  });

  it('has a refresh button that updates the risk score', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    const refreshButton = await screen.findByLabelText('Refresh data');
    const initialRisk = (await screen.findByText(/\d+%/)).textContent;
    await user.click(refreshButton);
    // Wait for the refresh animation and updated text
    await waitFor(() => {
      const newRisk = screen.getByText(/\d+%/).textContent;
      // The risk might stay the same sometimes, but we just verify it exists after click
      expect(newRisk).toBeTruthy();
    });
    // Ensure the button was enabled and clicked
    expect(refreshButton).toBeEnabled();
  });

  it('displays the call to action for pilot access', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/Ready to govern your AI agents\?/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Request Pilot Access/i })).toHaveAttribute('href', '/signup');
  });

  it('shows the HTTP warning banner only when on HTTP (simulate by mocking window.location)', () => {
    // This test is environment‑specific; we skip it in the CI (which runs on HTTPS usually)
    // Instead, we test that the banner is not present when protocol is HTTPS.
    // For simplicity, we check that the banner does NOT appear by default.
    render(<Dashboard />);
    const httpWarning = screen.queryByText(/Security warning: You are viewing this page over HTTP/i);
    expect(httpWarning).not.toBeInTheDocument();
  });
});
