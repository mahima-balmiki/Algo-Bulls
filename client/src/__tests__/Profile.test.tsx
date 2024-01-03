import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from '../components/Profile';
import { AuthContext, AuthContextProps } from '../context/AuthContext';

// Manually mock axios
jest.mock('axios');

const mockUser: AuthContextProps = {
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test User',
  profilephoto: undefined,
  isLoggedIn: true,
  login: jest.fn(),
  logout: jest.fn(),
};

const renderWithAuthContext = (component: React.ReactElement) => {
  return render(<AuthContext.Provider value={mockUser}>{component}</AuthContext.Provider>);
};

test('renders profile details', () => {
  renderWithAuthContext(<Profile />);
  
  // Assuming that the user details are displayed initially
  expect(screen.getByText(`Username: @${mockUser.username}`)).toBeInTheDocument();
  expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
  expect(screen.getByText(`Name: ${mockUser.name}`)).toBeInTheDocument();
  expect(screen.getByText('Password: ********')).toBeInTheDocument();
});

