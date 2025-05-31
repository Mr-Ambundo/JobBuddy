export interface Job {
  createdAt: string | number | Date;
  _id: string;
  category: any;
  salaryRange: string;
  creatorId: string | undefined;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  isPWDFriendly: boolean;
  employer: string;
  postedDate?: string;
  applicants?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer' | 'mentor';
  skills: string[];
  isPWD?: boolean;
  profession?: string;
  bio?: string;
  location?: string;
  experience?: string[];
  education?: string[];
  company?: string;
  position?: string;
  menteeCapacity?: number;
  specialization?: string[];
  contactNumber?: string;
  profileImage?: string;
}

export interface Mentor {
  id: string;
  name: string;
  profession: string;
  expertise: string[];
  availability: boolean;
  bio?: string;
  experience?: string[];
  totalMentees?: number;
  rating?: number;
  profileImage?: string;
}

export interface MenteeApplication {
  id: string;
  menteeId: string;
  menteeName: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  date: string;
  skills: string[];
  isPWD?: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: string;
  user: User;
}