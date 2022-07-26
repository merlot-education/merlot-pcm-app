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
      return instance.post('v1/sendOtp', body, config)
    },
    verifyOtp(body: VerifyOtpRequest, config = {}): Promise<VerifyOtpResponse> {
      return instance.post('v1/verifyOtp', body, config)
    },
  }
}

export default auth
