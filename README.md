# 🍥 Naruto File Manager - Node.js Backend

A full-stack file manager application with Naruto theme, featuring file renaming, duplication, and automatic date updating capabilities.

## Features

✨ **Authentication System**
- User registration and login
- JWT token-based authentication
- Secure password hashing with bcryptjs

📁 **File Operations**
- Rename files with custom formatting
- Duplicate files (1-100x)
- Auto-update file modification dates sequentially

🎨 **Beautiful UI**
- Naruto-themed dark interface
- Responsive design
- Real-time preview of operations
- Smooth animations and effects

## Tech Stack

- **Backend**: Node.js + Express.js
- **Authentication**: JWT
- **Database**: SQLite
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Deployment**: Vercel

## Local Setup

### Prerequisites
- Node.js 14+ installed
- npm or yarn

### Installation

1. **Clone and enter directory**
   ```bash
   cd c:\Users\Mars TC SHV\Documents\test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update:
   - `JWT_SECRET`: Change to a random 32-character string
   - `PORT`: Default is 3000

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the app**
   - Open browser: `http://localhost:3000`
   - Create an account or login

## Project Structure

```
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env.example             # Environment template
├── vercel.json             # Vercel deployment config
├── public/
│   └── dashboard.html      # Frontend application
├── routes/
│   ├── auth.js            # Authentication endpoints
│   └── files.js           # File operation endpoints
├── controllers/
│   ├── authController.js  # Auth logic
│   └── filesController.js # File operation logic
├── middleware/
│   └── auth.js            # JWT verification
└── utils/
    ├── db.js              # Database setup
    └── fileOperations.js  # File operation utilities
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (requires auth)

### File Operations (all require authentication)
- `POST /api/files/load` - Get list of files in folder
- `POST /api/files/generate-dates` - Generate date list
- `POST /api/files/rename` - Rename multiple files
- `POST /api/files/duplicate` - Duplicate files
- `POST /api/files/autodate` - Update file dates

## Usage

### Register/Login
1. Open the app
2. Create account or login with credentials
3. Dashboard loads after authentication

### Rename Files
1. Enter folder path (e.g., "uploads" or leave empty)
2. Click "Load Files"
3. Select situs, custom text, month, year
4. Click "Preview"
5. Select files to rename
6. Click "Rename"

### Duplicate Files
1. Load files from folder
2. Set duplicate count (1-100x)
3. Select files
4. Click "Duplicate"

### Auto Date Files
1. Enter folder path
2. Click "Validate"
3. Set year and month
4. Set start file number
5. Click "Update Dates"

## Deployment to Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- Git repository

### Steps

1. **Create Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub** (optional but recommended)
   ```bash
   git remote add origin <github-url>
   git push -u origin main
   ```

3. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

4. **Set Environment Variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add:
     - `JWT_SECRET`: Your secret key
     - `NODE_ENV`: `production`
     - `PORT`: `3000`

5. **Visit your deployment**
   - Vercel provides a URL like `https://your-app.vercel.app`

## ⚠️ Important Notes

### SQLite on Vercel
- SQLite data is stored in `/tmp` (ephemeral)
- Data will be lost when Vercel restarts the server
- **For production**: Migrate to PostgreSQL or MongoDB

### File Storage
- Files are stored in `/uploads/{userId}/`
- Each user has isolated file access
- Supports all file types

### Security
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens expire in 1 hour (configurable)
- All file paths validated to prevent directory traversal
- CORS enabled for frontend access

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Database Issues
```bash
# Delete corrupted database
rm app.db
# Restart server
npm start
```

### Authentication Fails
- Clear browser localStorage: `localStorage.clear()`
- Check console for errors
- Verify JWT_SECRET in .env is set correctly

## Future Improvements

- [ ] PostgreSQL support for production
- [ ] Google Drive integration
- [ ] File upload functionality
- [ ] Batch operations progress tracking
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] User profiles and settings
- [ ] File sharing between users

## License

MIT

## Support

For issues or feature requests, create an issue or contact support.

---

Made with 🍥 by Naruto Team
