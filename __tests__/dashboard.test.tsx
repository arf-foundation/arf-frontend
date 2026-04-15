import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../app/dashboard/page';

jest.mock('../hooks/useInView', () => ({
  useInView: () => ({ ref: { current: null }, inView: true }),
}));

describe('Dashboard (Simulated Demo)', () => {
  it('renders the main risk card with title', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('ARF System Risk')).toBeInTheDocument();
  });

  it('displays a risk score percentage (unique large text)', async () => {
    render(<Dashboard />);
    // Match numbers like "32%" or "32 %"
    const riskPercentage = await screen.findByText(/\d+\s*%/);
    expect(riskPercentage).toBeInTheDocument();
  });

  it('shows the simulated disclaimer banner', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/simulated demo/i)).toBeInTheDocument();
  });

  it('displays the risk status badge', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/SAFE|WARNING|CRITICAL/)).toBeInTheDocument();
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

  it('shows recent incidents (at least one service name)', async () => {
    render(<Dashboard />);
    const services = await screen.findAllByText(/payment-api|auth-service|database/);
    expect(services.length).toBeGreaterThan(0);
  });

  it('displays action badges (at least one APPROVE, DENY, ESCALATE)', async () => {
    render(<Dashboard />);
    const approveBadges = await screen.findAllByText('APPROVE');
    const denyBadges = await screen.findAllByText('DENY');
    const escalateBadges = await screen.findAllByText('ESCALATE');
    expect(approveBadges.length).toBeGreaterThan(0);
    expect(denyBadges.length).toBeGreaterThan(0);
    expect(escalateBadges.length).toBeGreaterThan(0);
  });

  it('has a refresh button that updates the risk score', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    const refreshButton = await screen.findByLabelText('Refresh data');
    const initialRisk = await screen.findByText(/\d+\s*%/);
    expect(initialRisk).toBeInTheDocument();
    await user.click(refreshButton);
    await waitFor(() => {
      expect(screen.getByText(/\d+\s*%/)).toBeInTheDocument();
    });
    expect(refreshButton).toBeEnabled();
  });

  it('displays the call to action for pilot access (at least one link)', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/Ready to govern your AI agents\?/i)).toBeInTheDocument();
    const pilotLinks = await screen.findAllByRole('link', { name: /Request Pilot Access/i });
    expect(pilotLinks.length).toBeGreaterThan(0);
    const signupLink = pilotLinks.find(link => link.getAttribute('href') === '/signup');
    expect(signupLink).toBeTruthy();
  });

  it('does not show HTTP warning by default', () => {
    render(<Dashboard />);
    const httpWarning = screen.queryByText(/Security warning: You are viewing this page over HTTP/i);
    expect(httpWarning).not.toBeInTheDocument();
  });
});
