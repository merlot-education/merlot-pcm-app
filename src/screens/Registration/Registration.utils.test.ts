import * as Utils from './Registration.utils';

describe('Registration.utils', () => {
  describe('getMnemonicFromWords', () => {
    it.each([
      [0, 0],
      [5, 5],
      [3, 3],
      [8, 8],
    ])(
      'should return string values from list of words with provided length of Words',
      (initialValues, finalLength) => {
        const result = Utils.getMnemonicArrayFromWords(initialValues);
        expect(result.length).toEqual(finalLength);
      },
    );
  });

  describe('validateEmail', () => {
    it.each([
      ['kevin@gmail.com', true],
      ['kevin.durant@gmail.com', true],
      ['', false],
      ['kevin', false],
      ['Kevin', false],
      ['Kevin@gma', false],
      ['kevin@ymail.in', true],
      ['Kevin@', false],
    ])(
      'should check if given string is a valid email',
      (initialValue, expectedValue) => {
        const result = Utils.validateEmail(initialValue);
        expect(result).toEqual(expectedValue);
      },
    );
  });

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

  describe('registerUser', () => {
    it('should return user response after register api call', async () => {
      const registerUserResponse = {
        data: {
          otpId: 'OtpId',
        },
        statusCode: 200,
        message: 'Success',
      };

      // Mocked api call to register user
      jest
        .spyOn(Utils, 'registerUser')
        .mockResolvedValueOnce(registerUserResponse);

      const response = await Utils.registerUser('email', 'otpId');

      expect(Utils.registerUser).toHaveBeenCalledWith('email', 'otpId');
      expect(response).toStrictEqual(registerUserResponse);
    });
  });
});
