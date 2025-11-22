import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import { useFormik } from 'formik';

const Profile = observer(() => {
  const store = useStore();
  const { user } = store;
  const currentResume = store.studentResumes.get(store.user.id);

  // Resume upload form
  const resumeFormik = useFormik({
    initialValues: {
      resumeFile: null,
    },
    onSubmit: (values, { resetForm }) => {
      store.uploadResume(values.resumeFile.name);
      resetForm();
    },
  });

  return (
    <div className="admin-dashboard"> {/* Reusing admin dashboard styles */}
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p className="dashboard-subtitle">
          Manage your personal information and upload your resume for quick job applications
        </p>
      </div>

      {/* Section 1: Personal Information */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Personal Information</h2>
          <p className="section-description">
            Your profile details as registered with the placement cell
          </p>
        </div>

        <div className="section-content">
          <div className="profile-info-card">
            {/* Profile Avatar/Initial */}
            <div className="profile-avatar">
              <span className="avatar-initial">{user.name?.charAt(0).toUpperCase()}</span>
            </div>

            {/* Profile Details Grid */}
            <div className="profile-info-grid">
              <div className="info-item">
                <label className="info-label">Full Name</label>
                <p className="info-value">{user.name}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Email Address</label>
                <p className="info-value">{user.email}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Institute</label>
                <p className="info-value">{user.instituteKey}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Branch</label>
                <p className="info-value">{user.branch || 'Not specified'}</p>
              </div>

              {user.id && (
                <div className="info-item">
                  <label className="info-label">Student ID</label>
                  <p className="info-value">{user.id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Resume Management */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Resume Management</h2>
          <p className="section-description">
            Upload and manage your resume for one-click job applications
          </p>
        </div>

        <div className="section-content">
          {/* Current Resume Status */}
          {currentResume && (
            <div className="resume-status-card">
              <div className="resume-status-header">
                <div className="resume-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="resume-info">
                  <h4>Current Resume</h4>
                  <p>{currentResume}</p>
                </div>
                <div className="resume-badge">
                  <span className="status-badge status-active">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Upload Resume Form */}
          <div className="form-card" style={{ maxWidth: '600px' }}>
            <h3>{currentResume ? 'Update Resume' : 'Upload Resume'}</h3>
            <p className="form-description">
              {currentResume
                ? 'Replace your current resume with a new version'
                : 'Upload your resume to enable quick applications to job postings'}
            </p>

            <form onSubmit={resumeFormik.handleSubmit}>
              <div className="file-upload-area">
                <div className="file-upload-input">
                  <label htmlFor="resumeFile" className="file-upload-label">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span className="file-upload-text">
                      {resumeFormik.values.resumeFile
                        ? resumeFormik.values.resumeFile.name
                        : 'Click to select or drag and drop your resume'}
                    </span>
                    <span className="file-upload-hint">PDF, DOC, DOCX (Max 5MB)</span>
                  </label>
                  <input
                    id="resumeFile"
                    name="resumeFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="file-input-hidden"
                    onChange={(event) => {
                      resumeFormik.setFieldValue("resumeFile", event.currentTarget.files[0]);
                    }}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={!resumeFormik.values.resumeFile}
                >
                  {currentResume ? 'Update Resume' : 'Upload Resume'}
                </button>
                {resumeFormik.values.resumeFile && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      resumeFormik.resetForm();
                      document.getElementById('resumeFile').value = '';
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Section 3: Quick Stats (if applicable) */}
      {store.applications && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Application Activity</h2>
            <p className="section-description">
              Your application statistics at a glance
            </p>
          </div>

          <div className="section-content">
            <div className="stats-grid-profile">
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Applications</p>
                  <p className="stat-value">
                    {store.applications.filter(app => app.studentId === user.id).length}
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Resume Status</p>
                  <p className="stat-value">{currentResume ? 'Uploaded' : 'Not Uploaded'}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Profile Status</p>
                  <p className="stat-value">Active</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
});

export default Profile;