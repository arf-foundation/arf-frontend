import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../app/dashboard/page';

jest.mock('../hooks/useInView', () => ({
  useInView: () => ({ ref: { current: null }, inView: true }),
}));

describe('Dashboard (Simulated Demo)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const advanceTimers = async () => {
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  };

  it('renders the main risk card with title', async () => {
    render(<Dashboard />);
    await advanceTimers();
    expect(await screen.findByText('ARF System Risk')).toBeInTheDocument();
  });

  it('displays a risk score percentage', async () => {
    render(<Dashboard />);
    await advanceTimers();
    await screen.findByText('ARF System Risk');
    const percentages = await screen.findAllByText(/\d+\s*%/);
    expect(percentages.length).toBeGreaterThan(0);
  });

  it('shows the simulated disclaimer banner', async () => {
    render(<Dashboard />);
    await advanceTimers();
    expect(await screen.findByText(/simulated demo/i)).toBeInTheDocument();
  });

  it('displays the risk status badge', async () => {
    render(<Dashboard />);
    await advanceTimers();
    expect(await screen.findByText(/SAFE|WARNING|CRITICAL/)).toBeInTheDocument();
  });

  it('shows the risk factor breakdown section', async () => {
    render(<Dashboard />);
    await advanceTimers();
    expect(await screen.findByText(/Risk Factor Breakdown/i)).toBeInTheDocument();
    expect(await screen.findByText(/Conjugate prior/i)).toBeInTheDocument();
    expect(await screen.findByText(/HMC prediction/i)).toBeInTheDocument();
    expect(await screen.findByText(/Hyperprior shrinkage/i)).toBeInTheDocument();
  });

  it('displays the semantic memory stats', async () => {
    render(<Dashboard />);
    await advanceTimers();
    expect(await screen.findByText(/Semantic Memory \(Simulated\)/i)).toBeInTheDocument();
    expect(await screen.findByText(/Similar Incidents/i)).toBeInTheDocument();
    expect(await screen.findByText(/RAG Similarity/i)).toBeInTheDocument();
    expect(await screen.findByText(/Cache Hits/i)).toBeInTheDocument();
  });

  it('shows recent incidents (at least one service name)', async () => {
    render(<Dashboard />);
    await advanceTimers();
    const services = await screen.findAllByText(/payment-api|auth-service|database/);
    expect(services.length).toBeGreaterThan(0);
  });

  it('displays action badges (at least one APPROVE, DENY, ESCALATE)', async () => {
    render(<Dashboard />);
    await advanceTimers();
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
    await advanceTimers();
    await screen.findByText('ARF System Risk');
    const refreshButton = await screen.findByLabelText('Refresh data');
    expect(refreshButton).toBeEnabled();
    await user.click(refreshButton);
    // Click triggers another 500ms delay, so advance timers again
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(screen.getByText(/\d+\s*%/)).toBeInTheDocument();
    });
    expect(refreshButton).toBeEnabled();
  });

  it('displays the call to action for pilot access (at least one link)', async () => {
    render(<Dashboard />);
    await advanceTimers();
    expect(await screen.findByText(/Ready to govern your AI agents\?/i)).toBeInTheDocument();
    const pilotLinks = await screen.findAllByRole('link', { name: /Request Pilot Access/i });
    expect(pilotLinks.length).toBeGreaterThan(0);
    const signupLink = pilotLinks.find(link => link.getAttribute('href') === '/signup');
    expect(signupLink).toBeTruthy();
  });

  it('does not show HTTP warning by default', async () => {
    render(<Dashboard />);
    await advanceTimers();
    const httpWarning = screen.queryByText(/Security warning: You are viewing this page over HTTP/i);
    expect(httpWarning).not.toBeInTheDocument();
  });
});
