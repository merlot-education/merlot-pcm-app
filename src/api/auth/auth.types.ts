export interface RegisterUserRequest {
  email: string
}

export interface RegisterUserOtpRequest {
  contact: string
  otp: number
}
