import { makeAutoObservable, runInAction } from 'mobx';
import { MOCK_JOBS, MOCK_STUDENTS, MOCK_ADMIN } from '../data/mockData';

class PlacementStore {
  // --- Observables (State) ---
  user = null; // { id, email, name, role }
  jobs = MOCK_JOBS;
  students = MOCK_STUDENTS;
  applications = []; // NEW: To track submissions
  editingJob = null; // NEW: To track which job is being edited

  constructor() {
    makeAutoObservable(this);
  }

  // --- Computed (Derived State) ---
  get isAuthenticated() {
    return !!this.user;
  }

  get userRole() {
    return this.user?.role;
  }

  // NEW: A computed getter to "join" data for the admin view
  get applicationsWithDetails() {
    return this.applications.map((app) => {
      const student = this.students.find((s) => s.id === app.studentId);
      const job = this.jobs.find((j) => j.id === app.jobId);
      return {
        ...app,
        studentName: student?.name || 'Unknown Student',
        jobTitle: job?.title || 'Deleted Job',
        company: job?.company || 'N/A',
      };
    });
  }

  // --- Actions (Mutate State) ---
  loginUser = (email, password, role) => {
    if (role === 'admin') {
      // Only check admin credentials
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        runInAction(() => {
          this.user = { ...MOCK_ADMIN, role: 'admin' };
        });
        return true;
      }
    } else if (role === 'student') {
      // Only check student credentials
      const student = this.students.find(
        (s) => s.email === email && s.password === password
      );
      if (student) {
        runInAction(() => {
          this.user = {
            id: student.id,
            name: student.name,
            email: student.email,
            role: 'student',
          };
        });
        return true;
      }
    }

    return false; // Login failed
  };

  logout = () => {
    this.user = null;
    this.editingJob = null; 
  };

  addJob = (job) => {
    const newJob = {
      id: Math.max(...this.jobs.map((j) => j.id)) + 1, // Safer ID
      ...job,
    };
    runInAction(() => {
      this.jobs.push(newJob);
    });
  };

  // --- NEW ACTIONS ---

  // Called by Student
  applyToJob = (jobId) => {
    const studentId = this.user.id;
    // Prevent duplicate applications
    const alreadyApplied = this.applications.some(
      (app) => app.studentId === studentId && app.jobId === jobId
    );

    if (!alreadyApplied) {
      runInAction(() => {
        this.applications.push({
          appId: this.applications.length + 1,
          studentId,
          jobId,
          date: new Date().toLocaleDateString(),
        });
      });
    }
  };

  // Called by Admin
  deleteJob = (jobId) => {
    runInAction(() => {
      this.jobs = this.jobs.filter((job) => job.id !== jobId);
      // Also remove applications for this job if you want
      // this.applications = this.applications.filter(app => app.jobId !== jobId);
    });
  };

  // Called by Admin
  startEditing = (job) => {
    // Set the job to be edited
    this.editingJob = job;
  };

  // Called by Admin
  cancelEditing = () => {
    this.editingJob = null;
  };

  // Called by Admin
  updateJob = (updatedJobData) => {
    runInAction(() => {
      const index = this.jobs.findIndex((j) => j.id === updatedJobData.id);
      if (index !== -1) {
        this.jobs[index] = updatedJobData;
      }
      this.editingJob = null; // Clear editing state
    });
  };
}

export const placementStore = new PlacementStore();