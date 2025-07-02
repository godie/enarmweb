import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import Auth from '../modules/Auth';
import UserService from '../services/UserService';

// Mock Auth module
jest.mock('../modules/Auth');
// Mock UserService
jest.mock('../services/UserService');

describe('Profile Component', () => {
  const mockFbUser = { facebook_id: 'fb123', name: 'Facebook User', email: 'fb@example.com' };
  const mockRegularUser = { facebook_id: 'user456', name: 'Regular User', email: 'user@example.com' };
  const mockAchievements = [
    { id: 'ach1', name: 'First Step', description: 'Completed tutorial', unlocked_at: '2023-01-01T12:00:00Z' },
    { id: 'ach2', name: 'Explorer', description: 'Visited 10 pages', unlocked_at: null },
  ];

  let getItemSpy;

  beforeEach(() => {
    // Reset mocks for Auth and UserService
    Auth.isFacebookUser.mockReset();
    Auth.getFacebookUser.mockReset();
    Auth.isUserAuthenticated.mockReset();
    UserService.getAchievements.mockReset();

    // Spy on localStorage.getItem and provide a mock implementation
    // This allows us to control what localStorage.getItem returns for each test
    // and restore it later if necessary.
    getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
  });

  afterEach(() => {
    // Restore the original localStorage.getItem behavior after each test
    if (getItemSpy) {
        getItemSpy.mockRestore();
    }
  });

  test('renders loading state initially', () => {
    Auth.isFacebookUser.mockReturnValue(true);
    Auth.getFacebookUser.mockReturnValue(JSON.stringify(mockFbUser)); // fbUser has id
    UserService.getAchievements.mockReturnValue(new Promise(() => {})); // Promise that never resolves

    render(<Profile />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error message if Facebook user data is missing/null', async () => {
    Auth.isFacebookUser.mockReturnValue(true);
    Auth.getFacebookUser.mockReturnValue(null); // Simulate null/undefined user from Auth
    // No need to mock getItemSpy for this test if Auth.getFacebookUser is the primary source for FB users

    render(<Profile />);
    
    await waitFor(() => {
      // Profile.js sets this error when user data cannot be properly obtained/parsed
      expect(screen.getByText('Error loading user data.')).toBeInTheDocument();
    });
  });

  test('renders error message if regular user data parsing fails from localStorage', async () => {
    Auth.isFacebookUser.mockReturnValue(false); // Not a facebook user
    Auth.isUserAuthenticated.mockReturnValue(true); // Is a regular authenticated user
    getItemSpy.mockReturnValue("invalid json string"); // localStorage returns malformed JSON

    render(<Profile />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading user data.')).toBeInTheDocument();
    });
  });


  test('renders error message if fetching achievements fails', async () => {
    Auth.isFacebookUser.mockReturnValue(true);
    Auth.getFacebookUser.mockReturnValue(JSON.stringify({"facebook_id": "fb_123", "name": "testing", "email": 'mail@test.com'})); // fbUser has id
    UserService.getAchievements.mockRejectedValue(new Error('Failed to fetch achievements'));

    render(<Profile />);
    await waitFor(() => {
      expect(screen.getByText('Error fetching achievements.')).toBeInTheDocument();
    });
  });

  test('displays Facebook user information and achievements correctly', async () => {
    Auth.isFacebookUser.mockReturnValue(true);
    Auth.getFacebookUser.mockReturnValue(JSON.stringify(mockFbUser));
    Auth.isUserAuthenticated.mockReturnValue(false); // Not a regular user
    UserService.getAchievements.mockResolvedValue({ data: mockAchievements });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(mockFbUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockFbUser.email)).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(mockAchievements.length);

      // Check content of the first achievement item
      expect(listItems[0]).toHaveTextContent(mockAchievements[0].name);
      expect(listItems[0]).toHaveTextContent(mockAchievements[0].description);
      expect(listItems[0].querySelector('.badge[data-badge-caption="Unlocked"]')).toBeInTheDocument();
      
      // Check content of the second achievement item
      expect(listItems[1]).toHaveTextContent(mockAchievements[1].name);
      expect(listItems[1]).toHaveTextContent(mockAchievements[1].description);
      expect(listItems[1].querySelector('.badge[data-badge-caption="Unlocked"]')).not.toBeInTheDocument(); // Second one is not unlocked
    });
  });

  test('displays regular user information and achievements correctly', async () => {
    Auth.isFacebookUser.mockReturnValue(false); // Not FB user
    Auth.isUserAuthenticated.mockReturnValue(true); // Is regular user
    getItemSpy.mockReturnValue(JSON.stringify(mockRegularUser)); // localStorage returns valid regular user
    UserService.getAchievements.mockResolvedValue({ data: mockAchievements });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(mockRegularUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockRegularUser.email)).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(mockAchievements.length);
      expect(listItems[0]).toHaveTextContent(mockAchievements[0].name);
      expect(listItems[0]).toHaveTextContent(mockAchievements[0].description);
    });
  });

  test('displays "No achievements yet." when no achievements are found', async () => {
    Auth.isFacebookUser.mockReturnValue(true);
    Auth.getFacebookUser.mockReturnValue(JSON.stringify(mockFbUser));
    UserService.getAchievements.mockResolvedValue({ data: [] }); // No achievements

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('No achievements yet.')).toBeInTheDocument();
    });
  });
  
  test('handles case where user (either type) has no ID for fetching achievements', async () => {
    Auth.isFacebookUser.mockReturnValue(true);
    Auth.getFacebookUser.mockReturnValue(JSON.stringify({  facebook_id: "", name: "Test User No ID", email: "test@example.com" })); // User with no ID

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Test User No ID/i)).toBeInTheDocument();
      // UserService.getAchievements should not be called if user.id is missing
      expect(UserService.getAchievements).not.toHaveBeenCalled();
      expect(screen.getByText('No achievements yet.')).toBeInTheDocument(); 
    });
  });

});
