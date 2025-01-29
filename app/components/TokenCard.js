import Image from 'next/image';
import React from 'react';

export function TokenCard({ token, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <Image
        src={token.image}
        alt={token.name}
        width={40}
        height={40}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{token.name}</h3>
            <p className="text-gray-600">{token.ticker}</p>
          </div>
          {token.percentage && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {token.percentage}%
            </span>
          )}
        </div>
        <p className="text-gray-700 mt-2 line-clamp-2">{token.description}</p>
      </div>
    </div>
  );
}