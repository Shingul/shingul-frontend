import { Transmit } from '@adonisjs/transmit-client'

let transmitSingleton: Transmit | null = null

export function getTransmit() {

  if (!transmitSingleton) {
    transmitSingleton = new Transmit({
      baseUrl: "http://localhost:3333",
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
    })
  }

  return transmitSingleton
}
