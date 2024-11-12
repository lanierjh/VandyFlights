import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    window.localStorage.setItem = jest.fn();
    jest.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: 'mock_token' }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with username and password fields', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Username or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('updates form fields on input change', () => {
    render(<Login />);
    
    const usernameInput = screen.getByPlaceholderText('Username or Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });

  test('displays error message on failed login', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ detail: 'Invalid login credentials' }),
    });

    render(<Login />);
    
    const usernameInput = screen.getByPlaceholderText('Username or Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(usernameInput, { target: { value: 'invaliduser' } });
    fireEvent.change(passwordInput, { target: { value: 'invalidpassword' } });

    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
    });
  });

  test('stores token in localStorage and redirects on successful login', async () => {
    render(<Login />);

    const usernameInput = screen.getByPlaceholderText('Username or Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(usernameInput, { target: { value: 'validuser' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'mock_token'));
    expect(window.location.href).toContain('/mainPage');
  });

  test('shows general error message on network error', async () => {
    window.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Login />);

    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});
