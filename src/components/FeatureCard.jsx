import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="card text-center bg-[#262C53] text-[#F7FAFC] p-6 rounded-lg shadow-lg transition-transform transform hover:translate-y-[-5px] hover:shadow-xl">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold mb-1 text-[#A2F4F9]">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;