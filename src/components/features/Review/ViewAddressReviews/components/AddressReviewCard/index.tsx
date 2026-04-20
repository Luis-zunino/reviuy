import { FeedBackBadge } from '@/components/common';
import { Button } from '@/components/ui/button';
import { ReviewCardProps } from '../../types';

export const AddressReviewCard = ({ review }: ReviewCardProps) => {
  const addressText = review.address_text || 'Dirección no disponible';
  const cityText = addressText.includes(',') ? addressText.split(',').slice(-1)[0].trim() : '';

  const isRecommended = review.rating >= 3;

  return (
    <div className="relative border border-gray-300 rounded-md overflow-hidden my-6">
      <FeedBackBadge recommended={isRecommended} />
      <div className="flex flex-col lg:flex-row lg:mx-6 lg:p-0 lg:pb-4 px-4 py-6 border-b-2 gap-6">
        <div className="grid grid-cols-[1fr_auto] lg:w-1/3">
          <div className="flex flex-col lg:gap-5 gap-3">
            <span className="font-bold text-sm md:text-base">
              {review.title}
              <p className="text-xs md:text-base font-normal flex ">{addressText}</p>
              {cityText && <p className="text-xs md:text-base font-normal flex ">{cityText}</p>}
            </span>
            {review.property_type && (
              <div className="flex items-center">
                <div className="flex w-5 h-5">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 256 256"
                    color="#546E7A"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M128,166a38,38,0,1,0-38-38A38,38,0,0,0,128,166Zm0-64a26,26,0,1,1-26,26A26,26,0,0,1,128,102ZM240,58H16a6,6,0,0,0-6,6V192a6,6,0,0,0,6,6H240a6,6,0,0,0,6-6V64A6,6,0,0,0,240,58ZM22,108.82A54.73,54.73,0,0,0,60.82,70H195.18A54.73,54.73,0,0,0,234,108.82v38.36A54.73,54.73,0,0,0,195.18,186H60.82A54.73,54.73,0,0,0,22,147.18ZM234,96.29A42.8,42.8,0,0,1,207.71,70H234ZM48.29,70A42.8,42.8,0,0,1,22,96.29V70ZM22,159.71A42.8,42.8,0,0,1,48.29,186H22ZM207.71,186A42.8,42.8,0,0,1,234,159.71V186Z"></path>
                  </svg>
                </div>
                <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
                  Tipo: {review.property_type}
                </p>
              </div>
            )}
            <div className="flex items-center">
              <div className="flex w-5 h-5">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 256 256"
                  color="#546E7A"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
                </svg>
              </div>
              <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
                Publicado el {new Date(review.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <span className="font-bold text-sm md:text-base">{review.title}</span>
          <div className="flex flex-col lg:gap-6 gap-4 lg:mt-8 mt-4 lg:mb-6">
            <div className="flex align-top gap-4 ">
              <span className="flex-1 text-sm md:text-base">{review.description}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-between mx-6">
        <Button variant="seeMore">Ver más</Button>
      </div>
    </div>
  );
};
