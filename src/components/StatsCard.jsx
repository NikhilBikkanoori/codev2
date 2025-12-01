import React from 'react';

const StatsCard = ({ stat, description }) => {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold" style={{ color: 'var(--c4)' }}>{stat}</p>
      <p>{description}</p>
    </div>
  );
};

export default StatsCard;