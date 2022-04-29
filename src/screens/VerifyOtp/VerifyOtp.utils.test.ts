import * as Utils from './VerifyOtp.utils'

describe('VerifyOtp.utils', () => {
  describe('registerUser', () => {
    it('should return user response after register api call', async () => {
      const registerUserResponse = {
        data: {
          otpId: 'OtpId',
        },
        statusCode: 200,
        message: 'Success',
      }

      // Mocked api call to register user
      jest
        .spyOn(Utils, 'registerUser')
        .mockResolvedValueOnce(registerUserResponse)

      const response = await Utils.registerUser('email', 'otpId')

      expect(Utils.registerUser).toHaveBeenCalledWith('email', 'otpId')
      expect(response).toStrictEqual(registerUserResponse)
    })
  })

  describe('verifyOtp', () => {
    it('should return user verify response after verify api call', async () => {
      const verifyOtpResponse = {
        data: {
          otpId: 'OtpId',
          otp: 'otp',
        },
        statusCode: 200,
        message: 'Success',
      }

      // Mocked api call to otp verify
      jest.spyOn(Utils, 'verifyOtp').mockResolvedValueOnce(verifyOtpResponse)

      const response = await Utils.verifyOtp('email', 'otpId')

      expect(Utils.verifyOtp).toHaveBeenCalledWith('email', 'otpId')
      expect(response).toStrictEqual(verifyOtpResponse)
    })
  })
})
