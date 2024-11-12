import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../components/Register';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Register', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form with all required fields', () => {
    render(<Register />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Vanderbilt Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('displays error if email does not end with @vanderbilt.edu', () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Vanderbilt Email'), { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByText('Register'));

    expect(screen.getByText('Email must end with @vanderbilt.edu')).toBeInTheDocument();
  });

  test('displays error if password is less than six characters', () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '12345' } });
    fireEvent.click(screen.getByText('Register'));

    expect(screen.getByText('Password must be at least six characters')).toBeInTheDocument();
  });

  test('displays error if password lacks a letter or a number', () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'abcdef' } });
    fireEvent.click(screen.getByText('Register'));

    expect(screen.getByText('Password must have at least one letter and one number')).toBeInTheDocument();
  });

  test('calls fetch and redirects to main page on successful registration', async () => {
    render(<Register />);
    
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByPlaceholderText('Vanderbilt Email'), { target: { value: 'johndoe@vanderbilt.edu' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password1' } });

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/register', expect.any(Object)));
    expect(mockPush).toHaveBeenCalledWith('/mainPage');
  });

  test('displays specific error if username or email is already in use', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Username or email already exists' }),
    });

    render(<Register />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'existinguser' } });
    fireEvent.change(screen.getByPlaceholderText('Vanderbilt Email'), { target: { value: 'existinguser@vanderbilt.edu' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password1' } });

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => expect(screen.getByText('The username or email you entered is already in use.')).toBeInTheDocument());
  });

  test('shows general error message on network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Register />);
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument());
  });
});
