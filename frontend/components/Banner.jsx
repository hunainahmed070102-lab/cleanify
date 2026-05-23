'use client'
import React from 'react';

export default function Banner() {
    const [isOpen, setIsOpen] = React.useState(true);

    return isOpen && (
        <div className="relative w-full py-2.5 px-6 font-medium text-sm text-green-800 text-center bg-gradient-to-r from-[#ABFF7E] to-[#FDFEFF]">
            <a href="https://www.instagram.com/cleanify" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Follow @Cleanify On Instagram To Unlock Exclusive Discounts.
            </a>
            <button onClick={() => setIsOpen(false)} type="button" className="absolute right-4 top-1/2 -translate-y-1/2 font-normal text-green-800 py-2 rounded-full hover:opacity-80 transition">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="currentColor" />
                    <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
};
