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

## How missing details are handled

Leave any value as `""` in `config.js` if you don't have it yet — nothing is ever invented.
If a detail isn't filled in, that specific item is simply **hidden** (no "Details to be added",
no `XXXXX`, no broken Call/WhatsApp button). For example:

- No phone number → the Call button is hidden everywhere (header, hero, sticky bar, footer)
- No WhatsApp number → the WhatsApp button is hidden everywhere
- No address/hours/email → that row is left out of the Contact section
- No Google Maps link → the map is hidden
- Nothing in Contact at all → the whole Contact section is hidden
- No social links → the Follow Us area is hidden
- No real photo for an image slot → a clean neutral icon tile is shown instead (never a broken image, never a fake photo)
- No genuine testimonials → the Testimonials section is hidden

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
1. Upload a photo into `assets/images/` (e.g. `assets/images/hero-dental.jpg`)
2. Set the matching path in `config.js` — `images.logo`, `images.hero`, `images.clinic`, `images.doctor`, or a `gallery` item's `src`
3. A missing or broken path always shows a clean neutral icon tile — never a broken image, never a fake stock photo

## Appointment enquiry
The floating form on the hero validates name + phone, then opens **WhatsApp** with a pre-filled message to the clinic's number. It's an enquiry, not an automatic booking — the clinic confirms the time. No server needed.

## Deploy on GitHub Pages
1. Upload all files to the repo's `main` branch (root).
2. Settings → Pages → Source: `main` / root → Save.
3. Live at `https://<username>.github.io/<repo>/`.
4. For a client domain, update `websiteUrl` in `config.js`, canonical/og:url in `index.html`, and the URLs in `sitemap.xml`/`robots.txt`.
