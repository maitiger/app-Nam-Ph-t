
import { InventoryRecord } from '../types';

const STORAGE_KEY = 'nam_phat_inventory_records';

export const saveRecords = (records: InventoryRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving records to localStorage:', error);
  }
};

export const loadRecords = (): InventoryRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading records from localStorage:', error);
    return [];
  }
};

/**
 * Generates the next voucher ID in format YY.MM.xxx
 * xxx resets to 000 when the month changes.
 */
export const generateNextId = (records: InventoryRecord[]): string => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `${yy}.${mm}`;

  // Filter records that belong to the current year and month
  const currentMonthRecords = records.filter(r => r.id.startsWith(prefix));
  
  if (currentMonthRecords.length === 0) {
    return `${prefix}.000`;
  }

  // Extract the counter (xxx) from existing IDs
  const counters = currentMonthRecords.map(r => {
    const parts = r.id.split('.');
    if (parts.length === 3) {
      const num = parseInt(parts[2], 10);
      return isNaN(num) ? -1 : num;
    }
    return -1;
  });
  
  const maxCounter = Math.max(...counters);
  const nextCounter = (maxCounter + 1).toString().padStart(3, '0');
  
  return `${prefix}.${nextCounter}`;
};
