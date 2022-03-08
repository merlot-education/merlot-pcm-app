export interface RegisterUserRequest {
  email: string
}
export interface SeedHashRequest {
  email: string
  seedHash: string
}
export interface RegisterUserOtpRequest {
  contact: string
  otp: number
}
