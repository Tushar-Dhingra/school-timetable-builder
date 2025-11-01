import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetableEntry extends Document {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  period: number;
  className: string;
  subject: string;
  teacher: string;
}

const TimetableEntrySchema = new Schema<ITimetableEntry>({
  day: {
    type: String,
    required: true,
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  period: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  className: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate entries for same class, day, period
TimetableEntrySchema.index({ className: 1, day: 1, period: 1 }, { unique: true });

export const TimetableEntry = mongoose.model<ITimetableEntry>('TimetableEntry', TimetableEntrySchema);