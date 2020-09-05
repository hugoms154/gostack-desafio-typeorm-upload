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
    // TODO
    const transactions = await this.find();

    const incomes: number[] = [];
    let income = 0;
    const outcomes: number[] = [];
    let outcome = 0;

    transactions.forEach((transaction: Transaction) => {
      return transaction.type === 'income'
        ? incomes.push(Number(transaction.value))
        : outcomes.push(Number(transaction.value));
    });

    if (incomes.length > 0) {
      income = incomes.reduce((first, second) => {
        // const total: number = Number(first) + Number(second);
        const total: number = first + second;
        return total;
      });
    }
    if (outcomes.length > 0) {
      outcome = outcomes.reduce((first, second) => {
        // const total: number = Number(first) + Number(second);
        const total: number = first + second;
        return total;
      });
    }

    const total = income - outcome;

    return { income, outcome, total };
    // return {
    //   income: Number(income),
    //   outcome: Number(outcome),
    //   total: Number(total),
    // };
  }
}

export default TransactionsRepository;
