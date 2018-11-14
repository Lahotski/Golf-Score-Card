let ScoringService = require("../js/scoring-service");

describe('ScoringService', () => {
  let scoringService;

  beforeEach(() => {
    scoringService = new ScoringService();
  });

  describe('calculateScoreRelativeToPar', () => {
    it('calculates under par score correctly', () => {
      let par = 72;
      let playerScores = Array(18).fill(3, 0, 18);
      let scoreRelativeToPar = scoringService.calculateScoreRelativeToPar(par, playerScores);
      expect(scoreRelativeToPar).toEqual(-18);
    });
    it('calculates over par score correctly', () => {
      let par = 72;
      let playerScores = Array(18).fill(5, 0, 18);
      let scoreRelativeToPar = scoringService.calculateScoreRelativeToPar(par, playerScores);
      expect(scoreRelativeToPar).toEqual(18);
    });
    it('returns a number', () => {
      let par = 72;
      let playerScores = Array(18).fill(5, 0, 18);
      let scoreRelativeToPar = scoringService.calculateScoreRelativeToPar(par, playerScores);
      expect(typeof scoreRelativeToPar).toEqual('number');
    });
    it('calculates even when no scores', () => {
      let par = 72;
      let playerScores = Array(18);
      let scoreRelativeToPar = scoringService.calculateScoreRelativeToPar(par, playerScores);
      expect(scoreRelativeToPar).toEqual(-72);
    });
  });
  describe('calculateOutScore', () => {});
  describe('calculateInScore', () => {});
  describe('calculateTotalScore', () => {});
});
