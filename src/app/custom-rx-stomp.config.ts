import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';

export const myRxStompConfig: InjectableRxStompConfig = {

  brokerURL: 'ws://127.0.0.1:8080/websocket/websocket',

  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },

  heartbeatIncoming: 0,
  heartbeatOutgoing: 10000,

  reconnectDelay: 2000,
  //reconnectDelay: 0,

  debug: (msg: string): void => {
    console.log(new Date(), msg);
  }
};
