// This file acts as our "database"
export const MOCK_JOBS = [
  { id: 1, title: 'Software Engineer Intern', company: 'TechCorp', instituteKey: 'AIT' },
  { id: 2, title: 'Data Analyst', company: 'DataMinds', instituteKey: 'AIT' },
  { id: 3, title: 'UX/UI Designer', company: 'DesignCo', instituteKey: 'AIGS' },
  { id: 4, title: 'Cloud Engineer', company: 'Azure Inc.', instituteKey: 'AIGS' },
];

export const MOCK_STUDENTS = [
  { 
    id: 101, 
    name: 'Alice Smith', 
    email: 'student@example.com', 
    password: '123', 
    instituteKey: 'AIT', 
    branch: 'Computer Science' 
  },
  { 
    id: 102, 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    password: '123', 
    instituteKey: 'AIT', 
    branch: 'Electronics' 
  },
  { 
    id: 103, 
    name: 'Charlie Brown', 
    email: 'charlie@example.com', 
    password: '123', 
    instituteKey: 'AIGS', 
    branch: 'Computer Science' 
  },
];

export const MOCK_ADMIN = {
  id: 1,
  email: 'admin@example.com',
  password: '123',
  instituteKey: 'AIT', // Admin can also belong to an institute
};