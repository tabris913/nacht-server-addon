export type TransferHistory = {
  amount: number;
  datetime: string;
  hasSentMessage: boolean;
  id: string; // transfer_{index}
  index: number;
  isWithdrawn: boolean;
  memo: string;
  remittee: string;
  remitter: string;
  withdrawnDatetime?: string;
};
