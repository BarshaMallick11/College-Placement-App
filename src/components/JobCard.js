import React from 'react';

// This component now handles 3 scenarios:
// 1. Student view (onApply, isApplied)
// 2. Admin view (onEdit, onDelete)
// 3. Default view (no buttons)
const JobCard = ({ job, onApply, isApplied, onEdit, onDelete }) => {
  return (
    <div className="card">
      <h4>{job.title}</h4>
      <p>{job.company}</p>

      {/* --- Student View --- */}
      {onApply && (
        <button
          onClick={() => onApply(job.id)}
          disabled={isApplied}
          className={isApplied ? 'applied-btn' : ''}
        >
          {isApplied ? 'Applied' : 'Apply'}
        </button>
      )}

      {/* --- Admin View --- */}
      {onEdit && onDelete && (
        <div className="admin-controls">
          <button className="edit-btn" onClick={() => onEdit(job)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(job.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;