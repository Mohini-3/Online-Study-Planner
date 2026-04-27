# Online Study Planner - React + Express + MySQL

A modern, full-featured study planning application built with React, Express.js, and MySQL. Features user authentication, subject management, exam tracking, task management, goals, study tips, timetable, and weekly planning.

## Features

✅ **User Authentication** - Register and login securely  
✅ **Subject Management** - Create and manage academic subjects  
✅ **Exam Tracker** - Track upcoming and completed exams  
✅ **Task Management** - Organize study tasks with priorities  
✅ **Goals** - Set and track academic goals  
✅ **Study Tips** - Save helpful study resources and tips  
✅ **Timetable** - Plan your weekly study schedule  
✅ **Weekly Planning** - Plan your academic week  
✅ **Beautiful UI** - Modern gradient design matching the HTML version  
✅ **Real-time Data** - Complete CRUD operations with MySQL database  

## Architecture

- **Frontend**: React 19 with Vite, Axios for API calls
- **Backend**: Express.js with MySQL2/Promise for async database operations
- **Database**: MySQL via XAMPP

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- XAMPP with MySQL running
- Git (optional)

### Step 1: Start Backend Server

```bash
cd mini-proj/backend
npm install  # If not already installed
npm start
```

Expected output:
```
🚀 Starting application...
📦 Connecting to MySQL server...
✅ Database 'study_planner' ready
✅ All database tables initialized successfully
✅ Server is running on port 5000
```

✨ **The database is automatically created and initialized!**

### Step 2: Start Frontend Development Server

In a new terminal:

```bash
cd mini-proj/frontend
npm install  # If not already installed
npm run dev
```

The app will open at `http://localhost:5173` (or the port shown in terminal)

## Usage

### Registration & Login

1. On first load, you'll see the authentication screen
2. Click **"Register"** to create a new account
3. Enter your full name, email, and password
4. Click **"Sign In"** and use your credentials to login
5. After login, you'll be redirected to the dashboard

### Navigation

The app has a left sidebar with these sections:

- **Dashboard** - Overview with statistics
- **Subjects** - Manage your academic subjects
- **Exam Tracker** - Track exams by date and status
- **Tasks** - Organize your study tasks
- **Goals** - Set academic goals
- **Study Tips** - Save and organize study resources
- **Timetable** - Plan your weekly study schedule
- **Weekly Plan** - Create detailed weekly plans

### Common Operations

**Adding Items:**
- Click the "+ Add" or "+ Add [Section]" button
- Fill in the form and click Submit

**Editing Items:**
- Click the Edit button on any card or table row
- Modify the fields and click Update

**Deleting Items:**
- Click the Delete button on any item
- Confirm the deletion

**Filtering:**
- Use the filter tabs (All, Pending, Completed, etc.) to filter results
- Filters appear in Tasks, Exams, and Goals sections

## Project Structure

```
mini-proj/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection configuration
│   ├── routes/
│   │   ├── users.js           # User authentication routes
│   │   ├── subjects.js        # Subject CRUD routes
│   │   ├── tasks.js           # Task management routes
│   │   ├── goals.js           # Goals management routes
│   │   ├── exams.js           # Exam tracking routes
│   │   ├── studytips.js       # Study tips routes
│   │   ├── weeklyplan.js      # Weekly planning routes
│   │   └── timetable.js       # Timetable routes
│   ├── .env                    # Environment variables
│   ├── server.js              # Express server entry point
│   └── package.json           # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx     # Top navigation header
│   │   │   └── Sidebar.jsx    # Left navigation sidebar
│   │   ├── pages/
│   │   │   ├── Auth.jsx       # Login/Register page
│   │   │   ├── Dashboard.jsx  # Dashboard page
│   │   │   ├── Subjects.jsx   # Subjects page
│   │   │   ├── Exams.jsx      # Exams tracker page
│   │   │   ├── Tasks.jsx      # Tasks page
│   │   │   ├── Goals.jsx      # Goals page
│   │   │   ├── StudyTips.jsx  # Study tips page
│   │   │   ├── Timetable.jsx  # Timetable page
│   │   │   └── WeeklyPlan.jsx # Weekly planning page
│   │   ├── App.jsx            # Main app component
│   │   ├── App.css            # Comprehensive styling
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
└── database_setup.sql         # Database initialization script
```

