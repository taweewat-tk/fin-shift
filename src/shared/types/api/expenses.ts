export interface Expense {
  id: string;
  userId: string;
  cardId: string;
  categoryId: string;
  amount: string;
  date: string;
  merchant: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  amount: number;
  date: string;
  cardId: string;
  categoryId: string;
  merchant?: string | null;
  note?: string | null;
}
