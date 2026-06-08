import mongoose, { Schema } from 'mongoose';
import { getModel } from '../mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  provider: { type: String, enum: ['google', 'credentials'], default: 'credentials' },
  currentJobTitle: { type: String, default: '' },
  industry: { type: String, default: '' },
  yearsExperience: { type: Number, default: 0 },
  education: { type: String, default: '' },
  skills: {
    technical: { type: [String], default: [] },
    soft: { type: [String], default: [] },
    domain: { type: [String], default: [] },
    tools: { type: [String], default: [] }
  },
  location: { type: String, default: '' },
  preferredWorkType: { type: String, enum: ['remote', 'hybrid', 'onsite'], default: 'remote' },
  hoursPerWeekForLearning: { type: Number, default: 5 },
  targetSalaryMin: { type: Number, default: 0 },
  targetSalaryMax: { type: Number, default: 0 },
  xpPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  badges: { type: [String], default: [] }
}, {
  timestamps: true
});

const MongooseUserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export const UserModel = getModel('User', MongooseUserModel);
export default UserModel;
