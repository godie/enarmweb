import Swal from 'sweetalert2/dist/sweetalert2.js';
import { alertSuccess, alertError } from '../AlertService';

jest.mock('sweetalert2/dist/sweetalert2.js', () => ({
  fire: jest.fn(),
}));

describe('AlertService', () => {
  beforeEach(() => {
    // Clear any previous calls to Swal.fire
    Swal.fire.mockClear();
  });

  describe('alertSuccess', () => {
    it('should call Swal.fire with success type and given title/text', () => {
      const title = 'Success!';
      const text = 'Operation completed successfully.';
      alertSuccess(title, text);
      expect(Swal.fire).toHaveBeenCalledTimes(1);
      expect(Swal.fire).toHaveBeenCalledWith({
        type: 'success',
        title: title,
        text: text,
      });
    });
  });

  describe('alertError', () => {
    it('should call Swal.fire with error type and given title/text', () => {
      const title = 'Error!';
      const text = 'An error occurred.';
      alertError(title, text);
      expect(Swal.fire).toHaveBeenCalledTimes(1);
      expect(Swal.fire).toHaveBeenCalledWith({
        type: 'error',
        title: title,
        text: text,
      });
    });
  });
});
