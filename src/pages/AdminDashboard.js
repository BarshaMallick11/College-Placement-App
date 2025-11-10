import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import JobCard from '../components/JobCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// UPDATED: Added instituteKey
const JobSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required'),
  company: Yup.string().required('Company name is required'),
  instituteKey: Yup.string().required('Institute Key (e.g., AIT) is required'),
});

// --- NEW: Announcement Form Component ---
const AnnouncementForm = () => {
  const store = useStore();
  const formik = useFormik({
    initialValues: { title: '', content: '' },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      store.addAnnouncement(values);
      resetForm();
    },
  });

  return (
    <div className="form-container">
      <h2>Add Announcement</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          {formik.errors.title && <div className="error">{formik.errors.title}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            onChange={formik.handleChange}
            value={formik.values.content}
          />
          {formik.errors.content && <div className="error">{formik.errors.content}</div>}
        </div>
        <button type="submit">Post Announcement</button>
      </form>
    </div>
  );
};

// --- Main Admin Dashboard ---
const AdminDashboard = observer(() => {
  const store = useStore();

  const jobFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: store.editingJob?.title || '',
      company: store.editingJob?.company || '',
      instituteKey: store.editingJob?.instituteKey || '', // <-- NEW
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

  return (
    <>
      <div className="admin-dashboard-layout">
        {/* --- Section 1: Add/Edit Job Form --- */}
        <div className="form-container">
          <h2>{store.editingJob ? 'Edit Job' : 'Add New Job'}</h2>
          <form onSubmit={jobFormik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Job Title</label>
              <input
                id="title"
                name="title"
                onChange={jobFormik.handleChange}
                onBlur={jobFormik.handleBlur}
                value={jobFormik.values.title}
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
              />
              {jobFormik.touched.company && jobFormik.errors.company && (
                <div className="error">{jobFormik.errors.company}</div>
              )}
            </div>

            {/* --- NEW FIELD --- */}
            <div className="form-group">
              <label htmlFor="instituteKey">Institute Key (e.g., AIT, AGS)</label>
              <input
                id="instituteKey"
                name="instituteKey"
                onChange={jobFormik.handleChange}
                onBlur={jobFormik.handleBlur}
                value={jobFormik.values.instituteKey}
              />
              {jobFormik.touched.instituteKey && jobFormik.errors.instituteKey && (
                <div className="error">{jobFormik.errors.instituteKey}</div>
              )}
            </div>
            
            <button type="submit">
              {store.editingJob ? 'Update Job' : 'Add Job'}
            </button>
            {store.editingJob && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  store.cancelEditing();
                  jobFormik.resetForm();
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* --- Section 2: Current Job Postings (with Edit/Delete) --- */}
        <div className="job-listings">
          <h2>Current Job Postings</h2>
          <div className="grid-container">
            {/* UPDATED: Use filteredJobs to see all jobs */}
            {store.filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={store.startEditing}
                onDelete={store.deleteJob}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- NEW SECTION: Stats & Announcements --- */}
      <div className="admin-reports-layout">
        <AnnouncementForm />

        <div className="stats-container">
          <h2>Application Stats</h2>
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Total Applications</th>
              </tr>
            </thead>
            <tbody>
              {store.applicationStatsByBranch.map(([branch, count]) => (
                <tr key={branch}>
                  <td>{branch}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- UPDATED Section 3: All Student Submissions --- */}
      <div className="submissions-container">
        <h2>Student Submissions</h2>
        {store.applicationsWithDetails.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table className="submissions-table">
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
                  <td>{app.studentName}</td>
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
        )}
      </div>

      {/* --- NEW Section 4: Hired Students --- */}
      <div className="submissions-container">
        <h2>Placed Student Details</h2>
        <table className="submissions-table">
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
                <td>{item.studentName}</td>
                <td>{item.company}</td>
                <td>{item.title}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default AdminDashboard;