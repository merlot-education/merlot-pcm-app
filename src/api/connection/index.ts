import { AxiosInstance } from 'axios'

const connection = (instance: AxiosInstance) => {
  return {
    invitationUrl() {
      return instance.get('v1/configurations/?services=aisbl-participant-id')
    },
  }
}

export default connection
