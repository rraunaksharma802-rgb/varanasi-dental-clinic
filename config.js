/* =============================================================================
   SITE_CONFIG — the ONLY file to edit when re-branding this template for a
   new dental clinic. Leave any value as "" if you don't have it — nothing
   on this site is ever invented. See README.md for the full guide.

   demoMode: true  -> empty details show a calm "Details to be added" line
   demoMode: false -> empty details are hidden (no fake numbers, no broken links)
   ============================================================================= */

const SITE_CONFIG = {
  demoMode: true,

  /* ---- Clinic ---- */
  clinicName: "Varanasi Dental Care",
  clinicTagline: "Dental Care",
  clinicSlogan: "Healthy Smiles \u00B7 Brighter Lives",
  clinicDescription: "We provide gentle, expert dental care for your entire family. From routine check-ups to advanced treatments, your smile is in safe hands.",
  clinicStory: "At Varanasi Dental Care, we believe every smile matters. Our goal is to provide personalised, gentle and effective care in a comfortable environment — so every visit feels straightforward and every question gets answered.",
  aboutPoints: [
    "Patient-first approach",
    "Modern clinical environment",
    "Hygiene-focused care",
    "Clear treatment explanations",
    "Convenient appointment scheduling",
  ],
  city: "Varanasi",
  state: "Uttar Pradesh",

  /* ---- Doctor (leave "" if not available — never invent credentials) ---- */
  doctorName: "",
  doctorQualification: "",     // e.g. "BDS, MDS"
  doctorSpecialization: "",    // e.g. "Prosthodontics"
  doctorBio: "",               // 2–3 sentences supplied by the clinic

  /* ---- Contact (leave "" if not available) ---- */
  clinicPhone: "",             // tel: format, e.g. "+919876543210"
  clinicPhoneDisplay: "",      // e.g. "+91 98765 43210"
  whatsappNumber: "",          // e.g. "919876543210" (country code, no + or spaces)
  email: "",
  address: {
    line1: "",   // e.g. "123 Dental Care Road"
    line2: "",   // e.g. "Cantonment, Varanasi, Uttar Pradesh — 221002"
  },
  openingHours: [
    // { days: "Mon – Sat", time: "10:00 AM – 7:00 PM" },
    // { days: "Sunday", time: "Closed" },
  ],

  /* ---- Links (leave "" to hide) ---- */
  googleMapsUrl: "",
  websiteUrl: "https://rraunaksharma802-rgb.github.io/varanasi-dental-clinic/",
  instagramUrl: "",
  facebookUrl: "",
  twitterUrl: "",

  /* ---- Images: set a path (e.g. "assets/images/hero/hero.jpg") once real
     photos exist. Left as "" it shows a clean, labelled placeholder — never
     a stock photo pretending to be the real clinic. ---- */
  images: {
    hero: "",
    about: "",
    doctor: "",
  },
  gallery: [
    { label: "Reception",       category: "Reception",      src: "" },
    { label: "Treatment Room",  category: "Treatment Room", src: "" },
    { label: "Waiting Area",    category: "Waiting Area",   src: "" },
    { label: "Equipment",       category: "Equipment",      src: "" },
    { label: "Clinic Exterior", category: "Exterior",       src: "" },
  ],

  /* ---- Hero trust badges ---- */
  trustBadges: [
    { icon: "user",   label: "Experienced Care Team" },
    { icon: "tooth",  label: "Modern Equipment" },
    { icon: "shield", label: "Safe & Hygienic Environment" },
    { icon: "family", label: "Family-Friendly Clinic" },
  ],

  /* ---- WhatsApp messages ---- */
  messages: {
    general: "Hello, I would like to know more about your dental services.",
    appointment: "Hello, I would like to request a dental appointment.",
  },

  /* ---- Services (icon: tooth sparkle pulse bolt star layers gem family shield alert) ---- */
  services: [
    { icon: "tooth",   name: "General Dentistry",        desc: "Routine check-ups and basic dental care." },
    { icon: "sparkle", name: "Dental Cleaning",          desc: "Remove plaque and keep your teeth healthy." },
    { icon: "pulse",   name: "Root Canal Treatment",     desc: "Save your natural tooth with expert care." },
    { icon: "bolt",    name: "Dental Implants",          desc: "Long-lasting solution for missing teeth." },
    { icon: "star",    name: "Teeth Whitening",          desc: "Brighter smile, greater confidence." },
    { icon: "layers",  name: "Crowns & Bridges",         desc: "Restore strength and appearance." },
    { icon: "gem",     name: "Cosmetic Dentistry",       desc: "Enhance your smile's natural beauty." },
    { icon: "family",  name: "Family Dentistry",         desc: "Care for every generation." },
    { icon: "shield",  name: "Preventive Dentistry",     desc: "Stop problems before they worsen." },
    { icon: "alert",   name: "Emergency Dental Care",    desc: "Quick relief for urgent issues." },
  ],

  /* ---- Why choose us ---- */
  whyUs: [
    { icon: "user",   title: "Patient-first consultations",       desc: "Every visit starts with listening." },
    { icon: "tooth",  title: "Modern equipment",                  desc: "Contemporary tools and technique." },
    { icon: "shield", title: "Hygiene-focused care",               desc: "Sterile instruments, every visit." },
    { icon: "chat",   title: "Clear communication",                desc: "No jargon, no pressure." },
    { icon: "pulse",  title: "Transparent treatment discussions",  desc: "Costs and options explained upfront." },
    { icon: "clock",  title: "Convenient scheduling",              desc: "Appointments that fit your week." },
  ],

  /* ---- Treatment process ---- */
  process: [
    { icon: "user",  step: "01", title: "Consultation",             desc: "Discuss your concerns and goals." },
    { icon: "star",  step: "02", title: "Examination & Diagnosis",   desc: "A detailed check-up with modern technology." },
    { icon: "layers",step: "03", title: "Treatment Plan",            desc: "A personalised plan for your needs." },
    { icon: "check", step: "04", title: "Follow-up",                 desc: "Ongoing care for lasting results." },
  ],

  /* ---- Testimonials: genuine, permissioned reviews only. Empty = section hidden. ---- */
  testimonials: [
    // { quote: "Review text here.", name: "Patient name" },
  ],

  faqs: [
    { q: "How can I book an appointment?", a: "Use the appointment enquiry form on this page, call the clinic, or send a WhatsApp message. The clinic will confirm your final time." },
    { q: "What should I bring to my first visit?", a: "Any previous dental records, X-rays or prescriptions you have, and a list of any medicines you currently take." },
    { q: "How can I contact the clinic?", a: "You can call, message on WhatsApp, or email using the details in the Contact section." },
    { q: "Do you treat children?", a: "Yes — the clinic welcomes patients of all ages, with a gentle approach for younger children." },
    { q: "What are the clinic hours?", a: "See the opening hours in the Contact section. For urgent problems, please call the clinic directly." },
    { q: "How can I find the clinic?", a: "Use the address and the Google Maps link in the Contact section." },
  ],
};
