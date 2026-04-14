import React from 'react';

const Skeleton = ({ className, count = 1 }) => {
  return (
    <div className="space-y-3 w-full">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className={`bg-[var(--surface-2)] rounded-lg animate-pulse ${className}`}
          style={{ 
            animation: 'shimmer 1.2s ease-in-out infinite alternate'
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          from { opacity: 0.4 }
          to { opacity: 0.8 }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
