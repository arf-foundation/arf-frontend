import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../app/dashboard/page';

// Mock window.location.protocol to avoid HTTP warning banner
const originalLocation = window.location;
beforeAll(() => {
  delete (window as { location: Location }).location;
  Object.defineProperty(window, 'location', {
    value: { ...originalLocation, protocol: 'https:' },
    writable: true,
    configurable: true,
  });
});
afterAll(() => {
  window.location = originalLocation;
});

jest.mock('../hooks/useInView', () => ({
  useInView: () => ({ ref: { current: null }, inView: true }),
}));

describe('Dashboard (Simulated Demo)', () => {
  it('renders the main risk card with title', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('ARF System Risk', {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it('displays a risk score percentage', async () => {
    render(<Dashboard />);
    await screen.findByText('ARF System Risk', {}, { timeout: 5000 });
    // Find the large percentage (unique by class)
    const largePercentage = await screen.findByText((content, element) => {
      return element?.tagName === 'DIV' && 
             element.classList.contains('text-3xl') && 
             /\d+\s*%/.test(content);
    });
    expect(largePercentage).toBeInTheDocument();
  });

  it('shows the simulated disclaimer banner', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/simulated demo/i, {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it('displays the risk status badge', async () => {
    render(<Dashboard />);
    expect(await screen.findByText(/SAFE|WARNING|CRITICAL/, {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it('shows the risk factor breakdown section', async () => {
    render(<Dashboard />);
    await screen.findByText('ARF System Risk', {}, { timeout: 5000 });
    expect(await screen.findByText(/Risk Factor Breakdown/i)).toBeInTheDocument();
    expect(await screen.findByText(/Conjugate prior/i)).toBeInTheDocument();
    expect(await screen.findByText(/HMC prediction/i)).toBeInTheDocument();
    expect(await screen.findByText(/Hyperprior shrinkage/i)).toBeInTheDocument();
  });

  it('displays the semantic memory stats', async () => {
    render(<Dashboard />);
    await screen.findByText('ARF System Risk', {}, { timeout: 5000 });
    expect(await screen.findByText(/Semantic Memory \(Simulated\)/i)).toBeInTheDocument();
    expect(await screen.findByText(/Similar Incidents/i)).toBeInTheDocument();
    expect(await screen.findByText(/RAG Similarity/i)).toBeInTheDocument();
    expect(await screen.findByText(/Cache Hits/i)).toBeInTheDocument();
  });

  it('shows recent incidents (at least one service name)', async () => {
    render(<Dashboard />);
    await screen.findByText('ARF System Risk', {}, { timeout: 5000 });
    const services = await screen.findAllByText(/payment-api|auth-service|database/);
    expect(services.length).toBeGreaterThan(0);
  });

  it('displays action badges (at least one APPROVE, DENY, ESCALATE)', async () => {
    render(<Dashboard />);
    await screen.findByText('ARF System Risk', {}, { timeout: 5000 });
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
    await screen.findByText('ARF System Risk', {}, { timeout: 5000 });
    const refreshButton = await screen.findByLabelText('Refresh data');
    expect(refreshButton).toBeEnabled();
    await user.click(refreshButton);
    // Use the same specific matcher for the large percentage
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.tagName === 'DIV' && 
               element.classList.contains('text-3xl') && 
               /\d+\s*%/.test(content);
      })).toBeInTheDocument();
    }, { timeout: 2000 });
    expect(refreshButton).toBeEnabled();
  });

  it('displays the call to action for pilot access (at least one link)', async () => {
    render(<Dashboard />);
    await screen.findByText('ARF System Risk', {}, { timeout: 5000 });
    expect(await screen.findByText(/Ready to govern your AI agents\?/i)).toBeInTheDocument();
    const pilotLinks = await screen.findAllByRole('link', { name: /Request Pilot Access/i });
    expect(pilotLinks.length).toBeGreaterThan(0);
    const signupLink = pilotLinks.find(link => link.getAttribute('href') === '/signup');
    expect(signupLink).toBeTruthy();
  });

  it('does not show HTTP warning (mocked to HTTPS)', async () => {
    render(<Dashboard />);
    await screen.findByText('ARF System Risk', {}, { timeout: 5000 });
    const httpWarning = screen.queryByText(/Security warning: You are viewing this page over HTTP/i);
    expect(httpWarning).not.toBeInTheDocument();
  });
});
