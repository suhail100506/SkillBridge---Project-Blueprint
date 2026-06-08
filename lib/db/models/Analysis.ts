import mongoose, { Schema } from 'mongoose';
import { getModel } from '../mongoose';

const AnalysisSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  inputType: { type: String, enum: ['cv', 'manual'], required: true },
  rawInput: { type: String, required: true },
  extractedSkills: {
    strong: { type: [String], default: [] },
    developing: { type: [String], default: [] },
    transferable: { type: [String], default: [] },
    gaps: { type: [String], default: [] }
  },
  overallScore: { type: Number, default: 0 },
  recommendations: [
    {
      careerTitle: { type: String, required: true },
      careerSlug: { type: String, required: true },
      matchPercentage: { type: Number, required: true },
      whyItFits: { type: String, required: true },
      skillsYouHave: { type: [String], default: [] },
      skillsNeeded: { type: [String], default: [] },
      salaryRange: {
        min: { type: Number, required: true },
        mid: { type: Number, required: true },
        max: { type: Number, required: true },
        currency: { type: String, default: 'INR' }
      },
      demandGrowth: { type: Number, required: true },
      jobsDemandData: [
        {
          year: { type: Number, required: true },
          count: { type: Number, required: true }
        }
      ]
    }
  ],
  aiSummary: { type: String, default: '' },
  shareToken: { type: String, required: true }
}, {
  timestamps: true
});

const MongooseAnalysisModel = mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);

export const AnalysisModel = getModel('Analysis', MongooseAnalysisModel);
export default AnalysisModel;
