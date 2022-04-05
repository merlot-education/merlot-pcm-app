import { AxiosInstance } from 'axios'

const config = (instance: AxiosInstance) => {
  return {
    invitationUrl(config = {}) {
      return instance.get(
        'v1/invitation-url?participantId=66398cf4-e14d-4d92-9dc4-b40a48ae97dd',
        config,
      )
    },
  }
}

export default config
