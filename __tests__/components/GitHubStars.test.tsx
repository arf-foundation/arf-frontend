import { render, screen, waitFor } from '@testing-library/react'
import GitHubStars from '@/components/GitHubStars'

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ stargazers_count: 1234 }),
  })
) as jest.Mock

describe('GitHubStars', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('renders nothing initially, then displays stars after fetch', async () => {
    render(<GitHubStars />)
    expect(screen.queryByText('1,234')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('1,234')).toBeInTheDocument()
    })
  })

  it('uses cached stars if available', async () => {
    localStorage.setItem('github-stars', '5678')
    localStorage.setItem('github-stars-time', Date.now().toString())

    render(<GitHubStars />)
    await waitFor(() => {
      expect(screen.getByText('5,678')).toBeInTheDocument()
    })
    expect(fetch).not.toHaveBeenCalled()
  })
})
