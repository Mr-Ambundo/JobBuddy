import { create } from 'zustand';
import { Job } from '../types';

interface JobState {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  removeJob: (id: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  updateJob: (id, updatedJob) => set((state) => ({
    jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updatedJob } : job))
  })),
  removeJob: (id) => set((state) => ({
    jobs: state.jobs.filter((job) => job.id !== id)
  }))
}));