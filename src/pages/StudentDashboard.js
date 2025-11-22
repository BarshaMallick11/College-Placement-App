import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import JobCard from '../components/JobCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation schema
const PlacementSchema = Yup.object().shape({
  company: Yup.string().required('Company name is required'),
  title: Yup.string().required('Job title is required'),
});

const StudentDashboard = observer(() => {
  const store = useStore();

  // Handle job application
  const handleApply = (jobId) => {
    store.applyToJob(jobId);
  };

  // Placement details form
  const placementFormik = useFormik({
    initialValues: { company: '', title: '' },
    validationSchema: PlacementSchema,
    onSubmit: (values, { resetForm }) => {
      store.submitHiredDetails(values);
      resetForm();
    },
  });

  return (
    <div className="admin-dashboard"> {/* Reusing admin dashboard class for consistency */}
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p className="dashboard-subtitle">
          Discover job opportunities, track your applications, and stay updated with announcements
        </p>
      </div>

      {/* Section 1: Announcements */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Announcements & Updates</h2>
          <p className="section-description">
            Stay informed about important placement news, upcoming drives, and deadlines
          </p>
        </div>

        <div className="section-content">
          {store.announcements.length === 0 ? (
            <div className="empty-state">
              <p>No announcements at this time.</p>
            </div>
          ) : (
            <div className="announcements-list">
              {store.announcements.map((item) => (
                <div className="announcement-card-modern" key={item.id}>
                  <div className="announcement-header">
                    <h4>{item.title}</h4>
                    <span className="announcement-date">{item.date}</span>
                  </div>
                  <p className="announcement-content">{item.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Available Jobs */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Available Job Opportunities</h2>
          <p className="section-description">
            Browse and apply to job openings from {store.user?.instituteKey} institute. Click "Apply" to submit your resume.
          </p>
        </div>

        <div className="section-content">
          <div className="job-postings-list">
            <h3>Open Positions ({store.filteredJobs.length})</h3>
            {store.filteredJobs.length === 0 ? (
              <div className="empty-state">
                <p>No job openings available at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="jobs-grid">
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
            )}
          </div>
        </div>
      </section>

      {/* Section 3: My Applications */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>My Applications</h2>
          <p className="section-description">
            Track the status of your job applications
          </p>
        </div>

        <div className="section-content">
          <div className="table-card">
            {store.applications.filter(app => app.studentId === store.user.id).length === 0 ? (
              <div className="empty-state">
                <p>You haven't applied to any jobs yet. Browse available opportunities above!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Job Title</th>
                      <th>Date Applied</th>
                      <th>Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.applications
                      .filter(app => app.studentId === store.user.id)
                      .map((app) => {
                        const job = store.jobs.find(j => j.id === app.jobId);
                        return (
                          <tr key={app.appId}>
                            <td>{job?.company || 'N/A'}</td>
                            <td>{job?.title || 'N/A'}</td>
                            <td>{app.date}</td>
                            <td>{app.resumeFileName}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Submit Placement Details - MOVED TO LAST */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Got Placed? Share Your Success!</h2>
          <p className="section-description">
            Congratulations on your placement! Share your achievement with the placement cell
          </p>
        </div>

        <div className="section-content">
          <div className="form-card" style={{ maxWidth: '600px' }}>
            <h3>Submit Placement Details</h3>
            <p className="form-description">
              Help us maintain accurate placement records by sharing your offer details
            </p>
            <form onSubmit={placementFormik.handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">Company Name</label>
                  <input
                    id="company"
                    name="company"
                    onChange={placementFormik.handleChange}
                    value={placementFormik.values.company}
                    placeholder="e.g., Google, Microsoft"
                  />
                  {placementFormik.errors.company && (
                    <div className="error">{placementFormik.errors.company}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="title">Job Title</label>
                  <input
                    id="title"
                    name="title"
                    onChange={placementFormik.handleChange}
                    value={placementFormik.values.title}
                    placeholder="e.g., Software Engineer"
                  />
                  {placementFormik.errors.title && (
                    <div className="error">{placementFormik.errors.title}</div>
                  )}
                </div>
              </div>

              <button type="submit" className="primary-btn">
                Submit Placement Details
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
});

export default StudentDashboard;