import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface BalanceDTO {
  income: number;
  outcome: number;
  total: number;
}

interface AccountBalance {
  transactions: Transaction[];
  balance: BalanceDTO;
}

class ListTrasactionService {
  private transactionRepository: TransactionsRepository;

  constructor(transactionRepository: TransactionsRepository) {
    this.transactionRepository = transactionRepository;
  }

  public execute(): AccountBalance {
    const accountBalance: AccountBalance = {
      transactions: this.transactionRepository.all(),
      balance: this.transactionRepository.getBalance(),
    };

    return accountBalance;
  }
}

export default ListTrasactionService;
