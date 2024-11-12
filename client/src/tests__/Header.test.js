import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
import React from 'react';

describe('Header', () => {
  test('renders the logo and title', () => {
    render(<Header />);
    const logo = screen.getByAltText('VandyFlights Logo');
    const title = screen.getByText('VandyFlights');

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/vanderbilt.png');
    expect(title).toBeInTheDocument();
  });

  test('renders navigation links with correct text and href attributes', () => {
    render(<Header />);
    
    const homeLink = screen.getByText('Home');
    const chatLink = screen.getByText('Chat');
    const profileLink = screen.getByText('Profile');
    const logoutLink = screen.getByText('Log Out');

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/mainPage');
    
    expect(chatLink).toBeInTheDocument();
    expect(chatLink).toHaveAttribute('href', '/chat');
    
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/editProfile');
    
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute('href', '/');
  });

  test('has correct styles applied to the header and navigation links', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveStyle('background-color: #F1D6D9');
    expect(header).toHaveStyle('text-align: center');
    
    const navLinks = screen.getAllByRole('link');
    navLinks.forEach((link) => {
      expect(link).toHaveStyle('font-weight: bold');
      expect(link).toHaveStyle('color: #000');
    });
  });
});
