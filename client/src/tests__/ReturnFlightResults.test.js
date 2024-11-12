import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReturnFlightResults from './ReturnFlightResults';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ReturnFlightResults', () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    localStorage.setItem('selectedOutboundFlight', JSON.stringify({ destination: 'LAX' }));
    localStorage.setItem('flightResults', JSON.stringify({ return_flights: [{ flightNumber: 'RT123', price: 300 }] }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders loading message initially', () => {
    render(<ReturnFlightResults />);
    expect(screen.getByText(/Loading... We are pulling up the return flight info right now/i)).toBeInTheDocument();
  });

  test('displays return flight data from localStorage when available', async () => {
    render(<ReturnFlightResults />);
    await waitFor(() => expect(screen.queryByText(/No return flight data available/i)).toBeNull());
    expect(screen.getByText('RT123')).toBeInTheDocument();
  });

  test('shows no flight data message when no return flights are available', () => {
    localStorage.removeItem('flightResults');
    render(<ReturnFlightResults />);
    expect(screen.getByText(/No return flight data available. Please go back and search for flights again/i)).toBeInTheDocument();
  });

  test('allows sorting return flights by price', () => {
    render(<ReturnFlightResults />);
    const sortSelect = screen.getByLabelText('Sort by:');
    fireEvent.change(sortSelect, { target: { value: 'Cheapest Price' } });
    expect(sortSelect.value).toBe('Cheapest Price');
  });

  test('opens new window on selecting a flight', async () => {
    global.open = jest.fn();
    render(<ReturnFlightResults />);
    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);
    expect(global.open).toHaveBeenCalled();
  });
});
