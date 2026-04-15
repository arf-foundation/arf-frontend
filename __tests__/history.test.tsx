import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import History from '../app/history/page';

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
  it('renders the page title', async () => {
    render(<History />);
    expect(await screen.findByText('Risk History')).toBeInTheDocument();
    expect(await screen.findByText(/simulated risk score evolution/i)).toBeInTheDocument();
  });

  it('displays the simulated disclaimer banner', async () => {
    render(<History />);
    expect(await screen.findByText(/simulated demo/i)).toBeInTheDocument();
  });

  it('renders the line chart', async () => {
    render(<History />);
    expect(await screen.findByTestId('line-chart')).toBeInTheDocument();
  });

  it('shows the recent decisions table', async () => {
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

  it('shows action badges', async () => {
    render(<History />);
    expect(await screen.findByText('APPROVE')).toBeInTheDocument();
    expect(await screen.findByText('DENY')).toBeInTheDocument();
    expect(await screen.findByText('ESCALATE')).toBeInTheDocument();
  });

  it('has a refresh button that updates the chart', async () => {
    const user = userEvent.setup();
    render(<History />);
    const refreshButton = await screen.findByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeEnabled();
    await user.click(refreshButton);
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('displays last updated timestamp', async () => {
    render(<History />);
    expect(await screen.findByText(/last updated/i)).toBeInTheDocument();
  });

  it('shows the call to action for pilot access', async () => {
    render(<History />);
    expect(await screen.findByText(/Get real‑time risk history/i)).toBeInTheDocument();
    const ctaLink = await screen.findByRole('link', { name: /Request Pilot Access/i });
    expect(ctaLink).toHaveAttribute('href', '/signup');
  });
});
