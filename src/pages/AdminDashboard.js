import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import JobCard from '../components/JobCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation for new job form
const JobSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required'),
  company: Yup.string().required('Company name is required'),
});

const AdminDashboard = observer(() => {
  const store = useStore();

  const formik = useFormik({
    // NEW: Enable re-initialization so the form updates when `editingJob` changes
    enableReinitialize: true,
    // NEW: Initial values now depend on whether we are editing or not
    initialValues: {
      title: store.editingJob?.title || '',
      company: store.editingJob?.company || '',
    },
    validationSchema: JobSchema,
    // NEW: onSubmit now checks if we are editing or adding
    onSubmit: (values, { resetForm }) => {
      if (store.editingJob) {
        // This is an Update
        store.updateJob({ ...store.editingJob, ...values });
      } else {
        // This is a Create
        store.addJob(values);
      }
      resetForm();
    },
  });

  return (
    <div className="admin-dashboard-layout">
      {/* --- Section 1: Add/Edit Job Form --- */}
      <div className="form-container">
        {/* NEW: Dynamic title */}
        <h2>{store.editingJob ? 'Edit Job' : 'Add New Job'}</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* ... (form fields are the same) ... */}
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              id="title"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="error">{formik.errors.title}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.company}
            />
            {formik.touched.company && formik.errors.company ? (
              <div className="error">{formik.errors.company}</div>
            ) : null}
          </div>

          {/* NEW: Dynamic button text */}
          <button type="submit">
            {store.editingJob ? 'Update Job' : 'Add Job'}
          </button>

          {/* NEW: Cancel Edit Button */}
          {store.editingJob && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                store.cancelEditing();
                formik.resetForm();
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
          {store.jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              // NEW: Pass editing and delete handlers
              onEdit={store.startEditing}
              onDelete={store.deleteJob}
            />
          ))}
        </div>
      </div>

      {/* --- Section 3: All Student Submissions --- */}
      <div className="submissions-container">
        <h2>Student Submissions</h2>
        {store.applicationsWithDetails.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>Date Applied</th>
              </tr>
            </thead>
            <tbody>
              {/* Use the computed getter from the store */}
              {store.applicationsWithDetails.map((app) => (
                <tr key={app.appId}>
                  <td>{app.studentName}</td>
                  <td>{app.jobTitle}</td>
                  <td>{app.company}</td>
                  <td>{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

export default AdminDashboard;