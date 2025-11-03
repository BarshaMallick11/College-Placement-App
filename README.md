# 🎓 College Placement Portal (React Frontend)

This project is a simple, frontend-only simulation of a college placement website. It's built entirely with React and demonstrates modern state management and form handling without a backend. All data (jobs, users, applications) is stored in memory using **MobX**.

The application features two distinct user roles: **Admin** and **Student**.

---

## 🛠️ Tech Stack

* **React:** For building the user interface.
* **MobX & MobX-React:** For powerful and simple global state management.
* **Formik:** For managing all forms (Login, Add Job, Edit Job) and handling their state.
* **Yup:** For client-side form validation, used with Formik.
* **React Router v6:** For client-side routing and creating protected routes based on user roles.

---

## ✨ Key Features

### 🧑‍💻 Admin Dashboard
* **Role-Based Login:** A dedicated login view for admins.
* **Job Management (CRUD):**
    * **Create:** Add new job postings via a Formik-powered form.
    * **Read:** View all current job listings.
    * **Update:** Edit existing job postings (the form pre-fills with data from the MobX store).
    * **Delete:** Remove job postings.
* **View Submissions:** See a complete table of all applications submitted by all students.

### 🎓 Student Dashboard
* **Role-Based Login:** A separate login view for students.
* **View Jobs:** Browse the list of all available jobs posted by the admin.
* **Apply for Jobs:** A simple "Apply" button that registers their application in the MobX store.
* **Application Status:** The "Apply" button disables and shows "Applied" if they have already applied to a specific job.

---

## 🚀 How to Run

1.  Clone this repository:
    ```bash
    git clone [your-repo-url]
    ```
2.  Navigate to the project folder:
    ```bash
    cd college-placement-app
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the app:
    ```bash
    npm start
    ```

### 🔑 Demo Login Credentials

* **Admin:**
    * **Email:** `admin@example.com`
    * **Password:** `123`
* **Student:**
    * **Email:** `student@example.com`
    * **Password:** `123`