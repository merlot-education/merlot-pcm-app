import { AxiosInstance } from 'axios'
import { RegisterUserRequest, RegisterUserOtpRequest } from './auth.types'

const auth = (instance: AxiosInstance) => {
  // TODO: Added sample just for reference remove it later when ready
  return {
    register(body: RegisterUserRequest, config = {}) {
      return instance.post('v1/notification/sendOtp', body, config)
    },
    otp(body: RegisterUserOtpRequest, config = {}) {
      return instance.post('v1/notification/verifyOtp', body, config)
    },
  }
}

export default auth
