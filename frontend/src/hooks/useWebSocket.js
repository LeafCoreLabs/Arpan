import { useEffect, useRef, useCallback, useState } from 'react'
import env from '../config/env.js'

export function useWebSocket(onMessage) {
  const wsRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const reconnectTimer = useRef(null)

  const connect = useCallback(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const baseUrl = (env.VITE_API_URL || window.location.origin)
      .replace(/^http/, 'ws')
      .replace(/\/$/, '')

    const url = `${baseUrl}/ws/notifications?token=${token}`

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current)
          reconnectTimer.current = null
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type !== 'pong' && onMessage) {
            onMessage(data)
          }
        } catch {}
      }

      ws.onclose = () => {
        setConnected(false)
        reconnectTimer.current = setTimeout(connect, 5000)
      }

      ws.onerror = () => {
        ws.close()
      }
    } catch {}
  }, [onMessage])

  useEffect(() => {
    connect()
    return () => {
      if (wsRef.current) wsRef.current.close()
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
    }
  }, [connect])

  const sendPing = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send('ping')
    }
  }, [])

  return { connected, sendPing }
}
