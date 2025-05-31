import Application from '../models/application.js';
import Notification from '../models/notifications.js';

export const apply = async (req, res) => {
  try {
    const { targetId, targetModel, applicationMessage } = req.body;
    const applicant = req.user.id;

    const newApplication = await Application.create({
      applicant,
      target: targetId,
      targetModel,
      applicationMessage,
    });

    // Create Notification
    await Notification.create({
      recipient: targetModel === 'Job' ? (await Job.findById(targetId)).employer : targetId,
      type: 'New Application',
      message: 'You have a new application.',
    });

    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getApplicationsForTarget = async (req, res) => {
  try {
    const { id } = req.params; // jobId or mentorId
    const applications = await Application.find({ target: id }).populate('applicant', 'name email');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; // applicationId
    const { status } = req.body;

    const updatedApplication = await Application.findByIdAndUpdate(id, { status }, { new: true });

    // Notify applicant
    await Notification.create({
      recipient: updatedApplication.applicant,
      type: 'Application Status Update',
      message: `Your application status has been updated to: ${status}`,
    });

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
