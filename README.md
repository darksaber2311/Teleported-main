# Teleported: a Travel Wishlist & Archive App

## Overview

This is a full-stack web application that allows users to:

* Add places to a wishlist
* Archive visited places
* View locations on an interactive map

Built using:

* React (Frontend)
* Node.js + Express (Backend)
* MongoDB (Database)

---

## Features

* Interactive map view
* Add places to wishlist
* Archive visited locations
* Dynamic sidebar navigation
* Custom map markers
* Real-time UI updates

---

## Tech Stack

### Frontend

* React
* CSS
* MapLibre GL (or similar map library)

### Backend

* Node.js
* Express.js

### Database

* MongoDB

---

## Project Structure

```
project/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── MapView.js
│   │   │   └── Navbar.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
```

---

## Installation

### 1. Clone the repository

```
git clone <repo-url>
cd project
```

### 2. Install dependencies

Frontend:

```
cd frontend
npm install
npm start
```

Backend:

```
cd backend
npm install
npm start
```

---

## Important Notes

* Make sure MongoDB is running
* Backend must run on:

```
http://localhost:5000
```

* If you see:

```
ERR_CONNECTION_REFUSED
```

Then start backend server

---

## Key Concepts Used

* React Hooks (`useState`, `useEffect`, `useRef`)
* Component-based architecture
* Props for data passing
* Conditional rendering
* REST API integration

---

## Future Improvements

* User authentication
* Save user-specific wishlist
* Search & filter places
* Better UI animations

