import { isUuid } from 'uuidv4';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestDeleteTransactionDTO {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: RequestDeleteTransactionDTO): Promise<void> {
    if (!isUuid(id)) {
      throw new AppError('Invalid transaction ID');
    }

    const transactionRepository = await getCustomRepository(
      TransactionRepository,
    );

    const isTransaction = await transactionRepository.findOne(id);

    if (!isTransaction) {
      throw new AppError('Transaction not found');
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
