import mongoose, { Schema } from 'mongoose';
import { getModel } from '../mongoose';

const TaskResourceSchema = new Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  free: { type: Boolean, default: true }
});

const RoadmapTaskSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['watch', 'read', 'practice', 'build', 'network'], required: true },
  estimatedMinutes: { type: Number, required: true },
  resource: { type: TaskResourceSchema, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  xpReward: { type: Number, default: 10 }
});

const RoadmapWeekSchema = new Schema({
  weekNumber: { type: Number, required: true },
  theme: { type: String, required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  tasks: [RoadmapTaskSchema],
  milestone: { type: String, default: null },
  milestoneCompleted: { type: Boolean, default: false }
});

const RoadmapPhaseSchema = new Schema({
  phaseNumber: { type: Number, enum: [1, 2, 3], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDay: { type: Number, required: true },
  endDay: { type: Number, required: true },
  weeks: [RoadmapWeekSchema]
});

const RoadmapSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  analysisId: { type: Schema.Types.ObjectId, ref: 'Analysis', required: false },
  targetCareer: { type: String, required: true },
  targetCareerSlug: { type: String, required: true },
  totalDays: { type: Number, default: 90 },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  overallProgress: { type: Number, default: 0 },
  currentDay: { type: Number, default: 1 },
  phases: [RoadmapPhaseSchema],
  totalXP: { type: Number, default: 0 },
  earnedXP: { type: Number, default: 0 }
}, {
  timestamps: true
});

const MongooseRoadmapModel = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);

export const RoadmapModel = getModel('Roadmap', MongooseRoadmapModel);
export default RoadmapModel;
