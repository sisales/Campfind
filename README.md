# 🏕️ CampFind Niagara

> AI-powered camp discovery platform for the Niagara region. Find, save & book summer camps for kids.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-blue)
![Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange)

---

## 🌟 What It Does

CampFind is an Airbnb-style marketplace for kids summer camps in the Niagara region of Ontario. Parents can search, save, and book camps — all powered by AI.

- 🔍 **Smart Search** — AI finds relevant camps by activity, age, and price
- ♥ **Save Favorites** — Bookmark camps to review later
- 🛒 **Book & Checkout** — Submit bookings with child details
- 🔒 **Privacy Review** — All bookings reviewed before payment is collected
- 👤 **User Accounts** — Login to manage bookings and saved camps

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + React |
| AI Engine | Claude Sonnet (Anthropic) |
| Deployment | Vercel |
| Data | Ontario 211 + AI-generated |
| Auth | In-memory (DB coming soon) |

---

## 📁 Project Structure

```
campfind/
├── pages/
│   ├── index.js          # Main app UI
│   └── api/
│       └── camps.js      # AI-powered camp search API
├── package.json
├── next.config.js
└── .env.local            # API keys (never committed)
```

---

## ⚙️ Setup & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/sisales/Campfind.git
cd Campfind

# 2. Install dependencies
npm install

# 3. Add your API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local

# 4. Run locally
npm run dev
# Open http://localhost:3000
```

---

## 🌐 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import this GitHub repo
3. Add environment variable:
   - `ANTHROPIC_API_KEY` = your Anthropic key
4. Click **Deploy** ✅

---

## 🔑 Get an Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to **API Keys** → **Create Key**
4. Paste into Vercel environment variables

---

## 🗺️ Roadmap

- [x] AI-powered camp search
- [x] User login & favorites
- [x] Booking & checkout flow
- [x] Privacy review system
- [ ] Real data from Ontario 211 API
- [ ] Camp operator dashboard
- [ ] Stripe payment integration
- [ ] Map view (Google Maps)
- [ ] Email notifications
- [ ] Mobile app (React Native)

---

## 🏗️ Built By

**GrowBuildLearn (GBL)** — Social Impact Enterprises  
Niagara Falls Innovation Hub  
[growbuildlearn.ca](https://growbuildlearn.ca)

---

## 📄 License

MIT — free to use and build on.
