export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  type: 'debit' | 'credit';
}

export interface Card {
  id: string;
  last4: string;
  expiry: string;
  balance: number;
  holder: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}