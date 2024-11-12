import { render, screen, fireEvent } from '@testing-library/react';
import ChatPage from './ChatPage';

describe('ChatPage', () => {
  test('renders friends list by default', () => {
    render(<ChatPage />);
    expect(screen.getByText('Friends')).toBeInTheDocument();
    expect(screen.getByText('James Huang')).toBeInTheDocument();
  });

  test('switches to search friends tab and displays search input', () => {
    render(<ChatPage />);
    const searchTab = screen.getByText('Search Friends');
    fireEvent.click(searchTab);
    expect(screen.getByPlaceholderText('Search for friends')).toBeInTheDocument();
  });

  test('filters search results based on query', () => {
    render(<ChatPage />);
    const searchTab = screen.getByText('Search Friends');
    fireEvent.click(searchTab);

    const searchInput = screen.getByPlaceholderText('Search for friends');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    expect(screen.getByText('Jane Sun')).toBeInTheDocument();
    expect(screen.queryByText('Abdallah Safa')).toBeNull();
  });

  test('adds a friend from search results to friends list', () => {
    render(<ChatPage />);
    const searchTab = screen.getByText('Search Friends');
    fireEvent.click(searchTab);

    const searchInput = screen.getByPlaceholderText('Search for friends');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    fireEvent.click(screen.getByText('Friends'));
    expect(screen.getByText('Jane Sun')).toBeInTheDocument();
  });

  test('displays chat with selected friend', () => {
    render(<ChatPage />);
    fireEvent.click(screen.getByText('James Huang'));
    expect(screen.getByText('Hi!')).toBeInTheDocument();
    expect(screen.getByText(/Are you excited about the trip to/i)).toBeInTheDocument();
  });

  test('displays message indicating no friend is selected by default in chat window', () => {
    render(<ChatPage />);
    expect(screen.getByText('Select a friend to chat with')).toBeInTheDocument();
  });

  test('shows "No users found" message when search yields no results', () => {
    render(<ChatPage />);
    const searchTab = screen.getByText('Search Friends');
    fireEvent.click(searchTab);

    const searchInput = screen.getByPlaceholderText('Search for friends');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent User' } });

    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });
});
