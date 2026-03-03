import { useEffect, useMemo } from 'react'
import { getTransmit } from '../lib/transmit'

type UseTransmitSubscriptionParams<TMessage> = {
  enabled?: boolean
  channel: string
  onMessage: (message: TMessage) => void
}

export function useTransmit<TMessage>({
  enabled = true,
  channel,
  onMessage,
}: UseTransmitSubscriptionParams<TMessage>) {
  const transmit = useMemo(() => getTransmit(), []);
  useEffect(() => {
    if (!enabled) return
    if (!transmit) return
    if (!channel) return

    let mounted = true
    const subscription = transmit.subscription(channel)

    const setup = async () => {
      try {
        await subscription.create()
        if (!mounted) return
        subscription.onMessage((msg: TMessage) => {
          if (!mounted) return
          onMessage(msg)
        })
      } catch (err) {
        console.error('Transmit subscription failed', { channel, err })
      }
    }

    setup()

    return () => {
      mounted = false
      subscription.delete().catch(() => {})
    }
  }, [enabled, transmit, channel, onMessage])
}
