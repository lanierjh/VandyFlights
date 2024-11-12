import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainPage from './MainPage';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('MainPage', () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    axios.post.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the search form with default values', () => {
    render(<MainPage />);
    
    const originInput = screen.getByDisplayValue('BNA');
    const destinationInput = screen.getByPlaceholderText('Destination');
    const departureDateInput = screen.getByLabelText('Departure Date');
    const roundTripSelect = screen.getByDisplayValue('Round-trip');

    expect(originInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
    expect(departureDateInput).toBeInTheDocument();
    expect(roundTripSelect).toBeInTheDocument();
  });

  test('updates search data on form input change', () => {
    render(<MainPage />);
    
    const destinationInput = screen.getByPlaceholderText('Destination');
    fireEvent.change(destinationInput, { target: { value: 'LAX' } });
    
    expect(destinationInput.value).toBe('LAX');
  });

  test('clears return date when one-way is selected', () => {
    render(<MainPage />);
    
    const roundTripSelect = screen.getByDisplayValue('Round-trip');
    fireEvent.change(roundTripSelect, { target: { value: 'false' } });
    
    const returnDateInput = screen.queryByLabelText('Return Date');
    expect(returnDateInput).toBeNull();
  });

  test('submits form data and navigates to flight results page on valid input', async () => {
    render(<MainPage />);
    
    const destinationInput = screen.getByPlaceholderText('Destination');
    fireEvent.change(destinationInput, { target: { value: 'LAX' } });
    
    const departureDateInput = screen.getByLabelText('Departure Date');
    fireEvent.change(departureDateInput, { target: { value: '2024-12-12' } });
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(mockPush).toHaveBeenCalledWith('/flightResults');
  });

  test('shows alert on missing destination or departure date', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<MainPage />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(window.alert).toHaveBeenCalledWith('Please provide a valid destination and departure date.');
  });
});