## Pages & Features in Detail

### 1. **Auth Page** (Login & Registration)
- **Purpose**: User authentication and account management
- **Features**:
  - Toggle between Sign In and Register modes
  - Registration form: Full Name, Email, Password
  - Login form: Email, Password
  - Form validation and error handling
  - Auto-login after successful registration
  - Stores user credentials in localStorage for session persistence
  - Beautiful gradient design matching app theme

### 2. **Dashboard**
- **Purpose**: Overview and welcome screen
- **Features**:
  - Personalized welcome message with user name
  - 4 stat cards showing:
    - Total Subjects
    - Total Exams
    - Total Tasks
    - Total Goals
  - Real-time statistics fetched from database
  - "Get Started" guide section
  - Quick access to main features

### 3. **Subjects Page**
- **Purpose**: Manage academic subjects
- **Features**:
  - Add new subjects with name and code
  - Edit existing subjects
  - Delete subjects
  - Modal-based forms for easy management
  - List view with action buttons
  - Foundation for organizing all other data (tasks, exams, tips, timetable linked to subjects)

### 4. **Tasks Page**
- **Purpose**: Organize and track study tasks
- **Features**:
  - Add/Edit/Delete tasks
  - Task fields: Title, Subject (optional), Due date, Status
  - Status options: Pending, In Progress, Done
  - Filter tabs: All, Pending, In Progress, Done
  - Link tasks to specific subjects
  - Priority-based organization
  - Real-time status updates

### 5. **Exams Page**
- **Purpose**: Track and manage exams
- **Features**:
  - Add/Edit/Delete exams
  - Exam fields: Title, Subject (optional), Exam date, Status
  - Status options: Scheduled, Completed, Cancelled
  - Filter tabs: All, Scheduled, Completed, Cancelled
  - Date-based organization and tracking
  - Link exams to subjects
  - Upcoming exam visibility

### 6. **Goals Page**
- **Purpose**: Set and track academic goals
- **Features**:
  - Add/Edit/Delete goals
  - Goal fields: Title, Description, Target date, Status
  - Status options: Pending, In Progress, Completed
  - Filter tabs: All, Pending, In Progress, Completed
  - Long-form description for detailed goal planning
  - Progress tracking
  - Deadline management

### 7. **Study Tips Page**
- **Purpose**: Save and organize study resources and tips
- **Features**:
  - Add/Edit/Delete tips
  - Tip fields: Title, Content (detailed text), Subject (optional)
  - Rich content support for detailed advice
  - Link tips to subjects for organization
  - Create personal study resource library
  - Reference material collection
  - Share helpful studying techniques

### 8. **Timetable Page**
- **Purpose**: Plan weekly study schedule
- **Features**:
  - Add/Edit/Delete timetable entries
  - Entry fields: Day (Monday-Sunday), Subject, Start time, End time, Topic
  - Weekly schedule organization
  - Time-based study session planning
  - Link sessions to subjects
  - Comprehensive schedule view
  - Consistent study routine building

### 9. **Weekly Plan Page**
- **Purpose**: Create detailed weekly academic plans
- **Features**:
  - Add/Edit/Delete weekly plans
  - Plan fields: Week start date, Description
  - High-level weekly goal setting
  - Detailed description for comprehensive planning
  - Week-based organization
  - Planning and reflection space

## Core Components

### **Header Component**
- Displays logged-in user's name
- Logout button for session termination
- Navigation bar with app branding
- Consistent across all pages

### **Sidebar Component**
- Navigation menu with links to all pages
- Current page highlighting
- Icon-based navigation for easy identification
- Persistent across all pages

## Common Features Across All Pages

