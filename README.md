# Employee Attendance Control App

## Overview

Employee Attendance Control App is a comprehensive solution for monitoring the presence of employees at the workplace. The application is built using React for the frontend, GraphQL for the backend, and MongoDB for the database.

## Features

- **User-friendly Interface:** The React-based frontend provides an intuitive and user-friendly experience for both administrators and employees.

- **Real-time Monitoring:** Keep track of employee attendance in real-time, allowing for efficient workforce management.

- **GraphQL Backend:** The backend is powered by GraphQL, offering a flexible and efficient API for seamless communication between the frontend and database.

- **MongoDB Database:** Data is stored securely in MongoDB, ensuring reliability and scalability as your organization grows.

## Installation

1. Clone the repository:

```
git clone https://github.com/chapovskii/attendance.git
```

2. Install dependencies for both frontend and backend:

```
cd employee-attendance-control/frontend
npm install

cd ../backend
npm install

```

3. Set up your MongoDB database and update the configuration accordingly.

3.1. Create a `.env` file in the root directory of the project.

3.2. Declare your MongoDB connection string with credentials in the `.env` file:

```env
MONGO_DB="mongodb+srv://your-username:your-password@your-cluster.mongodb.net/"
```

Replace your-username and your-password with your MongoDB Atlas username and password. Also, replace your-cluster with the name of your MongoDB cluster.

4.Set database:

To set up the database, create the necessary collections, and add an admin user, run the following command in your terminal (don't forget to be in folder employee-attendance-control/backend):

```
npx ts-node data-init.ts
```

This command will execute the TypeScript script (data-init.ts) responsible for database configuration and initialization. Ensure that your MongoDB connection is properly configured in the .env file before running this command.

5. Start the application:

```
cd ../frontend
npm start

cd ../backend
npm run dev

```

6. Access the app in your browser at http://localhost:3000.

## Usage

to log in and use the app, write "admin" in field

### Employee Actions

Employees can perform the following actions in real-time:

- **Check-in:** Mark their arrival at work.
- **Start Break:** Indicate the beginning of a break.
- **End Break:** Mark the end of a break.
- **Check-out:** Record their departure from work.
- **Log-in and Log-out**

### Administrator Actions

Administrators have additional privileges, including:

- **Profile Management:** Create, edit, and manage employee profiles.
- **Attendance Corrections:** Rectify any errors or discrepancies in employee attendance records.
- **New Profile Creation:** Administrators can create new profiles for new employees joining the organization and delete existing profiles.
- **Log-in and Log-out**

Feel free to explore the user-friendly interface to streamline attendance management efficiently.

![Alt text](image.png)
