import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task manager app', () => {
  render(<App />);
  const titleElement = screen.getByText(/task manager/i);
  expect(titleElement).toBeInTheDocument();
});
