
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Fruits', 'Vegetables', 'Grains & Cereals', 'Dairy Products', 'Livestock & Poultry', 'Seeds & Seedlings', 'Fertilizers & Pesticides', 'Farm Equipment', 'Other'],
    required: true 
  },
  stockQuantity: { type: Number, required: true },
  availabilityStatus: { type: Boolean, default: true },
  image: { type: String }, // Path to uploaded image
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' } // Admin approval
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
