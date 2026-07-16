export interface Card {
  id: string;
  userId: string;
  name: string;
  issuer: string;
  last4: string;
  creditLimit: string;
  statementClosingDay: number;
  graceDays: number;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardPayload {
  name: string;
  issuer: string;
  last4: string;
  creditLimit: number;
  statementClosingDay: number;
  graceDays: number;
  color?: string | null;
}
