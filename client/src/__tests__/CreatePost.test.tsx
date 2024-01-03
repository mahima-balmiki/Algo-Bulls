import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import the jest-dom library
import CreatePost from '../components/CreatePost';
import axios from 'axios';

// Mock the axios.post function
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

test('renders CreatePost component', () => {
  render(<CreatePost />);
  const postElements = screen.getAllByText(/Create Post/i);

  // Assert that there is at least one element with the specified text
  expect(postElements.length).toBeGreaterThan(0);

  expect(postElements[0]).toBeInTheDocument();
});

