# 🪕 SoundLink — Professional Network for Indian Musicians & Artists

> **A LinkedIn Clone Tailored for Indian Classical, Semi-Classical, Bollywood Playback, Ghazal, Sufi & Indo-Western Fusion Artists.**

SoundLink connects Indian musicians, vocalists, accompanists, session players, and Sabha organizers with a sophisticated **Golden Yellow & Warm Espresso Brown** aesthetic.

---

## 🚀 Live Demo & Development Server
The application is running live at:
- **Local:** [http://localhost:3000](http://localhost:3000)

---

## 🎨 Golden Yellow & Warm Brown Design Theme
- **Backgrounds:** Deep rich warm espresso & teakwood tones (`#0e0b08`, `#17120d`, `#1e1812`) replacing cold bluish slates.
- **Accents:** Golden yellow, honey amber, and antique bronze (`#f59e0b`, `#fbbf24`, `#d97706`, `#d4af37`).
- **Cards & Surfaces:** Subtle warm borders (`#32291e`), golden glow highlights (`glow-gold`), and warm creamy ivory typography (`#f2ebe1`, `#c5b096`).
- **Status Badges:** Emerald green for "Open for Concerts / Takes" (giving a royal Indian emerald-and-gold aesthetic).

---

## 🪕 Indian Music Context & Features

### 1. Authentic Indian Musician Personas
- **Aavya Sharma** (Kirana Gharana Classical & Bollywood Playback Vocalist — Mumbai)
- **Rohan Kulkarni** (Farrukhabad & Punjab Gharana Tabla Virtuoso — Pune)
- **Ananya Iyer** (AIR 'A' Grade Carnatic Violinist & Gamaka Specialist — Chennai)
- **Kabir Mehta** (Imdadkhani Gharana Sitarist & Indo-Fusion Producer — Bengaluru / Delhi)
- **Vikram Sengupta** (Bansuri Maestro & Film Score Composer — Kolkata / Mumbai)
- **Meera Nair** (Mridangam Artist & Konnakol Specialist — Bengaluru)

### 2. Tailored Indian Music Instruments & Traditions
- **Instruments:** Sitar, Tabla, Bansuri (Bamboo Flute), Harmonium, Carnatic Violin, Mridangam, Tanpura, Dholak, Sarangi, Saraswati Veena, Konnakol.
- **Traditions:** Hindustani Classical, Carnatic Classical, Sufi, Ghazal, Bollywood Playback, Semi-Classical, Thumri, Indo-Fusion, Devotional / Bhajan.
- **Pricing & Remuneration:** Displayed authentically in Indian Rupees (**₹**) across gig listings, artist cards, and proposals (e.g. `₹40,000 - ₹85,000 / concert`).

### 3. Procedural Indian Classical Audio Synthesizer
- Built-in Web Audio API engine plays:
  - **Tanpura Drone:** Resonant 4-string drone in traditional C# *Sa* (Pa - Sa - Sa - Kharaj Sa) with rich acoustic harmonics.
  - **Raga Melodies:** Sitar & Bansuri microtonal meend pitch glides in *Raag Yaman* and *Raag Bhairavi*.
  - **Tabla Percussion:** Resonant *Bayah* bass pitch-drops paired with crisp *Dayah* treble strokes in *Keherwa* and *Teentaal*!
  - Also supports user-uploaded `.mp3` and `.wav` bandishes/recordings.

### 4. Indian Gigs & Baithaks Board
- Classical Baithaks at NCPA & Saptak
- Chennai Margazhi Season Sabha Kacheris
- Bollywood OTT Period Drama tracking takes in Mumbai
- High-profile royal wedding Sangeet orchestras in Udaipur
- Multi-city Classical Fusion tours

## Vercel deployment freshness

`vercel.json` disables caching for app routes, HTML, API responses, and public files so browsers and the CDN do not retain stale deploy content. Vite's fingerprinted `/assets/` build files remain cached as immutable for one year. The profile-preview API also sends `no-store` directly.

Artist demo data is stored in `localStorage` under the Vercel Git commit SHA. A new commit therefore loads the latest bundled profile data, while edits remain available during reloads of the same deployment. Local development uses a stable `local` key.

After deploying, check response headers with `curl.exe -I https://suraag-web.vercel.app/v-sreenidhe` and `curl.exe -I -H "User-Agent: Twitterbot" https://suraag-web.vercel.app/v-sreenidhe`. Both should include a no-store `Cache-Control` directive. For an asset URL under `/assets/` copied from the page source, expect `public, max-age=31536000, immutable`.
