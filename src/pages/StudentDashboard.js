import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import JobCard from '../components/JobCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// --- NEW: Hired Details Form Component ---
const HiredForm = () => {
  const store = useStore();
  const formik = useFormik({
    initialValues: { company: '', title: '' },
    validationSchema: Yup.object({
      company: Yup.string().required('Company name is required'),
      title: Yup.string().required('Job title is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      store.submitHiredDetails(values);
      resetForm();
    },
  });

  return (
    <div className="form-container">
      <h3>Submit Placement Details</h3>
      <p>Got a job? Let us know!</p>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            onChange={formik.handleChange}
            value={formik.values.company}
          />
          {formik.errors.company && <div className="error">{formik.errors.company}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          {formik.errors.title && <div className="error">{formik.errors.title}</div>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

// --- NEW: Announcements Component ---
const Announcements = observer(() => {
  const { announcements } = useStore();
  return (
    <div className="announcements-container">
      <h3>Announcements & Updates</h3>
      {announcements.map(item => (
        <div className="card announcement-card" key={item.id}>
          <h4>{item.title}</h4>
          <span className="date">{item.date}</span>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
});

// --- Main Student Dashboard ---
const StudentDashboard = observer(() => {
  const store = useStore();

  const handleApply = (jobId) => {
    store.applyToJob(jobId);
    // Alert is now in the store action
  };

  return (
    <div className="student-dashboard-layout">
      {/* --- Column 1: Jobs --- */}
      <div className="job-listings">
        <h2>Available Jobs ({store.user.instituteKey})</h2>
        <div className="grid-container">
          {/* UPDATED: Use filteredJobs getter */}
          {store.filteredJobs.map((job) => {
            const isApplied = store.applications.some(
              (app) => app.studentId === store.user.id && app.jobId === job.id
            );
            return (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApply}
                isApplied={isApplied}
              />
            );
          })}
        </div>
      </div>

      {/* --- Column 2: Announcements & Hired Form --- */}
      <div className="student-sidebar">
        <Announcements />
        <HiredForm />
      </div>
    </div>
  );
});

export default StudentDashboard;