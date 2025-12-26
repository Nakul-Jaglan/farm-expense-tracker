import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['farm', 'garden']
  },
  item: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  remarks: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
ExpenseSchema.index({ userId: 1, category: 1 });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
