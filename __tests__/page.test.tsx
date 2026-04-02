import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Home from '@/app/page'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock next environment
process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'

describe('Home Page (Risk Dashboard)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementationOnce(
      () => new Promise(() => {})
    )

    render(<Home />)

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('renders risk data on successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        system_risk: 0.35,
        status: 'warning',
      }),
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('ARF System Risk')).toBeInTheDocument()
    })

    expect(screen.getByText('35%')).toBeInTheDocument()
    expect(screen.getByText('WARNING')).toBeInTheDocument()
  })

  it('renders critical status with red badge', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        system_risk: 0.85,
        status: 'critical',
      }),
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('CRITICAL')).toBeInTheDocument()
    })

    const badge = screen.getByText('CRITICAL')
    expect(badge).toHaveClass('bg-red-600')
  })

  it('renders safe status with green badge', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        system_risk: 0.15,
        status: 'safe',
      }),
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('SAFE')).toBeInTheDocument()
    })

    const badge = screen.getByText('SAFE')
    expect(badge).toHaveClass('bg-green-500')
  })

  it('handles network timeout error', async () => {
    mockFetch.mockImplementationOnce(() => {
      const error = new DOMException('Aborted', 'AbortError')
      return Promise.reject(error)
    })

    render(<Home />)

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

    render(<Home />)

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

    render(<Home />)

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

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/server error/i)).toBeInTheDocument()
  })

  it('handles malformed JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON')
      },
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/invalid json/i)).toBeInTheDocument()
  })

  it('handles invalid schema response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        system_risk: 'not a number',
        status: 123,
      }),
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/unable to parse risk data/i)).toBeInTheDocument()
  })

  it('handles risk values outside valid bounds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        system_risk: 1.5,
        status: 'warning',
      }),
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/unable to parse risk data/i)).toBeInTheDocument()
  })

  it('renders retry button on error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<Home />)

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
        json: async () => ({
          system_risk: 0.35,
          status: 'warning',
        }),
      })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/server error/i)).toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText('35%')).toBeInTheDocument()
    })

    expect(screen.getByText('WARNING')).toBeInTheDocument()
  })

  it('displays last updated timestamp', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        system_risk: 0.35,
        status: 'warning',
      }),
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText(/last updated/i)).toBeInTheDocument()
    })
  })

  it('renders progress bar with correct width for risk score', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        system_risk: 0.75,
        status: 'warning',
      }),
    })

    render(<Home />)

    await waitFor(() => {
      const progressBarContainer = document.querySelector('.bg-gray-200.rounded.h-2')
      expect(progressBarContainer).toBeInTheDocument()

      const progressBar = progressBarContainer?.querySelector('div')
      expect(progressBar).toHaveStyle({ width: '75%' })
    })
  })

  it('renders "no data" message when risk is null', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
