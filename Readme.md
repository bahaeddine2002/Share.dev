<div align="center">
  <img src="./bloglist-frontend/public/logo.png" alt="share.dev logo" width="140"/>

# **share.dev**

### _A Modern Social Platform for Sharing & Discovering Amazing Blogs_

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)](https://www.mongodb.com/)

[Live Demo](#) • [Features](#-features) • [Screenshots](#-screenshots) • [Installation](#️-installation)

</div>

---

## 🚀 Overview

**share.dev** is a full-stack social platform where users can **share external blog links**, discover content through tags, follow their favorite creators, and engage through likes and comments. Built with modern technologies and best practices, it demonstrates proficiency in React, Redux, Material UI, Node.js, Express, MongoDB, and authentication flows.

**Perfect for showcasing:**

- Full-stack development skills (MERN stack)
- Modern authentication (Google OAuth + JWT)
- State management (Redux Toolkit)
- RESTful API design (MVC architecture)
- Real-time user interactions
- Responsive Material UI design
- File uploads & image handling

---

## ✨ Features

### 🔐 Authentication & Authorization

- **Google OAuth 2.0** integration with Passport.js
- **JWT tokens** stored in HttpOnly cookies for security
- Secure session handling and automatic refresh flow
- Protected routes and API endpoints

### 📝 Blog Sharing & Management

- Share external blog posts with **title**, **author**, **URL**, **cover image**, and **tags**
- Responsive **Material UI blog cards** with elegant fallback images
- Direct external link opening in new tabs
- Rich content preview and metadata display

### ❤️ User Interactions

- **Like / Unlike** posts with instant feedback
- **Comment system** with threaded discussions
- Real-time engagement counters (likes, comments, views)
- Interactive UI with smooth animations

### 👤 User Profiles & Social Features

- Public profile pages with customizable avatars
- **Bio editing** and personal information management
- **Follow / Unfollow** users to curate your feed
- **Followers / Following** counters with user lists
- Avatar uploads with Multer (supports Google profile pictures)
- Personal feed showing user's shared posts

### 📰 Personalized Feed

- **"Your Feed"** shows posts from creators you follow
- Easy toggle between **All Posts** and **Your Feed**
- Smart content filtering and sorting
- Infinite scroll for seamless browsing

### 🔍 Explore & Discovery

- Filter content by **trending tags**
- Browse **newest posts** first
- Tag-based navigation for topic discovery
- Search functionality _(upcoming)_
- **Top creators** leaderboard _(upcoming)_

### 🔔 Notifications System

- **HTTP-based notifications** for likes, comments, and new followers
- Persistent **unread count** badge
- **Mark-as-read** functionality
- Mobile-responsive notification drawer
- Real-time updates on user activity---

## 🖥️ Tech Stack

### **Frontend** (`bloglist-frontend/`)

| Technology               | Purpose                                  |
| ------------------------ | ---------------------------------------- |
| ⚛️ **React 18** (Vite)   | Fast, modern UI library with HMR         |
| 🔄 **Redux Toolkit**     | Centralized state management             |
| 🎨 **Material UI (MUI)** | Professional component library & theming |
| 🧭 **React Router v6**   | Client-side routing & navigation         |
| 📡 **Axios**             | HTTP client for API calls                |
| 🎭 **Emotion**           | CSS-in-JS styling solution               |

### **Backend** (`Fullstack_Part4/`)

| Technology                | Purpose                                |
| ------------------------- | -------------------------------------- |
| 🟢 **Node.js + Express**  | RESTful API server                     |
| 🍃 **MongoDB + Mongoose** | NoSQL database & ODM                   |
| 🔐 **Passport.js**        | Google OAuth 2.0 authentication        |
| 🎫 **JWT**                | Token-based auth (HttpOnly cookies)    |
| 📤 **Multer**             | File upload handling (avatars, images) |
| 🍪 **cookie-parser**      | Secure cookie management               |
| 🏗️ **MVC Architecture**   | Clean, scalable code organization      |

### **Development & Testing**

- **Vitest** - Unit & integration testing
- **ESLint + Prettier** - Code quality & formatting
- **Supertest** - API endpoint testing
- **dotenv** - Environment configuration

---

## � Screenshots

<div align="center">

### 🏠 Dashboard - Discover Posts

<img src="./bloglist-frontend/public/screenshots/dashboard.png" alt="Dashboard showing all blog posts" width="800"/>

_Browse all shared blog posts with elegant Material UI cards, tags, and engagement metrics_

---

### 📱 Responsive Design - Mobile View

<img src="./bloglist-frontend/public/screenshots/mobile-menu.png" alt="Mobile responsive navigation" width="800"/>

_Fully responsive design with mobile drawer navigation and touch-optimized interactions_

---

### 👤 User Profile - Personal Feed

<img src="./bloglist-frontend/public/screenshots/user-profile.png" alt="User profile with followers" width="800"/>

_Customizable user profiles with avatars, bio, followers/following counts, and personal feed_

---

### ✍️ Create Post - Share Content

<img src="./bloglist-frontend/public/screenshots/creation-form.png" alt="Blog creation form" width="800"/>

_Intuitive form for sharing external blog links with rich metadata_

---

### 🔔 Notifications - Stay Updated

<img src="./bloglist-frontend/public/screenshots/notifications.png" alt="Notifications drawer" width="800"/>

_Real-time notifications for likes, comments, and new followers_

---

### 💬 Blog Details - Engage with Content

<img src="./bloglist-frontend/public/screenshots/blog-page.png" alt="Blog detail page with comments" width="800"/>

_Detailed blog view with likes, comments, and direct external link access_

</div>

---

## 📁 Project Architecture

```
share.dev/
│
├── 🖥️ Fullstack_Part4/          # Backend API (Node.js + Express)
│   ├── controllers/            # Route handlers (auth, blog, user, notification)
│   │   ├── auth.js            # Google OAuth callbacks
│   │   ├── blog.js            # Blog CRUD operations
│   │   ├── user.js            # User management
│   │   ├── follow.js          # Follow/unfollow logic
│   │   ├── notification.js    # Notification system
│   │   └── login.js           # JWT token generation
│   │
│   ├── models/                # Mongoose schemas
│   │   ├── user.js           # User model with followers
│   │   ├── blog.js           # Blog post model
│   │   ├── comments.js       # Comment model
│   │   └── notification.js   # Notification model
│   │
│   ├── utils/                 # Utilities & middleware
│   │   ├── config.js         # Environment variables
│   │   ├── passport-setup.js # Google OAuth strategy
│   │   ├── middleware.js     # Auth, error handling
│   │   └── logger.js         # Request logging
│   │
│   ├── uploads/avatars/       # User avatar storage
│   ├── app.js                 # Express app configuration
│   └── index.js               # Server entry point
│
├── 🎨 bloglist-frontend/         # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Blog.jsx      # Blog card component
│   │   │   ├── Blogs.jsx     # Blog list with filtering
│   │   │   ├── CreationForm.jsx # Post creation form
│   │   │   ├── User.jsx      # User profile
│   │   │   ├── Users.jsx     # User directory
│   │   │   ├── Login.jsx     # Authentication
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── TagPage.jsx   # Tag filtering
│   │   │   └── Header.jsx    # Navigation bar
│   │   │
│   │   ├── reducers/          # Redux slices
│   │   │   ├── blogreducer.js
│   │   │   ├── userReducer.js
│   │   │   ├── usersReducer.js
│   │   │   └── notificationsReducer.js
│   │   │
│   │   ├── services/          # API clients
│   │   │   ├── blogs.js
│   │   │   ├── users.js
│   │   │   ├── login.js
│   │   │   └── notifications.js
│   │   │
│   │   ├── store.js           # Redux store configuration
│   │   ├── theme.js           # MUI theme customization
│   │   └── App.jsx            # Root component with routing
│   │
│   ├── public/
│   │   ├── logo.png
│   │   └── screenshots/       # App screenshots
│   │
│   └── vite.config.js         # Vite configuration
│
└── 📄 README.md                  # This file
```

---

## 🎯 Key Technical Highlights

### 🔒 Security Best Practices

- **HttpOnly cookies** prevent XSS attacks
- **JWT tokens** with secure refresh flow
- **OAuth 2.0** industry-standard authentication
- **Password hashing** with bcrypt (for local auth fallback)
- **CORS configuration** for controlled API access

### 🏗️ Architecture & Code Quality

- **MVC pattern** for clear separation of concerns
- **Redux Toolkit** for predictable state management
- **RESTful API** design with proper HTTP methods
- **Mongoose ODM** with schema validation
- **Error handling middleware** for robust error management
- **ESLint + Prettier** for consistent code style

### ⚡ Performance Optimizations

- **Vite** for lightning-fast development & builds
- **Code splitting** with React Router lazy loading
- **Optimized re-renders** with Redux selectors
- **Image optimization** for avatar uploads
- **Database indexing** for fast queries

### 📱 User Experience

- **Fully responsive** design (mobile, tablet, desktop)
- **Material Design** principles
- **Loading states** and skeleton screens
- **Error boundaries** for graceful failure handling
- **Toast notifications** for user feedback---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Google OAuth credentials** ([Get them here](https://console.cloud.google.com/))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/bahaeddine2002/Share.dev.git
cd share.dev
```

### 2️⃣ Backend Setup

```bash
cd Fullstack_Part4
npm install
```

Create `.env` file in `Fullstack_Part4/`:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sharedev?retryWrites=true&w=majority
MONGODB_URI_TEST=mongodb+srv://username:password@cluster.mongodb.net/sharedev-test

# Server
PORT=3003
NODE_ENV=development

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secret (generate a random string)
SECRET=your_jwt_secret_key_here
```

### 3️⃣ Frontend Setup

```bash
cd ../bloglist-frontend
npm install
```

Create `.env` file in `bloglist-frontend/`:

```env
VITE_API_URL=http://localhost:3003
```

### 4️⃣ Run the Application

**Start Backend** (Terminal 1):

```bash
cd Fullstack_Part4
npm run dev
```

Backend runs on `http://localhost:3003`

**Start Frontend** (Terminal 2):

```bash
cd bloglist-frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

### 5️⃣ Access the App

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3003/api
- **Google OAuth Callback**: http://localhost:3003/api/auth/google/callback

---

## 🧪 Running Tests

### Backend Tests

```bash
cd Fullstack_Part4
npm test
```

### Frontend Tests

```bash
cd bloglist-frontend
npm test
```

---

## � API Documentation

### Key Endpoints

#### Authentication

- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/login` - Login with credentials
- `POST /api/logout` - Clear session

#### Blogs

- `GET /api/blogs` - Get all blogs (with pagination)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)
- `PUT /api/blogs/:id/like` - Like/unlike blog

#### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (auth required)
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user

#### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

---

## 🎨 Design System

### Color Palette

- **Primary**: Material UI Blue (#1976d2)
- **Secondary**: Orange (#ff9800)
- **Success**: Green (#4caf50)
- **Error**: Red (#f44336)

### Typography

- **Font Family**: Poppins, Roboto, sans-serif
- **Headings**: Bold weights (500-700)
- **Body**: Regular (400)

---

## 🧩 Roadmap & Future Enhancements

### 🔜 Coming Soon

- [ ] **WebSocket integration** for real-time notifications
- [ ] **Search functionality** with fuzzy matching
- [ ] **Bookmarks/Save posts** feature
- [ ] **Top creators** leaderboard
- [ ] **Dark mode** theme toggle
- [ ] **Email notifications** for important events

### 💡 Potential Features

- [ ] **Repost/Share** functionality
- [ ] **Private messaging** between users
- [ ] **Blog recommendations** based on interests
- [ ] **Analytics dashboard** for content creators
- [ ] **Mobile app** (React Native)
- [ ] **Multiple OAuth providers** (GitHub, Twitter)

---

## 🤝 Contributing

Contributions are always welcome! Here's how you can help:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Contribution Guidelines

- Follow existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Reference issue numbers in PRs

---

## 📧 Contact & Support

**Baha Eddine** - Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/baha-azouz-11a862364/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/bahaeddine2002)

- 📧 **Email**: bahaazouz88@gmail.com

---

## 🙏 Acknowledgments

- [Material UI](https://mui.com/) for the beautiful component library
- [Passport.js](http://www.passportjs.org/) for authentication
- [MongoDB](https://www.mongodb.com/) for the database
- [Vite](https://vitejs.dev/) for blazing fast builds
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/bahaeddine2002/Share.dev)
![GitHub last commit](https://img.shields.io/github/last-commit/bahaeddine2002/Share.dev)
![GitHub issues](https://img.shields.io/github/issues/bahaeddine2002/Share.dev)
![GitHub pull requests](https://img.shields.io/github/issues-pr/bahaeddine2002/Share.dev)

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Made with ❤️ by [Baha Eddine](https://github.com/bahaeddine2002) — 2025**

_Building innovative solutions, one commit at a time_ ✨

[⬆ Back to Top](#sharedev)

</div>
