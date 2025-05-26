
import React from 'react';

interface AnimatedAvatarProps {
  isSpeaking: boolean;
  className?: string;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ isSpeaking, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Główna głowa */}
      <div className="relative w-20 h-24 mx-auto">
        {/* Tło głowy */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full transform scale-x-90"></div>
        
        {/* Włosy */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-amber-800 to-amber-700 rounded-t-full"></div>
        
        {/* Oczy */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className={`w-2 h-2 bg-gray-800 rounded-full transition-all duration-200 ${isSpeaking ? 'animate-pulse' : ''}`}></div>
          <div className={`w-2 h-2 bg-gray-800 rounded-full transition-all duration-200 ${isSpeaking ? 'animate-pulse' : ''}`}></div>
        </div>
        
        {/* Nos */}
        <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"></div>
        
        {/* Usta - animowane podczas mówienia */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          {isSpeaking ? (
            <div className="w-3 h-2 bg-gray-700 rounded-full animate-pulse"></div>
          ) : (
            <div className="w-3 h-0.5 bg-gray-700 rounded-full"></div>
          )}
        </div>
        
        {/* Fale dźwiękowe podczas mówienia */}
        {isSpeaking && (
          <>
            <div className="absolute top-10 -left-6 w-1 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-12 -left-8 w-1 h-2 bg-blue-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute top-10 -right-6 w-1 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-12 -right-8 w-1 h-2 bg-blue-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </>
        )}
      </div>
      
      {/* Ciało */}
      <div className="mt-2">
        {/* Ramiona */}
        <div className="flex justify-center gap-8">
          <div className={`w-2 h-6 bg-blue-600 rounded-full transition-transform duration-500 ${isSpeaking ? 'rotate-12' : 'rotate-0'}`}></div>
          <div className={`w-2 h-6 bg-blue-600 rounded-full transition-transform duration-500 ${isSpeaking ? '-rotate-12' : 'rotate-0'}`}></div>
        </div>
        
        {/* Tors */}
        <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto -mt-2"></div>
      </div>
      
      {/* Aura podczas mówienia */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
      )}
    </div>
  );
};

export default AnimatedAvatar;
