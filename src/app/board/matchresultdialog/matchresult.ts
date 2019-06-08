export interface MatchResult {
  result: MatchMessage;
  myusername: string;
  opusername: string;
}
export const matchMessageTypes = {
  userDisconnected: 'USER_DISCONNECTED',
  winByDisconnection: 'WIN_BY_DISCONNECTION',
  userOffersDraw: 'USER_OFFERS_DRAW',
  lossByResignation: 'LOSS_BY_RESIGNATION',
  winByResignation: 'WIN_BY_RESIGNATION',
  drawByAgreement: 'DRAW_BY_AGREEMENT',
  checkMate: 'CHECKMATE',
  checkMated: 'CHECKMATED',
  staleMate: 'STALEMATE',
  threeFoldRepetitionDraw: 'THREEFOLD_REPETITION_DRAW',
  lossOnTime: 'LOSS_ON_TIME',
  winByTime: 'WIN_BY_TIME',
  wrongMove: 'WRONG_MOVE',
  matchStarted: 'MATCH_STARTED',
  chatDisabled: 'CHAT_DISABLED',
  chatEnabled: 'CHAT_ENABLED',
  fiftyMoveRuleRepetitionDraw: 'FIFTY_MOVE_RULE_REPETITION_DRAW',
  insufficientMaterialDraw: 'INSUFFICIENT_MATERIAL'
};

export interface MatchMessage {
  message: string;
  newEloRating?: { eloRating: number, delta: number };
}
