export interface UserStats{

  blitzEloRatings: number[];
  bulletEloRatings: number[];
  rapidEloRatings: number[];
  labels: string[];
  timeUnit: string;

}
export const IntervalType = { DAY: 'DAY' , WEEK: 'WEEK', MONTH: 'MONTH', YEAR: 'YEAR' }
