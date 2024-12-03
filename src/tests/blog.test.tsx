import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import Blog from '../components/Blog'
import CreateBlogPost from '../components/CreateBlogPost'
import BlogPost from '../components/BlogPost'
import useSiteStore from '../store/siteStore'

// Mock the store
jest.mock('../store/siteStore')

const mockPost = {
  title: 'Test Post',
  content: 'Test Content',
  slug: 'test-post',
  date: new Date().toISOString(),
  thumbnailImage: 'test-thumb.jpg',
  headerImage: 'test-header.jpg',
  tags: 'test, blog',
  byline: 'Test Author'
}

const mockToken = 'test-token'

describe('Blog Feature Tests', () => {
  beforeEach(() => {
    // Reset fetch mocks
    globalThis.fetch = jest.fn()

    // Mock store implementation
    ;(useSiteStore as unknown as jest.Mock).mockImplementation(() => ({
      token: mockToken,
      posts: [mockPost],
      fetchPosts: jest.fn().mockResolvedValue([mockPost]),
      setPosts: jest.fn(),
      images: ['test-image.jpg'],
      fetchImageFilenames: jest.fn()
    }))
  })

  describe('Create Blog Post', () => {
    test('should create new blog post', async () => {
      globalThis.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          status: 201,
          json: () => Promise.resolve({ success: true })
        })
      )

      render(
        <BrowserRouter>
          <CreateBlogPost />
        </BrowserRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('Title'), {
        target: { value: mockPost.title }
      })
      fireEvent.change(screen.getByPlaceholderText('Content'), {
        target: { value: mockPost.content }
      })
      fireEvent.change(screen.getByPlaceholderText('Tags'), {
        target: { value: mockPost.tags }
      })

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /create/i }))
      })

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/blog/posts', {
        method: 'POST',
        headers: {
          accepts: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${mockToken}`
        },
        body: JSON.stringify(mockPost)
      })
    })

    test('should handle future scheduled posts', async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)

      render(
        <BrowserRouter>
          <CreateBlogPost />
        </BrowserRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('Title'), {
        target: { value: 'Future Post' }
      })
      fireEvent.change(screen.getByRole('datetime-local'), {
        target: { value: futureDate.toISOString().slice(0, 16) }
      })

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /create/i }))
      })

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(futureDate.toISOString())
        })
      )
    })
  })

  describe('Edit Blog Post', () => {
    test('should load and edit existing post', async () => {
      const updatedTitle = 'Updated Title'

      render(
        <BrowserRouter>
          <CreateBlogPost editMode={true} />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByDisplayValue(mockPost.title)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('Title'), {
        target: { value: updatedTitle }
      })

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /update/i }))
      })

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `/api/blog/posts/${mockPost.slug}`,
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining(updatedTitle)
        })
      )
    })
  })

  describe('Delete and Undelete', () => {
    test('should delete and undelete post', async () => {
      window.confirm = jest.fn(() => true)

      render(
        <BrowserRouter>
          <BlogPost />
        </BrowserRouter>
      )

      // Test Delete
      await waitFor(() => {
        expect(screen.getByText(mockPost.title)).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /delete/i }))

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `/api/blog/posts/${mockPost.slug}`,
        expect.objectContaining({
          method: 'DELETE'
        })
      )

      // Test Undelete
      const deletedPost = { ...mockPost, deleted: 1 }
      ;(useSiteStore as unknown as jest.Mock).mockImplementation(() => ({
        ...useSiteStore(),
        posts: [deletedPost]
      }))

      render(
        <BrowserRouter>
          <BlogPost />
        </BrowserRouter>
      )

      fireEvent.click(screen.getByRole('button', { name: /undelete/i }))

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `/api/blog/posts/${mockPost.slug}`,
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"deleted":0')
        })
      )
    })
  })

  describe('Blog List View', () => {
    test('should display posts correctly', async () => {
      render(
        <BrowserRouter>
          <Blog />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText(mockPost.title)).toBeInTheDocument()
        expect(screen.getByText(mockPost.byline)).toBeInTheDocument()
      })
    })

    test('should not show future posts when not logged in', async () => {
      const futurePost = {
        ...mockPost,
        title: 'Future Post',
        date: new Date(Date.now() + 86400000).toISOString()
      }

      ;(useSiteStore as unknown as jest.Mock).mockImplementation(() => ({
        ...useSiteStore(),
        token: '',
        posts: [mockPost, futurePost]
      }))

      render(
        <BrowserRouter>
          <Blog />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.queryByText('Future Post')).not.toBeInTheDocument()
        expect(screen.getByText(mockPost.title)).toBeInTheDocument()
      })
    })
  })
})