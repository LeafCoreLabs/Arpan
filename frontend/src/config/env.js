const env = {
  VITE_API_URL: import.meta.env.VITE_API_URL ?? '',
  VITE_WS_URL: import.meta.env.VITE_WS_URL ?? '',
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
}

export default env
