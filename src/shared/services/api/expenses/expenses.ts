import { AxiosResponse } from 'axios';

import type { CreateExpensePayload, Expense } from '@/shared/types/api/expenses';

import axiosInstance from '../../axios';
import REQUEST_URL from '../../request-url';

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await axiosInstance.get<Expense[], AxiosResponse<Expense[]>>(
    REQUEST_URL.EXPENSES.LIST
  );
  return response.data;
};

export const postExpense = async (payload: CreateExpensePayload): Promise<Expense> => {
  const response = await axiosInstance.post<Expense, AxiosResponse<Expense>>(
    REQUEST_URL.EXPENSES.CREATE,
    payload
  );
  return response.data;
};
