export type TransferHistory = {
  amount: number;
  datetime: string;
  hasSentMessage: boolean;
  id: string; // transfer_{index}
  index: number;
  isWithdrawn: boolean;
  remittee: string;
  remitter: string;
};
