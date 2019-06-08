import { RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './custom-rx-stomp.config';
import { UserService } from './core/user.service';
import { AppConfig } from './app.config';
import { APP_INITIALIZER, InjectionToken } from '@angular/core';

const stompServiceFactory = (userService: UserService) => {
  const token = window.sessionStorage.getItem('token');
  if (token !== null) {

    if (AppConfig.settings) { myRxStompConfig.brokerURL = AppConfig.settings.apiServer.socketURL; }
    myRxStompConfig.connectHeaders = { login: userService.loggedUser, jwt: token };
    const rxStompService = rxStompServiceFactory(myRxStompConfig);
    //rxStompService.activate();
    return rxStompService;
  }
  return null;

};

export let stompServiceProvider = {
  provide: RxStompService,
  useFactory: stompServiceFactory,
  deps: [UserService]
};
