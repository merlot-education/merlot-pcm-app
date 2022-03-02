import { AxiosInstance } from 'axios'

const config = (instance: AxiosInstance) => {
  // TODO: Added sample just for reference remove it later when ready
  return {
    logs(body, config = {}) {
      return instance.post('log', body, config)
    },
  }
}

export default config
