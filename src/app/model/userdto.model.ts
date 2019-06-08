export class UserDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  fideTitle: string = '';
  avatarType: string;
  avatarData: string;
  country: string;
  eloRatings: number[];
  theme: string;
  soundEnabled: boolean;
}
