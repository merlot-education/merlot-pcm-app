import { AxiosInstance } from 'axios'
import { ConnectionInvitationURLRequest } from './config.types'

const config = (instance: AxiosInstance) => {
  // TODO: Added sample just for reference remove it later when ready
  return {
    logs(body, config = {}) {
      return instance.post('log', body, config)
    },
    connectionInvitation(body: ConnectionInvitationURLRequest, config = {}) {
      return instance.post(
        '/v1/create-invitation?agent=http://3.111.77.38:4000',
        body,
        config,
      )
    },
  }
}

export default config
