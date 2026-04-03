import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import History from '@/app/history/page'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock recharts to avoid SVG rendering issues
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

describe('History Page', () => {
  const mockHistoryData = [
    {
      decision_id: '1',
      timestamp: '2026-04-02T23:10:40.440085+00:00',
      risk_score: 0.09,
      outcome: null,
    },
    {
      decision_id: '2',
      timestamp: '2026-04-02T22:10:40.440085+00:00',
      risk_score: 0.45,
      outcome: null,
    },
  ]

  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders history data on successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHistoryData,
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })

  it('displays last updated timestamp', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHistoryData,
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByText(/last updated/i)).toBeInTheDocument()
    })
  })

  it('shows error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<History />)

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })

  it('retries fetch when retry button is clicked', async () => {
    // First fail, then succeed
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistoryData,
      })

    render(<History />)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })
})
