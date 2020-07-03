import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: RequestTransactionDTO): Promise<Transaction | undefined> {
    const transactionTypes = ['income', 'outcome'];

    if (!transactionTypes.includes(type)) {
      throw new AppError('Invalid transaction type.');
    }

    const transactionRepository = await getCustomRepository(
      TransactionRepository,
    );

    const { total: balance } = await transactionRepository.getBalance();

    if (type === 'outcome' && balance < value) {
      throw new AppError('Insufficient funds');
    }

    let categoryData;

    if (category) {
      const categoryRepository = getRepository(Category);
      categoryData = await categoryRepository.findOne({
        where: { title: category },
      });

      if (!categoryData) {
        categoryData = await categoryRepository.create({ title: category });
        await categoryRepository.save(categoryData);
      }
    }

    const transactionData = await transactionRepository.create({
      title,
      type,
      value,
      category: categoryData,
    });

    await transactionRepository.save(transactionData);

    const transaction = await transactionRepository.findOne({
      where: { id: transactionData.id },
      relations: ['category'],
    });

    return transaction;
  }
}

export default CreateTransactionService;
