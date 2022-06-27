import { APIResponse } from '../api.types'

export interface RegisterUserRequest {
  email: string
  otpId: string
}

export interface RegisterUserResponse extends APIResponse {
  data: { otpId: string }
}

export interface VerifyOtpRequest {
  otpId: string
  otp: number
}

export interface VerifyOtpResponse extends APIResponse {
  data: boolean
}
