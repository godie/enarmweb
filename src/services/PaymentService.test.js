import { describe, it, expect, vi } from 'vitest';
import PaymentService from './PaymentService';
import axios from 'axios';
import Auth from '../modules/Auth';

vi.mock('axios');
vi.mock('../modules/Auth');

describe('PaymentService', () => {
  it('calls createCheckoutSession with correct params', async () => {
    Auth.getToken.mockReturnValue('test-token');
    axios.post.mockResolvedValue({ data: { url: 'https://stripe.com' } });

    const params = { planId: 'premium' };
    const response = await PaymentService.createCheckoutSession(params);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('payments/create-checkout-session'),
      params,
      expect.objectContaining({
        headers: { Authorization: 'bearer test-token' }
      })
    );
    expect(response.data.url).toBe('https://stripe.com');
  });
});
