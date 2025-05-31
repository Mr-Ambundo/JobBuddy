import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['New Application', 'Application Status Update', 'Profile Update', 'System Message'], 
    required: true 
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String }, // optional: link to view more about notification
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });


export default mongoose.model('Notification', notificationSchema);
