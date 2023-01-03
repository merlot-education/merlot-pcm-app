import api from '../../api';

export const registerUser = async (email: string, otpId: string) => {
  const data = await api.auth.register({
    email,
    otpId,
  });
  return data;
};

export const verifyOtp = async (otpId: string, otp: number) => {
  const data = await api.auth.verifyOtp({
    otpId,
    otp,
  });
  return data;
};
