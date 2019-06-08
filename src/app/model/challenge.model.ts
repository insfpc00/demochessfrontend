import { TimeControlled } from './timecontrolled.model';

export class Challenge extends TimeControlled {
  public challengeId: number;
  public userName: string;
  public creationDate: string;
  public color: string;
  public matchId: number;
  public eloRating: number;

  constructor()
  constructor(color: string , timeInSeconds: number , timeIncrementInSeconds: number)
  constructor(color?: string, timeInSeconds?: number, timeIncrementInSeconds?: number) {
    super();
    this.timeInSeconds = 0;
    this.timeIncrementInSeconds = 0;
    if (color) {
      this.color = color; }
    if (timeInSeconds) {
      this.timeInSeconds = timeInSeconds; }
    if (timeIncrementInSeconds) {
       this.timeIncrementInSeconds = timeIncrementInSeconds; }
  }

}
