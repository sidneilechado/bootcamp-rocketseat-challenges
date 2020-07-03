import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = transactions.reduce(
      (accountBalance: Balance, transaction: Transaction) => ({
        ...accountBalance,
        [transaction.type]:
          accountBalance[transaction.type] + transaction.value,
        total:
          transaction.type === 'outcome'
            ? accountBalance.total - transaction.value
            : accountBalance.total + transaction.value,
      }),
      {
        income: 0.00,
        outcome: 0.00,
        total: 0.00,
      },
    );

    return balance;
  }
}

export default TransactionsRepository;
