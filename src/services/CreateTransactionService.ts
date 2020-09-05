import { uuid } from 'uuidv4';
import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    let categoryExists = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryExists) {
      categoryExists = await categoriesRepository.save({
        id: uuid(),
        title: category,
      });
    }

    const { total } = await transactionsRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw new AppError('Cannot register a outcome higher than your balance.');
    }

    const transaction = transactionsRepository.create({
      id: uuid(),
      title,
      value,
      type,
      category: categoryExists,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
