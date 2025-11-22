import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import JobCard from '../components/JobCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Job validation schema
const JobSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required'),
  company: Yup.string().required('Company name is required'),
  instituteKey: Yup.string().required('Institute Key (e.g., AIT) is required'),
  description: Yup.string().required('Job description is required'),
});

// Announcement validation schema
const AnnouncementSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
});

const AdminDashboard = observer(() => {
  const store = useStore();

  // Job form handler
  const jobFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: store.editingJob?.title || '',
      company: store.editingJob?.company || '',
      instituteKey: store.editingJob?.instituteKey || '',
      description: store.editingJob?.description || '',
    },
    validationSchema: JobSchema,
    onSubmit: (values, { resetForm }) => {
      if (store.editingJob) {
        store.updateJob({ ...store.editingJob, ...values });
      } else {
        store.addJob(values);
      }
      resetForm();
    },
  });

  // Announcement form handler
  const announcementFormik = useFormik({
    initialValues: { title: '', content: '' },
    validationSchema: AnnouncementSchema,
    onSubmit: (values, { resetForm }) => {
      store.addAnnouncement(values);
      resetForm();
    },
  });

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage job postings, announcements, and track student applications</p>
      </div>

      {/* Section 1: Job Management */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Job Management</h2>
          <p className="section-description">Create and manage job postings for your institution</p>
        </div>

        <div className="section-content">
          {/* Add/Edit Job Form */}
          <div className="form-card">
            <h3>{store.editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h3>
            <form onSubmit={jobFormik.handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Job Title</label>
                  <input
                    id="title"
                    name="title"
                    onChange={jobFormik.handleChange}
                    onBlur={jobFormik.handleBlur}
                    value={jobFormik.values.title}
                    placeholder="e.g., Software Engineer Intern"
                  />
                  {jobFormik.touched.title && jobFormik.errors.title && (
                    <div className="error">{jobFormik.errors.title}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    onChange={jobFormik.handleChange}
                    onBlur={jobFormik.handleBlur}
                    value={jobFormik.values.company}
                    placeholder="e.g., TechCorp"
                  />
                  {jobFormik.touched.company && jobFormik.errors.company && (
                    <div className="error">{jobFormik.errors.company}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="instituteKey">Institute Key</label>
                  <input
                    id="instituteKey"
                    name="instituteKey"
                    onChange={jobFormik.handleChange}
                    onBlur={jobFormik.handleBlur}
                    value={jobFormik.values.instituteKey}
                    placeholder="e.g., AIT, AIGS"
                  />
                  {jobFormik.touched.instituteKey && jobFormik.errors.instituteKey && (
                    <div className="error">{jobFormik.errors.instituteKey}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Job Description</label>
                <textarea
                  id="description"
                  name="description"
                  onChange={jobFormik.handleChange}
                  onBlur={jobFormik.handleBlur}
                  value={jobFormik.values.description}
                  placeholder="Enter job description, responsibilities, requirements, etc."
                  rows="5"
                />
                {jobFormik.touched.description && jobFormik.errors.description && (
                  <div className="error">{jobFormik.errors.description}</div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  {store.editingJob ? 'Update Job' : 'Create Job'}
                </button>
                {store.editingJob && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      store.cancelEditing();
                      jobFormik.resetForm();
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Current Job Postings */}
          <div className="job-postings-list">
            <h3>Current Job Postings ({store.filteredJobs.length})</h3>
            {store.filteredJobs.length === 0 ? (
              <div className="empty-state">
                <p>No job postings yet. Create your first job posting above.</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {store.filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={store.startEditing}
                    onDelete={store.deleteJob}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Announcements & Stats */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Communications & Analytics</h2>
          <p className="section-description">Post announcements and view application statistics</p>
        </div>

        <div className="section-grid">
          {/* Announcement Form */}
          <div className="form-card">
            <h3>Post Announcement</h3>
            <form onSubmit={announcementFormik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="announcement-title">Title</label>
                <input
                  id="announcement-title"
                  name="title"
                  onChange={announcementFormik.handleChange}
                  value={announcementFormik.values.title}
                  placeholder="e.g., New Placement Drive"
                />
                {announcementFormik.errors.title && (
                  <div className="error">{announcementFormik.errors.title}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="announcement-content">Content</label>
                <textarea
                  id="announcement-content"
                  name="content"
                  onChange={announcementFormik.handleChange}
                  value={announcementFormik.values.content}
                  placeholder="Enter announcement details..."
                  rows="4"
                />
                {announcementFormik.errors.content && (
                  <div className="error">{announcementFormik.errors.content}</div>
                )}
              </div>

              <button type="submit" className="primary-btn">Post Announcement</button>
            </form>
          </div>

          {/* Application Stats */}
          <div className="stats-card">
            <h3>Application Statistics</h3>
            {store.applicationStatsByBranch.length === 0 ? (
              <div className="empty-state">
                <p>No applications yet.</p>
              </div>
            ) : (
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Applications</th>
                  </tr>
                </thead>
                <tbody>
                  {store.applicationStatsByBranch.map(([branch, count]) => (
                    <tr key={branch}>
                      <td>{branch}</td>
                      <td className="stat-number">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Student Submissions */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Student Applications</h2>
          <p className="section-description">View and manage student job applications</p>
        </div>

        <div className="section-content">
          <div className="table-card">
            {store.applicationsWithDetails.length === 0 ? (
              <div className="empty-state">
                <p>No student applications yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Branch</th>
                      <th>Institute</th>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Date Applied</th>
                      <th>Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.applicationsWithDetails.map((app) => (
                      <tr key={app.appId}>
                        <td className="student-name">{app.studentName}</td>
                        <td>{app.studentBranch}</td>
                        <td>{app.studentInstitute}</td>
                        <td>{app.jobTitle}</td>
                        <td>{app.company}</td>
                        <td>{app.date}</td>
                        <td>{app.resume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Placement Records */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Placement Records</h2>
          <p className="section-description">Students who have successfully secured positions</p>
        </div>

        <div className="section-content">
          <div className="table-card">
            {store.hiredStudents.length === 0 ? (
              <div className="empty-state">
                <p>No placement records yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Company</th>
                      <th>Job Title</th>
                      <th>Date Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.hiredStudents.map((item) => (
                      <tr key={item.id}>
                        <td className="student-name">{item.studentName}</td>
                        <td>{item.company}</td>
                        <td>{item.title}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
});

export default AdminDashboard;