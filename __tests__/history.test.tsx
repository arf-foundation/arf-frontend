import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import History from '@/app/history/page';

// Mock recharts to avoid SVG rendering issues
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

describe('History Page (Simulated Demo)', () => {
  it('renders the page title and description', async () => {
    render(<History />);
    expect(await screen.findByText('Risk History')).toBeInTheDocument();
    expect(await screen.findByText(/simulated risk score evolution/i)).toBeInTheDocument();
  });

  it('displays the simulated disclaimer banner', async () => {
    render(<History />);
    const disclaimer = await screen.findByText(/simulated demo/i);
    expect(disclaimer).toBeInTheDocument();
  });

  it('renders the line chart', async () => {
    render(<History />);
    expect(await screen.findByTestId('line-chart')).toBeInTheDocument();
  });

  it('shows the recent decisions table with expected columns', async () => {
    render(<History />);
    expect(await screen.findByText('Recent Decisions (Simulated)')).toBeInTheDocument();
    expect(await screen.findByText('Time')).toBeInTheDocument();
    expect(await screen.findByText('Service')).toBeInTheDocument();
    expect(await screen.findByText('Risk Score')).toBeInTheDocument();
    expect(await screen.findByText('Action')).toBeInTheDocument();
  });

  it('displays sample decision entries', async () => {
    render(<History />);
    expect(await screen.findByText('payment-api')).toBeInTheDocument();
    expect(await screen.findByText('auth-service')).toBeInTheDocument();
    expect(await screen.findByText('database')).toBeInTheDocument();
  });

  it('shows action badges (APPROVE, DENY, ESCALATE)', async () => {
    render(<History />);
    expect(await screen.findByText('APPROVE')).toBeInTheDocument();
    expect(await screen.findByText('DENY')).toBeInTheDocument();
    expect(await screen.findByText('ESCALATE')).toBeInTheDocument();
  });

  it('has a refresh button that updates the chart (simulated)', async () => {
    const user = userEvent.setup();
    render(<History />);
    const refreshButton = await screen.findByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeEnabled();
    // Click the refresh button – the chart should still be present (no error)
    await user.click(refreshButton);
    // After clicking, the chart should still be there (maybe loading briefly)
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('displays last updated timestamp after initial load', async () => {
    render(<History />);
    const lastUpdated = await screen.findByText(/last updated/i);
    expect(lastUpdated).toBeInTheDocument();
  });

  it('shows the call to action for pilot access', async () => {
    render(<History />);
    expect(await screen.findByText(/Get real‑time risk history/i)).toBeInTheDocument();
    const ctaLink = screen.getByRole('link', { name: /Request Pilot Access/i });
    expect(ctaLink).toHaveAttribute('href', '/signup');
  });
});
