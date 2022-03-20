import { AxiosInstance } from 'axios'

const config = (instance: AxiosInstance) => {
  return {
    invitationUrl(config = {}) {
      return instance.get(
        'v1/invitation-url?agent=http://3.111.77.38:4002&participantId=f018599e-c5ce-4099-9e56-697e56483aca',
        config,
      )
    },
  }
}

export default config
