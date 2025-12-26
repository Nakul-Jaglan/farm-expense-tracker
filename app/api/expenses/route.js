import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

// GET - Fetch all expenses for the authenticated user
export async function GET(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query = { userId };
    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 }).lean();

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// POST - Create a new expense
export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { category, item, totalAmount, amountPaid, balance, remarks, date } = body;

    if (!category || !item || totalAmount === undefined || amountPaid === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const expense = await Expense.create({
      userId,
      category,
      item,
      totalAmount: parseFloat(totalAmount),
      amountPaid: parseFloat(amountPaid),
      balance: parseFloat(balance),
      remarks: remarks || '',
      date
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
