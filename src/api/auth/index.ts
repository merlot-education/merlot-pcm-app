import { AxiosInstance } from 'axios'
import {
  RegisterUserRequest,
  VerifyOtpRequest,
  RegisterUserResponse,
  VerifyOtpResponse,
} from './auth.types'

const auth = (instance: AxiosInstance) => {
  return {
    register(
      body: RegisterUserRequest,
      config = {},
    ): Promise<RegisterUserResponse> {
      console.log('---')
      return instance.post('v1/notification/sendOtp', body, config)
    },
    verifyOtp(body: VerifyOtpRequest, config = {}): Promise<VerifyOtpResponse> {
      return instance.post('v1/notification/verifyOtp', body, config)
    },
  }
}

export default auth
