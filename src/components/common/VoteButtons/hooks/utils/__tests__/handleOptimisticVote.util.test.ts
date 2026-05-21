import { describe, it, expect } from 'vitest';
import { VoteType } from '@/types/vote-type';
import { handleOptimisticVote } from '../handleOptimisticVote.util';
import { VoteState } from '../../types';

describe('handleOptimisticVote util', () => {
  const baseState: VoteState = {
    likesCount: 10,
    dislikesCount: 5,
    currentVote: VoteType.NONE,
  };

  describe('Votar por primera vez (Estado NONE)', () => {
    it('debe incrementar likes cuando se vota LIKE', () => {
      const newState = handleOptimisticVote({
        voteType: VoteType.LIKE,
        currentState: baseState,
      });
      expect(newState).toEqual({
        likesCount: 11,
        dislikesCount: 5,
        currentVote: VoteType.LIKE,
      });
    });

    it('debe incrementar dislikes cuando se vota DISLIKE', () => {
      const newState = handleOptimisticVote({
        voteType: VoteType.DISLIKE,
        currentState: baseState,
      });
      expect(newState).toEqual({
        likesCount: 10,
        dislikesCount: 6,
        currentVote: VoteType.DISLIKE,
      });
    });
  });

  describe('Quitar un voto (clic en el mismo botón)', () => {
    it('debe decrementar likes y volver a NONE al quitar LIKE', () => {
      const state: VoteState = { ...baseState, currentVote: VoteType.LIKE };
      const newState = handleOptimisticVote({
        voteType: VoteType.LIKE,
        currentState: state,
      });
      expect(newState.likesCount).toBe(9);
      expect(newState).toEqual({
        likesCount: 9,
        dislikesCount: 5,
        currentVote: VoteType.NONE,
      });
    });

    it('debe decrementar dislikes y volver a NONE al quitar DISLIKE', () => {
      const state: VoteState = { ...baseState, currentVote: VoteType.DISLIKE };
      const newState = handleOptimisticVote({
        voteType: VoteType.DISLIKE,
        currentState: state,
      });
      expect(newState.dislikesCount).toBe(4);
      expect(newState.currentVote).toBe(VoteType.NONE);
    });

    it('debe decrementar dislikes y volver a NONE al quitar DISLIKE', () => {
      const state: VoteState = { ...baseState, currentVote: VoteType.DISLIKE };
      const newState = handleOptimisticVote({
        voteType: VoteType.DISLIKE,
        currentState: state,
      });
      expect(newState).toEqual({
        likesCount: 10,
        dislikesCount: 4,
        currentVote: VoteType.NONE,
      });
    });

    it('no debe permitir que los contadores sean menores a cero', () => {
      const state: VoteState = { likesCount: 0, dislikesCount: 0, currentVote: VoteType.LIKE };
      const newState = handleOptimisticVote({
        voteType: VoteType.LIKE,
        currentState: state,
      });
      expect(newState.likesCount).toBe(0);

      const stateDislike: VoteState = {
        likesCount: 0,
        dislikesCount: 0,
        currentVote: VoteType.DISLIKE,
      };
      const newStateDislike = handleOptimisticVote({
        voteType: VoteType.DISLIKE,
        currentState: stateDislike,
      });
      expect(newStateDislike.dislikesCount).toBe(0);
    });
  });

  describe('Cambiar de bando', () => {
    it('debe restar de likes y sumar a dislikes al cambiar de LIKE a DISLIKE', () => {
      const state: VoteState = { ...baseState, currentVote: VoteType.LIKE };
      const newState = handleOptimisticVote({
        voteType: VoteType.DISLIKE,
        currentState: state,
      });
      expect(newState).toEqual({
        likesCount: 9,
        dislikesCount: 6,
        currentVote: VoteType.DISLIKE,
      });
    });

    it('debe restar de dislikes y sumar a likes al cambiar de DISLIKE a LIKE', () => {
      const state: VoteState = { ...baseState, currentVote: VoteType.DISLIKE };
      const newState = handleOptimisticVote({
        voteType: VoteType.LIKE,
        currentState: state,
      });
      expect(newState.likesCount).toBe(11);
      expect(newState.dislikesCount).toBe(4);
    });
  });

  describe('Votar por primera vez (estado NONE)', () => {
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
