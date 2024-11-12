import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../components/Register';
import React from 'react';
import { useRouter } from 'next/navigation';

// Mock useRouter with a full mocked function
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Register Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        // Ensure useRouter returns a mocked object with push
        useRouter.mockReturnValue({ push: mockPush });
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clears all mocks between tests
    });

    it('renders the Register form with all fields and button', () => {
        render(<Register />);

        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Vanderbilt Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('shows error if email does not end with @vanderbilt.edu', async () => {
        render(<Register />);

        fireEvent.change(screen.getByPlaceholderText('Vanderbilt Email'), { target: { value: 'test@gmail.com' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Email must end with @vanderbilt.edu'));
    });

    it('shows error if password does not contain both letters and numbers', async () => {
        render(<Register />);

        fireEvent.change(screen.getByPlaceholderText('Vanderbilt Email'), { target: { value: 'test@vanderbilt.edu' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'abcdef' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Password must have at least one letter and one number'));
    });

    it('submits form successfully with valid data', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ access_token: 'mockToken' }),
            })
        );

        render(<Register />);

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
        fireEvent.change(screen.getByPlaceholderText('Vanderbilt Email'), { target: { value: 'test@vanderbilt.edu' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/register', expect.any(Object)));
        expect(localStorage.getItem('accessToken')).toBe('mockToken');
    });

    it('shows error if username or email is already in use', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ detail: 'Username or email already exists' }),
            })
        );

        render(<Register />);

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
        fireEvent.change(screen.getByPlaceholderText('Vanderbilt Email'), { target: { value: 'test@vanderbilt.edu' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('The username or email you entered is already in use.'));
    });
});
