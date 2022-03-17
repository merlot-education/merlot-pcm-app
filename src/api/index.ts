import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import Config from 'react-native-config'
import Toast from 'react-native-toast-message'
import { ToastType } from '../components/toast/BaseToast'
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

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response.data
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  console.log('[response error]', JSON.stringify(error, null, 2))
  return Promise.reject(error)
}

instance.interceptors.request.use(onRequest, onRequestError)
instance.interceptors.response.use(onResponse, onResponseError)

configInstance.interceptors.request.use(onRequest, onRequestError)
configInstance.interceptors.response.use(onResponse, onResponseError)

export default {
  auth: auth(instance),
  config: config(configInstance),
}
