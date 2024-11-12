import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Clock, Trash2 } from 'lucide-react';
import { db } from '../db/db';
import type { SavedAdCopy } from '../types';

interface SavedCopiesProps {
  onSelect: (savedCopy: SavedAdCopy) => void;
}

function SavedCopies({ onSelect }: SavedCopiesProps) {
  const savedCopies = useLiveQuery(
    () => db.adCopies.orderBy('timestamp').reverse().toArray()
  );

  const handleDelete = async (id: number) => {
    await db.adCopies.delete(id);
  };

  if (!savedCopies?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Analyses</h2>
      <div className="space-y-4">
        {savedCopies.map((copy) => (
          <div key={copy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <button
                onClick={() => onSelect(copy)}
                className="text-left flex-1"
              >
                <h3 className="font-medium text-blue-600 hover:text-blue-700">{copy.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{copy.copy}</p>
              </button>
              <button
                onClick={() => copy.id && handleDelete(copy.id)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{new Date(copy.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedCopies;