
export interface InventoryItem {
  id: string;
  stt: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InventoryRecord {
  id: string;
  date: string;
  recipientUnit: string;
  driverName: string;
  driverTripCost: number;
  items: InventoryItem[];
  grandTotal: number;
  notes?: string;
}

export type AppView = 'dashboard' | 'entry' | 'history' | 'debts';
