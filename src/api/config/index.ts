import { AxiosInstance } from 'axios'

const config = (instance: AxiosInstance) => {
  return {
    invitationUrl(config = {}) {
      return instance.get(
        'v1/invitation-url?participantId=0191cf79-338e-46c5-9314-831c1b391a19',
        config,
      )
    },
  }
}

export default config
