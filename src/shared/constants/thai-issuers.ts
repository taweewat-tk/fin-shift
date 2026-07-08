export const THAI_CARD_ISSUERS = [
  'KBank',
  'SCB',
  'KTC',
  'Citi',
  'Bangkok Bank',
  'Krungsri',
  'TTB',
  'UOB',
  'GSB',
] as const;

export type ThaiCardIssuer = (typeof THAI_CARD_ISSUERS)[number];
