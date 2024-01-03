import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import the jest-dom library
import Post, { PostProps } from '../components/Post';
import axios from 'axios';

// Mock the axios.post function to simulate a successful like request
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

const mockPostData: PostProps = {
  id: '1',
  username: 'testuser',
  name: 'Test User',
  title: 'Test Post',
  content: 'This is a test post.',
  likes: [],
  bookmarks: [],
  comments: [['user1', 'Comment 1'], ['user2', 'Comment 2']],
  date: '2024-01-02',
};

test('renders post title', () => {
  render(<Post {...mockPostData} />);

  const postElements = screen.getAllByText(/Test Post/i);

  // Assert that there is at least one element with the specified text
  expect(postElements.length).toBeGreaterThan(0);

  expect(postElements[0]).toBeInTheDocument();
});


test('renders post username', () => {
  render(<Post {...mockPostData} />);
  const usernameElement = screen.getByText(/testuser/i);
  expect(usernameElement).toBeInTheDocument();
});

test('renders post name', () => {
  render(<Post {...mockPostData} />);
  const nameElement = screen.getByText(/Test User/i);
  expect(nameElement).toBeInTheDocument();
});

test('renders post content', () => {
  render(<Post {...mockPostData} />);
  const contentElement = screen.getByText(/This is a test post./i);
  expect(contentElement).toBeInTheDocument();
});
