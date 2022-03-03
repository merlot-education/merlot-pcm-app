import { AxiosInstance } from 'axios'
import { RegisterUserRequest, SeedHashRequest } from './auth.types'

const auth = (instance: AxiosInstance) => {
  // TODO: Added sample just for reference remove it later when ready
  return {
    register(body: RegisterUserRequest, config = {}) {
      return instance.post('auth/register', body, config)
    },
    sendSeedHash(body: SeedHashRequest, config = {}) {
      return instance.post('/v1/notification/sendSeed')
    },
  }
}

export default auth
