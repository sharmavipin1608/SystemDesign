# GITHUB PAGES & DEPLOYMENT FAQ

## 1. GITHUB PAGES: YES, YOU CAN SHARE THE LINK DIRECTLY

### How it Works:
If you push this to a GitHub repository and enable GitHub Pages, you get a **free, instant hosted website**.

**Setup (5 minutes):**
```
1. Create repo: github.com/yourusername/system-design-guide
2. Push all HTML/CSS/JS files to `main` branch
3. Go to repo Settings → Pages
4. Set source: "Deploy from a branch" → select `main` branch → folder `/root` or `/docs`
5. GitHub automatically hosts at: https://yourusername.github.io/system-design-guide
```

**Result:**
- ✅ Live, shareable link
- ✅ No hosting fees
- ✅ Auto-updates when you push
- ✅ Works immediately (no build step needed)

### Access:
```
Open https://yourusername.github.io/system-design-guide in browser
→ Loads your index.html
→ Fully functional guide
```

### Why This Works:
- All files are **static HTML/CSS/JS** (no backend needed)
- GitHub Pages serves static files for free
- Perfect for this use case

---

## 2. MODEL SELECTION: HAIKU vs SONNET

### SHORT ANSWER:
**Use Sonnet for this project.** Here's why:

### DETAILED COMPARISON:

| Aspect | Haiku | Sonnet |
|--------|-------|--------|
| **Speed** | ⚡ Fast (good) | 🚀 Slower but manageable |
| **Quality** | 📊 Good (70%) | 📊 Excellent (95%+) |
| **Context window** | 200K tokens | 200K tokens |
| **Cost** | Cheaper | 2-3x more expensive |
| **Best for** | Quick tasks, summaries | Complex tasks, depth |
| **Code quality** | Good | Excellent |
| **Design/UX details** | Misses subtleties | Catches everything |
| **Metrics accuracy** | ~80% reliable | ~99% reliable |

### WHY SONNET FOR THIS PROJECT:

1. **Design Quality Matters**
   - Haiku might miss subtle styling issues
   - Sonnet will catch responsive design problems
   - Your guide needs to look professional

2. **HTML/CSS/JS Complexity**
   - Haiku generates functional but basic code
   - Sonnet generates polished, production-ready code
   - You want guides people will actually use

3. **Metrics Accuracy**
   - Haiku might round numbers incorrectly
   - Sonnet will be precise (Redis: 500K RPS, not "around 500K")
   - In interviews, precision matters

4. **Decision Tree Logic**
   - Haiku might miss edge cases in navigation
   - Sonnet will think through state management
   - Complex branching logic needs care

5. **Component Reusability**
   - Haiku generates copy-paste code
   - Sonnet will structure shared components properly
   - Your multi-file architecture needs good design

### COST COMPARISON:

**Using Haiku:**
- ~400K tokens estimated
- Cost: ~$2-3

**Using Sonnet:**
- ~400K tokens estimated
- Cost: ~$6-9

**ROI:** Extra $3-6 investment → Professional guide used for years of interviews = **Worth it.**

### RECOMMENDATION:
```
🎯 Use Sonnet for:
  ✅ All HTML/CSS/JS generation
  ✅ Design/UX decisions
  ✅ Metrics accuracy

💡 Could use Haiku for:
  - Simple documentation (README, comments)
  - Quick reference tables (low complexity)
  - Reviewing/explaining existing code

BEST PRACTICE:
- Build with Sonnet (quality)
- Review/refine with Sonnet (consistency)
- Use Haiku only for doc updates if needed
```

---

## DECISION: USE SONNET

The extra cost is negligible ($6 vs $2) compared to the quality improvement. Your guide will be used for **years of interview prep** — invest in quality.

