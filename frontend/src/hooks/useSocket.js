import { useEffect } from 'react'
import { getSocket } from '../services/socket.js'

/**
 * @param {string} event
 * @param {function} handler
 */
export function useSocket(event, handler) {
  useEffect(() => {
    const s = getSocket()
    if (!s || !event || !handler) return undefined
    s.connect()
    s.on(event, handler)
    return () => {
      s.off(event, handler)
    }
  }, [event, handler])
}
