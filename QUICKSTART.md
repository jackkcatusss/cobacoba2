# Quick Start Guide - Local Testing

## Step 1: Install Dependencies

```bash
cd c:\Users\Mars TC SHV\Documents\test
npm install
```

Expected output: Should show all packages installing successfully.

## Step 2: Create Environment File

```bash
# Copy the example env file
cp .env.example .env
```

The `.env` file already has good defaults:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345678
JWT_EXPIRE=3600
JWT_REFRESH_EXPIRE=604800
DATABASE_PATH=./app.db
CORS_ORIGIN=*
```

## Step 3: Start the Server

```bash
npm start
```

Expected output:
```
🚀 Naruto File Manager Server running on http://localhost:3000
📁 Environment: development
```

## Step 4: Test in Browser

1. Open browser: **http://localhost:3000**
2. You should see the Naruto login screen

## Step 5: Create Account

1. Click "Register" button
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Create Account"
4. You should be logged in and see the dashboard

## Step 6: Test File Operations

### Create Test Files
```bash
# Create uploads folder
mkdir uploads

# Create sample files
echo "sample content" > uploads/file1.txt
echo "sample content" > uploads/file2.txt
echo "sample content" > uploads/file3.txt
```

### Test Rename
1. Go to "Rename File" tab
2. Leave folder path empty or enter "uploads"
3. Click "📂 Load"
4. Select situs (e.g., FATCAI)
5. Select custom text (DATA 500)
6. Select month and year
7. Click "Preview"
8. Select files
9. Click "✏️ Rename"
10. Check the files have been renamed

### Test Duplicate
1. Go to "Duplikat File" tab
2. Load files
3. Set duplicate count to 2
4. Select files
5. Click "📋 Duplicate"
6. Should create copies like "filename_copy1.txt"

### Test Auto Date
1. Go to "Ganti Tanggal" tab
2. Enter folder path: `uploads`
3. Click "🔍 Validate"
4. Set year and month
5. Click "🚀 Update Dates"
6. Files should have updated modification dates

## Step 7: Test Authentication

### Test Logout
1. Click "Logout" button in sidebar footer
2. Should return to login screen

### Test Login
1. Click "Back to Login"
2. Enter username: `testuser`
3. Enter password: `password123`
4. Click "Login"

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

Response will include a token like:
```json
{
  "success": true,
  "message": "Login successful",
  "userId": 1,
  "username": "testuser",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Load Files (use token from login response)
```bash
curl -X POST http://localhost:3000/api/files/load \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"folderPath":"uploads"}'
```

### Rename Files
```bash
curl -X POST http://localhost:3000/api/files/rename \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [
      {"nomor":1,"oldName":"file1.txt","newName":"1. FATCAI DATA 500 - 01 MAY 2026"}
    ]
  }'
```

## Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Try different port
set PORT=3001
npm start
```

### Database errors
```bash
# Delete old database
del app.db

# Restart server (creates new database)
npm start
```

### Cannot login
1. Check if user was created:
   - Delete `app.db`
   - Restart server
   - Register new account
2. Check browser console (F12) for errors
3. Check server console for error messages

### Files not loading
1. Make sure folder exists: `mkdir uploads` 
2. Add some test files in the folder
3. Check file permissions

### Permission denied errors
- Ensure the `uploads` folder is readable/writable
- On Windows: Check folder properties > Security > Edit permissions

## Next Steps

Once everything works locally:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial Naruto File Manager"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/naruto-file-manager.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set up environment variables in Vercel dashboard**

4. **Visit your live deployment!**

## Tips

- Keep server running in one terminal
- Use another terminal for testing
- Check `app.db` gets created in root directory
- Files are stored in `uploads/user_{userId}/`
- Clear localStorage if getting auth issues: `localStorage.clear()`

---

Happy testing! 🍥
