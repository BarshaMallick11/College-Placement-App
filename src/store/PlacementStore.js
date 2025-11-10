import { makeAutoObservable, runInAction } from 'mobx';
import { MOCK_JOBS, MOCK_STUDENTS, MOCK_ADMIN } from '../data/mockData';

class PlacementStore {
  // --- Observables (State) ---
  user = null; // Will now store the full user object
  jobs = MOCK_JOBS;
  students = MOCK_STUDENTS;
  applications = []; // { appId, studentId, jobId, date, resumeFileName }
  editingJob = null; 

  // --- NEW OBSERVABLES ---
  announcements = [
    { id: 1, date: '10/11/2025', title: 'Welcome!', content: 'Welcome to the new placement portal. Students from AIT and AIGS can now use this.' }
  ];
  hiredStudents = []; // { id, studentName, company, title, date }
  studentResumes = new Map(); // { studentId => 'resume.pdf' }

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

  // NEW: Filters jobs based on the logged-in user's institute
  get filteredJobs() {
    if (this.user?.role === 'admin') {
      // Admin sees all jobs for now, but could be filtered too
      return this.jobs;
    }
    if (this.user?.role === 'student') {
      return this.jobs.filter(job => job.instituteKey === this.user.instituteKey);
    }
    return [];
  }

  // UPDATED: Now includes resume and student details
  get applicationsWithDetails() {
    return this.applications.map((app) => {
      const student = this.students.find((s) => s.id === app.studentId);
      const job = this.jobs.find((j) => j.id === app.jobId);
      return {
        ...app,
        studentName: student?.name || 'Unknown Student',
        studentBranch: student?.branch || 'N/A',
        studentInstitute: student?.instituteKey || 'N/A',
        jobTitle: job?.title || 'Deleted Job',
        company: job?.company || 'N/A',
        resume: app.resumeFileName || 'No Resume',
      };
    });
  }

  // NEW: Calculates application stats by branch
  get applicationStatsByBranch() {
    const stats = {}; // { 'Computer Science': 2, 'Electronics': 1 }
    this.applications.forEach(app => {
      const student = this.students.find(s => s.id === app.studentId);
      if (student) {
        const branch = student.branch;
        stats[branch] = (stats[branch] || 0) + 1;
      }
    });
    // Convert to array for easy mapping: [['Computer Science', 2], ['Electronics', 1]]
    return Object.entries(stats);
  }

  // --- Actions (Mutate State) ---

  // UPDATED: Stores the full user object
  loginUser = (email, password, role) => {
    let foundUser = null;
    if (role === 'admin') {
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        foundUser = { ...MOCK_ADMIN, role: 'admin' };
      }
    } else {
      const student = this.students.find(
        (s) => s.email === email && s.password === password
      );
      if (student) {
        foundUser = { ...student, role: 'student' };
      }
    }
    
    if (foundUser) {
      runInAction(() => {
        this.user = foundUser;
      });
      return true;
    }
    return false;
  };

  logout = () => {
    this.user = null;
    this.editingJob = null; 
  };

  // UPDATED: Includes instituteKey
  addJob = (job) => {
    const newJob = {
      id: Math.max(...this.jobs.map((j) => j.id)) + 1,
      ...job, // job includes title, company, instituteKey
    };
    runInAction(() => {
      this.jobs.push(newJob);
    });
  };

  // UPDATED: Includes instituteKey
  updateJob = (updatedJobData) => {
    runInAction(() => {
      const index = this.jobs.findIndex((j) => j.id === updatedJobData.id);
      if (index !== -1) {
        this.jobs[index] = updatedJobData;
      }
      this.editingJob = null;
    });
  };

  deleteJob = (jobId) => {
    runInAction(() => {
      this.jobs = this.jobs.filter((job) => job.id !== jobId);
    });
  };

  startEditing = (job) => {
    this.editingJob = job;
  };

  cancelEditing = () => {
    this.editingJob = null;
  };

  // UPDATED: "Quick Apply" now attaches resume
  applyToJob = (jobId) => {
    const studentId = this.user.id;
    const resumeFileName = this.studentResumes.get(studentId) || 'No Resume on File';

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
          resumeFileName: resumeFileName, // Attach resume name
        });
      });
      alert(`Applied with resume: ${resumeFileName}`);
    } else {
      alert('You have already applied to this job.');
    }
  };

  // --- NEW ACTIONS ---
  
  // For student profile page
  uploadResume = (fileName) => {
    const studentId = this.user.id;
    runInAction(() => {
      this.studentResumes.set(studentId, fileName);
    });
    alert(`Resume "${fileName}" saved!`);
  }

  // For student dashboard
  submitHiredDetails = (details) => {
    runInAction(() => {
      this.hiredStudents.push({
        id: this.hiredStudents.length + 1,
        studentId: this.user.id,
        studentName: this.user.name,
        company: details.company,
        title: details.title,
        date: new Date().toLocaleDateString()
      });
    });
    alert('Congratulations! Your placement details have been submitted.');
  }

  // For admin dashboard
  addAnnouncement = (announcement) => {
    runInAction(() => {
      this.announcements.unshift({ // unshift puts it at the beginning
        id: this.announcements.length + 1,
        ...announcement,
        date: new Date().toLocaleDateString()
      });
    });
  }
}

export const placementStore = new PlacementStore();