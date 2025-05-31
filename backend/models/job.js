import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // the poster
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  company: { type: String },
  requirements: { type: [String], required: true },  // example: ['Bachelor’s Degree', '2 years experience']
  salaryRange: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
}, { timestamps: true });


export default mongoose.model('Job', jobSchema);
