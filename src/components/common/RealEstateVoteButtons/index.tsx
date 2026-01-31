'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { VoteType } from '@/types';
import { cn } from '@/lib/utils';
import type { RealEstateVoteButtonsProps } from './types';
import { useRealEstateVoteButtons } from './hooks';

/**
 * Componente de botones de votación para propiedades inmobiliarias.
 *
 * Permite a los usuarios votar a favor (thumbs up) o en contra (thumbs down)
 * de una inmobiliaria en base a su experiencia.
 *
 * @component
 * @example
 * ```tsx
 * <RealEstateVoteButtons
 *   realEstateId="real-estate-456"
 *   likes={120}
 *   dislikes={15}
 *   userVote="like"
 *   refetchRealEstate={refetch}
 * />
 * ```
 *
 * @param {RealEstateVoteButtonsProps} props - Propiedades del componente
 * @param {string} props.realEstateId - ID único de la inmobiliaria
 * @param {number} props.likes - Número de votos positivos
 * @param {number} props.dislikes - Número de votos negativos
 * @param {VoteType} [props.userVote] - Voto actual del usuario ('like' | 'dislike' | null)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {() => void} [props.refetchRealEstate] - Función para refrescar datos después de votar
 * @param {boolean} [props.isLoading=false] - Estado de carga
 *
 * @returns {JSX.Element} Botones de votación renderizados
 *
 * @fires voteRealEstateAction - Server Action con rate limiting
 *
 * @remarks
 * - Rate limit: 10 votos cada 10 segundos
 * - Tooltips dinámicos según estado del voto
 * - Indicador visual del voto activo del usuario
 */
export const RealEstateVoteButtons: React.FC<RealEstateVoteButtonsProps> = ({
  realEstateId,
  likes,
  dislikes,
  userVote,
  className = '',
  refetchRealEstate,
  isLoading,
}) => {
  const { handleVote, isPending, clickedButton, getLikeTooltip, getDislikeTooltip } =
    useRealEstateVoteButtons({
      realEstateId,
      userVote,
      refetchRealEstate,
    });
  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('flex items-center gap-2', className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="like"
              size="sm"
              onClick={() => handleVote(VoteType.LIKE)}
              disabled={isPending || isLoading}
              data-active={userVote === VoteType.LIKE}
              icon={ThumbsUp}
              className={cn(
                'min-w-12 transition-all duration-200',
                'hover:scale-105 active:scale-95',
                clickedButton === VoteType.LIKE && 'animate-pulse',
                userVote === VoteType.LIKE &&
                  'bg-green-100 border-green-500 text-green-700 hover:bg-green-200'
              )}
              aria-label="Recomendar inmobiliaria"
            >
              {isPending || isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span>{likes}</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getLikeTooltip()}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="like"
              size="sm"
              onClick={() => handleVote(VoteType.DISLIKE)}
              disabled={isPending || isLoading}
              data-active={userVote === VoteType.DISLIKE}
              icon={ThumbsDown}
              className={cn(
                'min-w-12 transition-all duration-200',
                'hover:scale-105 active:scale-95',
                clickedButton === VoteType.DISLIKE && 'animate-pulse',
                userVote === VoteType.DISLIKE &&
                  'bg-red-100 border-red-500 text-red-700 hover:bg-red-200'
              )}
              aria-label="No recomendar inmobiliaria"
            >
              {isPending || isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span>{dislikes}</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getDislikeTooltip()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
