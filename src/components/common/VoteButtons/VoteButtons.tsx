'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { VoteType } from '@/types';
import { cn } from '@/lib/utils';
import { useVoteButtons } from './hooks';
import { VoteButtonsProps } from './types';
import { FC } from 'react';
import { VoteButton } from './components';

/**
 * Componente de botones de voto (like/dislike) con soporte para estados optimistas y tooltips.
 * @param props {@link VoteButtonsProps}  Propiedades del componente
 * @param props.className @type string Clases CSS adicionales para el contenedor de los botones
 * @param props.label @type string Etiqueta opcional que se muestra junto a los botones
 * @param props.disabled @type boolean Deshabilita los botones para evitar interacciones
 * @param props.likeTooltip @type string Texto del tooltip para el botón de like cuando no está activo
 * @param props.likeTooltipActive @type string Texto del tooltip para el botón de like cuando está activo
 * @param props.dislikeTooltip @type string Texto del tooltip para el botón de dislike cuando no está activo
 * @param props.dislikeTooltipActive @type string Texto del tooltip para el botón de dislike cuando está activo
 * @returns
 */
export const VoteButtons: FC<VoteButtonsProps> = ({
  className,
  label,
  disabled,
  likeTooltip = 'Marcar como útil',
  likeTooltipActive = 'Ya votaste útil',
  dislikeTooltip = 'Marcar como no útil',
  dislikeTooltipActive = 'Ya votaste no útil',
  ...hookProps
}: VoteButtonsProps) => {
  const {
    handleVote,
    clickedButton,
    optimisticLikes,
    optimisticDislikes,
    optimisticUserVote,
  } = useVoteButtons({ ...hookProps });

  const getLikeTooltip = () =>
    optimisticUserVote === VoteType.LIKE ? likeTooltipActive : likeTooltip;

  const getDislikeTooltip = () =>
    optimisticUserVote === VoteType.DISLIKE ? dislikeTooltipActive : dislikeTooltip;

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('flex items-center gap-2', className)}>
        {label && <span className="text-xs text-gray-500">{label}</span>}

        <VoteButton
          handleOnClick={() => handleVote(VoteType.LIKE)}
          disabled={disabled}
          isActive={optimisticUserVote === VoteType.LIKE}
          icon={ThumbsUp}
          clickedButton={clickedButton === VoteType.LIKE}
          toolTipMessage={getLikeTooltip()}
          optimisticVotes={optimisticLikes}
        />

        <VoteButton
          handleOnClick={() => handleVote(VoteType.DISLIKE)}
          disabled={disabled}
          isActive={optimisticUserVote === VoteType.DISLIKE}
          icon={ThumbsDown}
          clickedButton={clickedButton === VoteType.DISLIKE}
          toolTipMessage={getDislikeTooltip()}
          optimisticVotes={optimisticDislikes}
        />
      </div>
    </TooltipProvider>
  );
};
