import mongoose, { Schema } from 'mongoose';
import { getModel } from '../mongoose';

const CareerSkillSchema = new Schema({
  name: { type: String, required: true },
  priority: { type: String, enum: ['must', 'nice'], default: 'must' },
  learningHours: { type: Number, default: 10 }
});

const SalaryBandSchema = new Schema({
  entry: { type: Number, required: true },
  mid: { type: Number, required: true },
  senior: { type: Number, required: true },
  lead: { type: Number, required: true }
});

const DemandTrendItemSchema = new Schema({
  year: { type: Number, required: true },
  indexValue: { type: Number, required: true }
});

const CareerSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  typicalDayDescription: { type: String, required: true },
  salaryIndia: { type: SalaryBandSchema, required: true },
  salaryGlobal: { type: SalaryBandSchema, required: true },
  demandTrend: [DemandTrendItemSchema],
  demandGrowthRate: { type: Number, required: true },
  remotePercentage: { type: Number, required: true },
  requiredSkills: [CareerSkillSchema],
  topCertifications: { type: [String], default: [] },
  topHiringCompanies: { type: [String], default: [] },
  relatedCareers: { type: [String], default: [] },
  tags: { type: [String], default: [] }
}, {
  timestamps: true
});

const MongooseCareerModel = mongoose.models.Career || mongoose.model('Career', CareerSchema);

export const CareerModel = getModel('Career', MongooseCareerModel);
export default CareerModel;
