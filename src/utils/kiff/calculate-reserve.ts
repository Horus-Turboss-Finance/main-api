import { BankFindReturnType } from "../../models/bankAccount.models";
import { BankLiquidityType, LIQUIITY_ACCOUNT_TYPES } from "../../types/bank-account.types";

export function calculateReserve(accounts: BankFindReturnType[]): number {
  return accounts.reduce((sum, account) => {
    if (LIQUIITY_ACCOUNT_TYPES.includes(account.type as BankLiquidityType)) {
      return sum + (Number(account.balance) || 0);
    }
    return sum;
  }, 0);
}