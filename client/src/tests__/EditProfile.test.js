import { render, screen, fireEvent } from '@testing-library/react';
import EditProfile from './EditProfile';

describe('EditProfile', () => {
  test('renders profile information with default data', () => {
    render(<EditProfile />);
    expect(screen.getByText('Vikash Singh')).toBeInTheDocument();
    expect(screen.getByText('vikashsingh@gmail.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('LGA')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument();
  });

  test('switches to edit mode when Edit button is clicked', () => {
    render(<EditProfile />);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(screen.getByText('Save')).toBeInTheDocument();
    const firstNameInput = screen.getByLabelText('First Name');
    expect(firstNameInput).not.toHaveAttribute('disabled');
  });

  test('updates form fields in edit mode', () => {
    render(<EditProfile />);
    fireEvent.click(screen.getByText('Edit'));

    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');

    const destinationInput = screen.getByLabelText('Destination');
    fireEvent.change(destinationInput, { target: { value: 'JFK' } });
    expect(destinationInput.value).toBe('JFK');
  });

  test('saves updated data and switches back to view mode', () => {
    render(<EditProfile />);
    fireEvent.click(screen.getByText('Edit'));

    const lastNameInput = screen.getByLabelText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    fireEvent.click(screen.getByText('Save'));

    expect(screen.queryByText('Save')).toBeNull();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(lastNameInput).toHaveAttribute('disabled');
  });

  test('disables form fields when not in edit mode', () => {
    render(<EditProfile />);

    const firstNameInput = screen.getByLabelText('First Name');
    expect(firstNameInput).toHaveAttribute('disabled');

    const destinationInput = screen.getByLabelText('Destination');
    expect(destinationInput).toHaveAttribute('disabled');
  });
});
