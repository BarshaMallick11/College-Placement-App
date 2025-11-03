import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../index';
import JobCard from '../components/JobCard';

const StudentDashboard = observer(() => {
  const store = useStore();

  const handleApply = (jobId) => {
    store.applyToJob(jobId);
    alert(`Applied to job ${jobId}!`);
  };

  return (
    <div>
      <h2>Available Jobs</h2>
      <div className="grid-container">
        {store.jobs.map((job) => {
          // Check if student has already applied
          const isApplied = store.applications.some(
            (app) =>
              app.studentId === store.user.id && app.jobId === job.id
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
  );
});

export default StudentDashboard;