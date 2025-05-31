import Job from '../models/job.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, location, company, requirements } = req.body;

    if (!title || !description || !location || !company || !requirements) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = await Job.create({
      title,
      description,
      location,
      company,
      requirements,
      employer: req.user.userId, // from authMiddleware
    });

    res.status(201).json({
      title: newJob.title,
      description: newJob.description,
      location: newJob.location,
      company: newJob.category,
      requirements: newJob.deadline,
      employer: newJob.employer,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error: error.message });
  }
};


export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 15; // Default 15 jobs per page
    const skip = (page - 1) * limit;

    const jobs = await Job.find()
      .populate('employer', 'name email')
      .sort({ createdAt: -1 }) // Newest jobs first
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(); // Get total number of jobs

    res.status(200).json({ jobs, totalJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate('employer', 'name email');

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: 'Job deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
