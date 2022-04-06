import { AxiosInstance } from 'axios'

const config = (instance: AxiosInstance) => {
  return {
    // eslint-disable-next-line default-param-last
    invitationUrl(config = {}, participantID) {
      return instance.get(
        `/v1/invitation-url?participantId=${participantID}`,
        config,
      )
    },
  }
}

export default config
