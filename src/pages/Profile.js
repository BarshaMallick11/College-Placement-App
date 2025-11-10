import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import { useFormik } from 'formik';

// Helper component for the form
const ResumeUploadForm = observer(() => {
  const store = useStore();
  const currentResume = store.studentResumes.get(store.user.id);

  const formik = useFormik({
    initialValues: {
      resumeFile: null,
    },
    onSubmit: (values, { resetForm }) => {
      // In a real app, you'd upload values.resumeFile
      // Here, we just store the file name.
      store.uploadResume(values.resumeFile.name);
      resetForm();
    },
  });

  return (
    <div className="form-container">
      <h2>Upload Your Resume</h2>
      <p>
        A resume on file will be used for "Quick Apply."
      </p>
      {currentResume && (
        <p><strong>Current Resume:</strong> {currentResume}</p>
      )}

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="resumeFile">Resume (PDF)</label>
          <input
            id="resumeFile"
            name="resumeFile"
            type="file"
            // Formik needs help with file inputs
            onChange={(event) => {
              formik.setFieldValue("resumeFile", event.currentTarget.files[0]);
            }}
          />
        </div>
        <button type="submit" disabled={!formik.values.resumeFile}>
          Upload
        </button>
      </form>
    </div>
  );
});


// Main component for the page
const Profile = observer(() => {
  const { user } = useStore();

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="card profile-details">
        <h3>{user.name}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Institute:</strong> {user.instituteKey}</p>
        <p><strong>Branch:</strong> {user.branch}</p>
      </div>
      
      <ResumeUploadForm />

    </div>
  );
});

export default Profile;