import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import History from '@/app/history/page'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock next environment
process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'

// Mock recharts to avoid canvas/SVG rendering issues in tests
jest.mock('recharts', () => {
  type RechartProps = { children?: React.ReactNode; data?: unknown }

  return {
    ResponsiveContainer: ({ children }: RechartProps) => <div>{children}</div>,
    LineChart: ({ data }: RechartProps) => <div data-testid="line-chart">{JSON.stringify(data)}</div>,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
  }
})

describe('History Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementationOnce(
      () => new Promise(() => {})
    )

    render(<History />)

    expect(screen.getByText('Risk History (Last 24h)')).toBeInTheDocument()
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders history data on successful fetch', async () => {
    const mockData = [
      { time: '00:00', risk: 0.2 },
      { time: '06:00', risk: 0.35 },
      { time: '12:00', risk: 0.5 },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })

    const chart = screen.getByTestId('line-chart')
    expect(chart.textContent).toContain('00:00')
  })

  it('displays last updated timestamp', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { time: '12:00', risk: 0.5 },
      ],
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByText(/last updated/i)).toBeInTheDocument()
    })
  })

  it('handles empty history array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByText(/no history data available/i)).toBeInTheDocument()
    })
  })

  it('handles network timeout error', async () => {
    mockFetch.mockImplementationOnce(() => {
      const error = new DOMException('Aborted', 'AbortError')
      return Promise.reject(error)
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/request timed out/i)).toBeInTheDocument()
  })

  it('handles 401 unauthorized error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument()
  })

  it('handles 404 not found error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/endpoint not found/i)).toBeInTheDocument()
  })

  it('handles 500 server error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/server error/i)).toBeInTheDocument()
  })

  it('handles invalid schema response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { time: '12:00', risk: 'invalid' },
      ],
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/unable to parse history data/i)).toBeInTheDocument()
  })

  it('handles risk values outside valid bounds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { time: '12:00', risk: 1.5 },
      ],
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/unable to parse history data/i)).toBeInTheDocument()
  })

  it('renders retry button on error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  it('retries fetch when retry button is clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { time: '12:00', risk: 0.5 },
        ],
      })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })

  it('validates individual items in the array have correct schema', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { time: '12:00', risk: 0.5 },
        { time: '13:00' },
      ],
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/unable to parse history data/i)).toBeInTheDocument()
  })

  it('validates risk values are between 0 and 1', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { time: '12:00', risk: -0.1 },
      ],
    })

    render(<History />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/unable to parse history data/i)).toBeInTheDocument()
  })
})
