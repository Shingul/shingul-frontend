import { Transmit } from "@adonisjs/transmit-client";

let transmitSingleton: Transmit | null = null;

export function getTransmit() {
  console.log("NEXT_FRONTEND_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!transmitSingleton && typeof window !== "undefined" && url) {
    transmitSingleton = new Transmit({
      baseUrl: url,
      maxReconnectAttempts: 5,
      onReconnectAttempt: (attempt: number) => {
        console.log("Reconnect attempt " + attempt);
      },
      onReconnectFailed: () => {
        console.log("Reconnect failed");
      },
      onSubscription: (subscription) => {
        console.log("Subscription created", subscription);
      },
      onUnsubscription: (subscription) => {
        console.log("Subscription deleted", subscription);
      },
      //   beforeSubscribe: (_channel, request) => {
      //     if (participantToken) {
      //       request.headers.set('x-participant-token', participantToken)
      //     }
      //   },
    });
  }

  return transmitSingleton;
}
