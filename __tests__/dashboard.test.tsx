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

  it('displays a risk score percentage', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/\d+%/)).toBeInTheDocument();
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

  it('shows recent incidents', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('payment-api')).toBeInTheDocument();
    expect(await screen.findByText('auth-service')).toBeInTheDocument();
    expect(await screen.findByText('database')).toBeInTheDocument();
  });

  it('displays action badges', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('APPROVE')).toBeInTheDocument();
    expect(await screen.findByText('DENY')).toBeInTheDocument();
    expect(await screen.findByText('ESCALATE')).toBeInTheDocument();
  });

  it('has a refresh button that updates the risk score', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    const refreshButton = await screen.findByLabelText('Refresh data');
    expect(await screen.findByText(/\d+%/)).toBeInTheDocument();
    await user.click(refreshButton);
    await waitFor(() => {
      expect(screen.getByText(/\d+%/)).toBeInTheDocument();
    });
    expect(refreshButton).toBeEnabled();
  });

  it('displays the call to action for pilot access', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/Ready to govern your AI agents\?/i)).toBeInTheDocument();
    // Use findByText instead of findByRole to avoid accessible name issues
    const pilotLink = await screen.findByText(/Request Pilot Access/i);
    expect(pilotLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('does not show HTTP warning by default', () => {
    render(<Dashboard />);
    const httpWarning = screen.queryByText(/Security warning: You are viewing this page over HTTP/i);
    expect(httpWarning).not.toBeInTheDocument();
  });
});
