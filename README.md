# Varanasi Dental Care — Dental Clinic Website Template

A fast, static (HTML + CSS + vanilla JS) dental clinic website — no backend, no build step, works on GitHub Pages.

**To reuse it for a new clinic you only edit `config.js`.**

## Project structure
```
index.html      page structure
styles.css      design (white/teal, Playfair Display + Inter)
script.js       behaviour: menu, gallery filters, FAQ, WhatsApp enquiry, SEO data
config.js       ALL clinic details  <-- edit this
robots.txt
sitemap.xml
assets/images/... put clinic photos here
```

## Empty values and `demoMode`

Leave any detail as `""` in `config.js` if you don't have it yet — nothing is ever invented.

| | `demoMode: true` | `demoMode: false` |
|---|---|---|
| Phone / address / hours / email not filled | shows a calm "Details to be added" line | that row is **hidden** |
| Call / WhatsApp with no number | button stays, tap shows a short note | **hidden** |
| Testimonials | shown only if real ones are added (either mode) | same |
| Gallery item with no photo | neutral placeholder tile | shown only if it has a real photo |

The page never shows `XXXXX`, `example.com`, `[Opening]`, `[Patient name]` or any bracketed placeholder.

## How to change things (all in `config.js`)
- **Clinic name / slogan / description / story** → `clinicName`, `clinicSlogan`, `clinicDescription`, `clinicStory`
- **Doctor** → `doctorName`, `doctorQualification`, `doctorSpecialization`, `doctorBio`
- **Phone / WhatsApp / Email** → `clinicPhone`, `clinicPhoneDisplay`, `whatsappNumber`, `email`
- **Address / hours** → `address`, `openingHours`
- **Google Maps** → paste the clinic's Maps embed URL into `googleMapsUrl`
- **Social links** → `instagramUrl`, `facebookUrl`, `twitterUrl` (empty = hidden)
- **Services** → edit the `services` list
- **Why choose us / process steps / about bullet points** → `whyUs`, `process`, `aboutPoints`
- **Testimonials** → add real, permissioned reviews as `{ quote, name }`. Empty list = section hidden.
- **Gallery** → add items with `label`, `category` (used for the filter chips) and `src`

## Replacing images
1. Upload a photo to e.g. `assets/images/hero/hero.jpg`
2. Set the matching path in `config.js` (`images.hero`, `images.about`, `images.doctor`, or a `gallery` item's `src`)
3. A missing or broken path always shows a clean placeholder — never a broken image icon.

## Appointment enquiry
The floating form on the hero validates name + phone, then opens **WhatsApp** with a pre-filled message to the clinic's number. It's an enquiry, not an automatic booking — the clinic confirms the time. No server needed.

## Deploy on GitHub Pages
1. Upload all files to the repo's `main` branch (root).
2. Settings → Pages → Source: `main` / root → Save.
3. Live at `https://<username>.github.io/<repo>/`.
4. For a client domain, update `websiteUrl` in `config.js`, canonical/og:url in `index.html`, and the URLs in `sitemap.xml`/`robots.txt`.
