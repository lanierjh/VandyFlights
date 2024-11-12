import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FlightResults from '../components/FlightResults';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('FlightResults', () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    axios.post.mockResolvedValue({ data: { flights: [{ flightNumber: 'VX123', price: 200 }] } });
    localStorage.setItem('flightResults', JSON.stringify({ flights: [{ flightNumber: 'VX123', price: 200 }] }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders loading message initially', () => {
    render(<FlightResults />);
    expect(screen.getByText(/Loading... We are pulling up the flight info right now/i)).toBeInTheDocument();
  });

  test('displays flight data from localStorage when available', async () => {
    render(<FlightResults />);

    await waitFor(() => expect(screen.queryByText(/No flight data available/i)).toBeNull());
    expect(screen.getByText('VX123')).toBeInTheDocument();
  });

  test('shows no flight data message when no flights are available', () => {
    localStorage.removeItem('flightResults');
    render(<FlightResults />);
    expect(screen.getByText(/No flight data available. Please go back and search for flights again/i)).toBeInTheDocument();
  });

  test('submits a new search and updates flight data', async () => {
    render(<FlightResults />);

    const destinationInput = screen.getByPlaceholderText('Destination');
    fireEvent.change(destinationInput, { target: { value: 'LAX' } });

    const departureDateInput = screen.getByLabelText('Departure Date');
    fireEvent.change(departureDateInput, { target: { value: '2024-12-12' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(localStorage.getItem('flightResults')).toContain('VX123');
  });

  test('displays alert if search is attempted without required fields', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<FlightResults />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(window.alert).toHaveBeenCalledWith('Please provide a valid destination and departure date.');
  });

  test('allows sorting flights by price', () => {
    render(<FlightResults />);
    const sortSelect = screen.getByLabelText('Sort by:');
    fireEvent.change(sortSelect, { target: { value: 'Cheapest Price' } });
    expect(sortSelect.value).toBe('Cheapest Price');
  });

  test('navigates to return flight results on selecting a round-trip flight', async () => {
    render(<FlightResults />);
    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/returnflightresults'));
  });
});
