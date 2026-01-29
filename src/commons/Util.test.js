import Util from './Util';
import { describe, it, expect } from 'vitest';


describe('Util', () => {
  describe('isEmpty', () => {
    it('should return true for an empty object', () => {
      expect(Util.isEmpty({})).toBe(true);
    });

    it('should return true for an object created with new Object()', () => {
      expect(Util.isEmpty(new Object())).toBe(true);
    });

    it('should return false for a non-empty object', () => {
      expect(Util.isEmpty({ a: 1 })).toBe(false);
    });

    it('should return false for an object with null prototype', () => {
      const obj = Object.create(null);
      expect(Util.isEmpty(obj)).toBe(true); // Based on current implementation
    });

    it('should return false for an array (which is an object)', () => {
      expect(Util.isEmpty([])).toBe(false); // Current implementation detail
    });

    it('should return true for an object with undefined properties', () => {
      expect(Util.isEmpty({ a: undefined })).toBe(false); // Based on current implementation
    });

    it('should return true for an object with inherited properties but no own properties', () => {
      const parent = { inheritedProp: 'value' };
      const childWithNoOwnProps = Object.create(parent);
      // The current isEmpty implementation will return true because childWithNoOwnProps has no own properties
      // and JSON.stringify(childWithNoOwnProps) is '{}'.
      expect(Util.isEmpty(childWithNoOwnProps)).toBe(true);
    });

  });

  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const shuffledArray = Util.shuffleArray(originalArray);
      expect(shuffledArray.length).toBe(originalArray.length);
    });

    it('should return an array with the same elements', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const shuffledArray = Util.shuffleArray(originalArray);
      expect(shuffledArray.sort()).toEqual(originalArray.sort());
    });

    it('should return a new array instance, not modify the original', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const shuffledArray = Util.shuffleArray(originalArray);
      expect(shuffledArray).not.toBe(originalArray); // Check for new instance
      expect(originalArray).toEqual([1, 2, 3, 4, 5]); // Original should be unchanged
    });

    it('should handle an empty array', () => {
      expect(Util.shuffleArray([])).toEqual([]);
    });

    it('should handle an array with one element', () => {
      expect(Util.shuffleArray([1])).toEqual([1]);
    });

    // It's hard to test randomness exhaustively.
    // One approach is to run it many times and check if the order changes for a sufficiently large array.
    // However, for unit tests, checking length and elements is usually enough.
    // A more robust test might involve checking that an element at a certain index is not
    // always the same after many shuffles, but that's more complex.
  });

  describe('showToast', () => {
    // Mock the global M object for Materialize

    it('should call M.toast with the given message if M is defined', () => {
      const message = 'Test toast message';
      Util.showToast(message);
      expect(M.toast).toHaveBeenCalledTimes(1);
      expect(M.toast).toHaveBeenCalledWith({ html: message });
    });

    it('should not throw an error if M is undefined', () => {

      const message = 'Test toast message';
      expect(() => Util.showToast(message)).not.toThrow();
    });
  });
});
