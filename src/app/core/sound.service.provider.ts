import { UserService } from './user.service';
import { SoundService, SoundServiceImp } from './sound.service';
import { SilentSoundService } from './silentsound.service';

const soundServiceFactory = (userService: UserService) => {
  if (userService.isAuthenticated && userService.loggedUserProfile.soundEnabled) {
    return new SoundServiceImp();
  } else {
    return new SilentSoundService();
  }

};

export let soundServiceProvider = { provide: SoundService,
    useFactory: soundServiceFactory,
    deps: [UserService]
  };
