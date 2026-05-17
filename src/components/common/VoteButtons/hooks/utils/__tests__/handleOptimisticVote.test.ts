import { describe, it, expect } from 'vitest';
import { handleOptimisticVote } from '../handleOptimisticVote.util';
import { VoteType } from '@/types';
import { VoteState } from '../../types';

describe('handleOptimisticVote', () => {
  describe('Caso 1: Quitar el voto (clic en el mismo que ya tenía)', () => {
    it('debe establecer el voto en NONE y decrementar likesCount al quitar un LIKE', () => {
      const currentState: VoteState = {
        currentVote: VoteType.LIKE,
        likesCount: 10,
        dislikesCount: 5,
      };

      const result = handleOptimisticVote({ voteType: VoteType.LIKE, currentState });

      expect(result).toEqual({
        currentVote: VoteType.NONE,
        likesCount: 9,
        dislikesCount: 5,
      });
    });

    it('debe establecer el voto en NONE y decrementar dislikesCount al quitar un DISLIKE', () => {
      const currentState: VoteState = {
        currentVote: VoteType.DISLIKE,
        likesCount: 10,
        dislikesCount: 5,
      };

      const result = handleOptimisticVote({ voteType: VoteType.DISLIKE, currentState });

      expect(result).toEqual({
        currentVote: VoteType.NONE,
        likesCount: 10,
        dislikesCount: 4,
      });
    });

    it('no debe permitir que los contadores sean menores a cero', () => {
      const currentState: VoteState = {
        currentVote: VoteType.LIKE,
        likesCount: 0,
        dislikesCount: 0,
      };

      const result = handleOptimisticVote({ voteType: VoteType.LIKE, currentState });
      expect(result.likesCount).toBe(0);
    });
  });

  describe('Caso 2: Cambiar de bando (Switching)', () => {
    it('debe incrementar dislikes y decrementar likes al cambiar de LIKE a DISLIKE', () => {
      const currentState: VoteState = {
        currentVote: VoteType.LIKE,
        likesCount: 10,
        dislikesCount: 5,
      };

      const result = handleOptimisticVote({ voteType: VoteType.DISLIKE, currentState });

      expect(result).toEqual({
        currentVote: VoteType.DISLIKE,
        likesCount: 9,
        dislikesCount: 6,
      });
    });

    it('debe incrementar likes y decrementar dislikes al cambiar de DISLIKE a LIKE', () => {
      const currentState: VoteState = {
        currentVote: VoteType.DISLIKE,
        likesCount: 10,
        dislikesCount: 5,
      };

      const result = handleOptimisticVote({ voteType: VoteType.LIKE, currentState });

      expect(result).toEqual({
        currentVote: VoteType.LIKE,
        likesCount: 11,
        dislikesCount: 4,
      });
    });
  });

  describe('Caso 3: Votar por primera vez (estado NONE)', () => {
    it('debe incrementar el contador correspondiente cuando el estado inicial es NONE', () => {
      const currentState: VoteState = {
        currentVote: VoteType.NONE,
        likesCount: 0,
        dislikesCount: 0,
      };

      const resultLike = handleOptimisticVote({ voteType: VoteType.LIKE, currentState });
      expect(resultLike).toEqual({
        currentVote: VoteType.LIKE,
        likesCount: 1,
        dislikesCount: 0,
      });

      const resultDislike = handleOptimisticVote({ voteType: VoteType.DISLIKE, currentState });
      expect(resultDislike).toEqual({
        currentVote: VoteType.DISLIKE,
        likesCount: 0,
        dislikesCount: 1,
      });
    });
  });
});
