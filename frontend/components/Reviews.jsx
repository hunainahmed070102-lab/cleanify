'use client'
import { useState, useEffect, memo } from 'react';
import { getVisibleReviews } from '@/lib/reviewService';
import { Star } from 'lucide-react';

// Memoize the card component to prevent unnecessary re-renders
const CreateCard = memo(({ card }) => (
    <div className="p-6 rounded-2xl mx-4 shadow-md hover:shadow-lg transition-all duration-200 w-80 shrink-0 bg-white border border-slate-100">
        <div className="flex gap-4 items-start mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0 bg-slate-100">
                {card.image ? (
                    <img 
                        className="w-full h-full object-cover" 
                        src={card.image} 
                        alt={card.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-slate-600 font-bold text-xl">${card.name?.charAt(0)?.toUpperCase() || '?'}</div>`;
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-xl">
                        {card.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-1">
                <p className="font-bold text-slate-800 text-base mb-1">{card.name}</p>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            size={16} 
                            className={i < (card.rating || 5) ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"} 
                        />
                    ))}
                </div>
            </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{card.review}</p>
    </div>
));

CreateCard.displayName = 'CreateCard';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const loadReviews = () => {
            setReviews(getVisibleReviews());
        };
        
        loadReviews();
        
        // Listen for review updates
        const handleReviewsUpdated = () => {
            loadReviews();
        };
        
        window.addEventListener('reviewsUpdated', handleReviewsUpdated);
        
        return () => {
            window.removeEventListener('reviewsUpdated', handleReviewsUpdated);
        };
    }, []);

    if (reviews.length === 0) return null;

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white" id="reviews">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-3">
                        Reviews
                    </p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-800">
                        What Our Customers Say
                    </h2>
                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                        Don't just take our word for it. See what our satisfied customers have to say about our property services.
                    </p>
                </div>

                <style>{`
                    @keyframes marqueeScroll {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }

                    .marquee-inner {
                        animation: marqueeScroll 25s linear infinite;
                        will-change: transform;
                    }

                    .marquee-reverse {
                        animation-direction: reverse;
                    }
                `}</style>

                <div className="marquee-row w-full overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                    <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                        {[...reviews, ...reviews].map((card, index) => (
                            <CreateCard key={`row1-${card.id}-${index}`} card={card} />
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
                </div>

                <div className="marquee-row w-full overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                    <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
                        {[...reviews, ...reviews].map((card, index) => (
                            <CreateCard key={`row2-${card.id}-${index}`} card={card} />
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
                </div>
            </div>
        </section>
    );
}
