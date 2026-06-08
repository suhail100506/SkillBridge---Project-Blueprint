import mongoose, { Schema } from 'mongoose';
import { getModel } from '../mongoose';

const InternshipSchema = new Schema({
  company: { type: String, required: true },
  logo: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills_required: { type: [String], default: [] },
  skills_gained: { type: [String], default: [] },
  duration_weeks: { type: Number, required: true },
  remote: { type: Boolean, default: true },
  stipend: { type: Number, default: null }, // in INR, null means unpaid
  deadline: { type: Date, required: true },
  spots_total: { type: Number, default: 5 },
  spots_remaining: { type: Number, default: 5 },
  career_path: { type: [String], default: [] }, // matched career slug or titles
  apply_url: { type: String, default: '#' },
  verified: { type: Boolean, default: true }
}, {
  timestamps: true
});

const MongooseInternshipModel = mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);

export const InternshipModel = getModel('Internship', MongooseInternshipModel);
export default InternshipModel;
