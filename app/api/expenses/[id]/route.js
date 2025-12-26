import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

// PUT - Update an expense
export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { item, totalAmount, amountPaid, balance, remarks, date } = body;

    // Verify the expense belongs to the user
    const existingExpense = await Expense.findById(id);

    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    if (existingExpense.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        item,
        totalAmount: parseFloat(totalAmount),
        amountPaid: parseFloat(amountPaid),
        balance: parseFloat(balance),
        remarks: remarks || '',
        date
      },
      { new: true }
    );

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

// DELETE - Delete an expense
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    // Verify the expense belongs to the user
    const existingExpense = await Expense.findById(id);

    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    if (existingExpense.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Expense.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
