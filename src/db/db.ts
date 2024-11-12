import Dexie, { Table } from 'dexie';
import type { SavedAdCopy } from '../types';

class AdCopyDatabase extends Dexie {
  adCopies!: Table<SavedAdCopy>;

  constructor() {
    super('adCopyDB');
    
    this.version(1).stores({
      adCopies: '++id, name, copy, timestamp, userId'
    });
  }
}

export const db = new AdCopyDatabase();