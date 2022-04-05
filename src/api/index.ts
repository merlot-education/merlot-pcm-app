import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
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

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return config
}

const onRequestError = (error: AxiosError): AxiosError => {
  return error
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response.data
}

const onResponseError = (error: AxiosError): AxiosError => {
  return error
}

instance.interceptors.request.use(onRequest, onRequestError)
instance.interceptors.response.use(onResponse, onResponseError)

configInstance.interceptors.request.use(onRequest, onRequestError)
configInstance.interceptors.response.use(onResponse, onResponseError)

export default {
  auth: auth(instance),
  config: config(configInstance),
}
