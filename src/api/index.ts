import axios from 'axios'
import Config from 'react-native-config'
import auth from './auth'
import config from './config'

const instance = axios.create({
  baseURL: Config.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const configInstance = axios.create({
  baseURL: Config.CONFIG_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  async response => {
    return response.data
  },
  async ({ response }) => {
    const error = response?.data?.meta?.message
    return Promise.reject(error)
  },
)

configInstance.interceptors.response.use(
  async response => {
    return response.data
  },
  async ({ response }) => {
    const error = response?.data?.meta?.message
    return Promise.reject(error)
  },
)

export default {
  auth: auth(instance),
  config: config(configInstance),
}
