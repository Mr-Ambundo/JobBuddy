import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetModel', required: true }, 
  targetModel: { type: String, enum: ['Job', 'User'], required: true }, 
  // 'Job' if applying for job, 'User' if applying for mentor
  status: { 
    type: String, 
    enum: ['Under Review', 'Interviewing', 'Rejected', 'Accepted'], 
    default: 'Under Review' 
  },
  applicationMessage: { type: String },  // optional short message or note
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);