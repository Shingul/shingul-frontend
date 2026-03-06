import { useEffect, useMemo } from "react";
import { getTransmit } from "../lib/transmit";

type UseTransmitSubscriptionParams<TMessage> = {
  enabled?: boolean;
  channel: string;
  onMessage: (message: TMessage) => void;
  autoCleanup?: boolean;
};

export function useTransmit<TMessage>({
  enabled = true,
  channel,
  onMessage,
  autoCleanup = true,
}: UseTransmitSubscriptionParams<TMessage>) {
  const transmit = useMemo(() => getTransmit(), []);
  useEffect(() => {
    if (!enabled) return;
    if (!transmit) return;
    if (!channel) return;

    let mounted = true;
    const subscription = transmit.subscription(channel);
    console.log("Subscribing to channel", channel);

    const setup = async () => {
      try {
        await subscription.create();
        if (!mounted) return;
        subscription.onMessage((msg: TMessage) => {
          if (!mounted) return;
          onMessage(msg);
        });
      } catch (err) {
        console.error("Transmit subscription failed", { channel, err });
      }
    };

    setup();

    return () => {
      mounted = false;
      console.log("Unsubscribing from channel: useTransmit", channel);
      // if (autoCleanup) {
      // subscription.delete().catch(() => {});
      // }
    };
  }, [enabled, transmit, channel, onMessage, autoCleanup]);
}

export function usePublicTransmit<TMessage>({
  enabled = true,
  channel,
  onMessage,
  autoCleanup = true,
}: UseTransmitSubscriptionParams<TMessage>) {
  const transmit = useMemo(() => getTransmit(), []);
  useEffect(() => {
    if (!enabled) return;
    if (!transmit) return;
    if (!channel) return;

    let mounted = true;
    const subscription = transmit.subscription(channel);
    console.log("Subscribing to channel", channel);

    const setup = async () => {
      try {
        await subscription.create();
        if (!mounted) return;
        subscription.onMessage((msg: TMessage) => {
          if (!mounted) return;
          onMessage(msg);
        });
      } catch (err) {
        console.error("Transmit subscription failed", { channel, err });
      }
    };

    setup();

    return () => {
      mounted = false;
      console.log("Unsubscribing from channel: usePublicTransmit", channel);
      // if (autoCleanup) {
      //   subscription.delete().catch(() => {});
      // }
    };
  }, [enabled, transmit, channel, onMessage, autoCleanup]);
}
