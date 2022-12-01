import * as Utils from './ChangePin.utils';

describe('ChangePin.utils', () => {
  describe('saveValueInKeychain', () => {
    it('should check value is saved in the keychain', async () => {
      // Mocked function to saveValueInKeychain
      jest.spyOn(Utils, 'saveValueInKeychain');

      await Utils.saveValueInKeychain(
        'email',
        'kevin@gmail.com',
        'email description',
      );

      expect(Utils.saveValueInKeychain).toHaveBeenCalledWith(
        'email',
        'kevin@gmail.com',
        'email description',
      );
    });
  });
});