✅ **CRUD Operations** - Create, Read, Update, Delete for all data types
✅ **Modal Forms** - Clean popup forms for data entry and editing
✅ **Real-time Updates** - Instant synchronization with database
✅ **User-specific Data** - All data filtered by logged-in user ID
✅ **Status Filtering** - Filter content by status (All, Pending, Completed, etc.)
✅ **Error Handling** - User-friendly error messages and validation
✅ **Loading States** - Loading indicators while fetching data
✅ **Responsive Design** - Works on desktop and tablets
✅ **Axios Integration** - RESTful API communication with backend

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Subjects
- `GET /api/subjects/:userId` - Get all subjects
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Tasks
- `GET /api/tasks/:userId` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Exams
- `GET /api/exams/:userId` - Get all exams
- `POST /api/exams` - Create exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam

### Goals
- `GET /api/goals/:userId` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Study Tips
- `GET /api/studytips/:userId` - Get all tips
- `POST /api/studytips` - Create tip
- `PUT /api/studytips/:id` - Update tip
- `DELETE /api/studytips/:id` - Delete tip

### Timetable
- `GET /api/timetable/:userId` - Get timetable
- `POST /api/timetable` - Create entry
- `PUT /api/timetable/:id` - Update entry
- `DELETE /api/timetable/:id` - Delete entry

### Weekly Plans
- `GET /api/weeklyplan/:userId` - Get plans
- `POST /api/weeklyplan` - Create plan
- `PUT /api/weeklyplan/:id` - Update plan
- `DELETE /api/weeklyplan/:id` - Delete plan

## Database Schema

### Users Table
- `id` - Primary key
- `full_name` - User's full name
- `email` - User's email (unique)
- `password_hash` - Password
- `created_at` - Registration date

### Subjects Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `name` - Subject name
- `code` - Subject code

### Tasks Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `subject_id` - Foreign key to subjects
- `title` - Task title
- `due_date` - Due date
- `status` - pending | in_progress | done

### Exams Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `subject_id` - Foreign key to subjects
- `exam_name` - Exam name
- `exam_date` - Exam date
- `status` - scheduled | completed | cancelled

### Goals Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Goal title
- `description` - Goal description
- `target_date` - Target completion date
- `status` - pending | in_progress | completed

### Study Tips Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `subject_id` - Foreign key to subjects
- `title` - Tip title
- `content` - Tip content

### Weekly Plans Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `week_start` - Week start date
- `description` - Plan description

### Timetable Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `subject_id` - Foreign key to subjects
- `day` - Day of week
- `start_time` - Session start time
- `end_time` - Session end time
- `topic` - Study topic

## Styling & UI

The application features:
- **Gradient Header** - Purple to blue gradient navigation
- **Sidebar Navigation** - Clean, icon-based menu with hover effects
- **Card-based Layouts** - Modern card design for all content sections
- **Responsive Tables** - Beautiful data tables with status badges
- **Modal Forms** - Clean modal dialogs for adding/editing items
- **Color System** - Professional purple/indigo color scheme
- **Smooth Animations** - Transitions and hover effects throughout
- **Mobile Responsive** - Adapts to smaller screens

## Troubleshooting

### Connection Refused on Port 5000
- Ensure `npm start` is running in the backend folder
- Check that no other app is using port 5000
- Try changing the port in backend/.env

### MySQL Connection Error
- Verify XAMPP MySQL is running
- Check credentials in backend/.env match your setup
- Confirm database was created by running `SHOW DATABASES;` in phpMyAdmin

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check browser's developer console for CORS errors
- Verify API_URL in frontend pages matches your backend URL

### Port Already in Use
- Frontend: Change port in `vite.config.js`
- Backend: Change PORT in `.env` file

## Features Implemented

✅ Complete CRUD operations for all modules  
✅ User authentication with localStorage  
✅ MySQL database integration  
✅ Responsive design  
✅ Status tracking and filtering  
✅ Modern UI with gradients and animations  
✅ Modal-based forms  
✅ Real-time data synchronization  
✅ Professional color scheme  
✅ Smooth user experience  

## Future Enhancements

- JWT token-based authentication
- Email verification
- Password reset functionality
- File uploads for study materials
- Collaboration features
- Notes and attachments
- Performance analytics
- Calendar integration
- Reminder notifications
- Dark mode support
- Export to PDF/CSV

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure MySQL database is properly created
4. Check browser console for error messages
5. Verify both backend and frontend are running

## License

This project is open source and available for educational purposes.

---

**Happy Studying!** 📚✨
