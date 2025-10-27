# 🚀 Quick Start Guide

## Prerequisites Check

```bash
# Check Python version (need 3.13+)
python3 --version

# Check Node.js version (need 18+)
node --version

# Check if ports are available
lsof -ti:8000  # Backend port
lsof -ti:5173  # Frontend port
```

## 🎯 Setup in 5 Minutes

### Step 1: Backend Setup (2 minutes)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# OR: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Seed database with 76 universities
python seed_data.py

# Start server
python main.py
```

✅ Backend running on: `http://localhost:8000`

### Step 2: Frontend Setup (2 minutes)

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend running on: `http://localhost:5173`

### Step 3: Test It! (1 minute)

1. Open `http://localhost:5173` in your browser
2. Use the default values or adjust:
   - GMAT Score: 720
   - GPA: 3.8
   - Work Experience: 5 years
3. Click "Find My Matches"
4. See 76 universities ranked by admission probability! 🎉

## 📊 Quick API Test

### Test the matching endpoint

```bash
curl -X POST http://localhost:8000/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "gmat_score": 720,
    "gpa": 3.8,
    "work_experience": 5,
    "target_program": "MBA"
  }'
```

### Get all universities

```bash
curl http://localhost:8000/api/universities | jq
```

### View API docs

Open: `http://localhost:8000/docs`

## 🎨 What You'll See

### Landing Page

- Clean hero section with feature highlights
- Profile input form with real-time validation
- Profile strength indicator

### Results Page

- 76 universities ranked by admission chance
- Color-coded probability badges (Safety/Target/Reach)
- Search bar to filter universities
- Sort options (admission, ranking, tuition, acceptance)
- Filter by tier
- Detailed stats for each university

## 🔥 Try These Features

### 1. Search Functionality

Type "Boston" or "California" in the search bar

### 2. Sort Options

- By Admission Chance (default)
- By University Ranking
- By Tuition Cost
- By Acceptance Rate

### 3. Filter by Tier

- All Universities
- Safety Schools (≥60%)
- Target Schools (35-60%)
- Reach Schools (<35%)

### 4. Different Profiles

Try different combinations:

- **Strong Profile**: GMAT 750, GPA 3.9
- **Average Profile**: GMAT 650, GPA 3.3
- **Developing Profile**: GMAT 550, GPA 3.0

Watch how admission chances change!

## 🛑 Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Or use a different port in main.py
uvicorn.run("main:app", port=8001)
```

**Database not seeded:**

```bash
cd backend
source venv/bin/activate
python seed_data.py
```

**Import errors:**

```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Frontend Issues

**Port 5173 already in use:**

```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or Vite will automatically try port 5174
```

**Dependencies not installed:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Can't connect to backend:**

- Check backend is running on port 8000
- Check CORS settings in backend/main.py
- Check browser console for errors

### CORS Issues

If you see CORS errors, verify in `backend/main.py`:

```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
```

## 📱 Mobile Testing

### Test responsive design

1. Open `http://localhost:5173`
2. Open Chrome DevTools (F12)
3. Click device toolbar icon (Ctrl+Shift+M)
4. Try different devices:
   - iPhone 12 Pro
   - iPad Air
   - Galaxy S20

## 🎓 Example Use Cases

### Use Case 1: High Achiever

``` example-1
GMAT: 750
GPA: 3.9
Experience: 5 years
Result: Good chances at top schools like Harvard, Stanford
```

### Use Case 2: Balanced Profile

``` example-2
GMAT: 680
GPA: 3.5
Experience: 4 years
Result: Strong mix of target and safety schools
```

### Use Case 3: Career Switcher

``` example-3
GMAT: 650
GPA: 3.2
Experience: 7 years
Result: Focus on schools valuing work experience
```

## 📚 Next Steps

1. **Explore the API docs**: `http://localhost:8000/docs`
2. **Check the README**: Full documentation available
3. **View the code**: Well-commented and organized
4. **Test edge cases**: Try invalid inputs to see validation

## 🎉 Success Indicators

✅ Backend responds to `http://localhost:8000/health`
✅ Frontend loads at `http://localhost:5173`
✅ Form accepts and validates input  
✅ Results display 76 universities  
✅ Search, sort, and filter work smoothly  
✅ Mobile responsive design works  

## 🆘 Need Help?

Check these files:

- `README.md` - Complete documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- Backend logs in terminal
- Browser console (F12) for frontend errors

---

**You're all set! 🚀 Start exploring the Right Fit Matcher!**
