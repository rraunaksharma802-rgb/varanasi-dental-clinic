/* =============================================================================
   SITE_CONFIG — the ONLY file to edit when re-branding this template for a
   new dental clinic. Leave any value as "" if you don't have it — nothing
   on this site is ever invented. See README.md for the full guide.

   Any detail left empty is simply hidden on the page (no fake numbers, no
   broken links, no "placeholder" text of any kind) — this applies always,
   regardless of demoMode. demoMode is currently unused by the page itself;
   it's kept here in case a future version needs a template/demo indicator.
   ============================================================================= */

// EDIT CLIENT INFORMATION HERE
const CLINIC_CONFIG = {
  // demoMode: true  = this is a SAMPLE site for showing clients. A visible demo notice is shown,
  //                    search engines are told not to index it, and the phone/address are NOT put in
  //                    the search-engine (schema) data.
  // demoMode: false = the clinic has verified every detail below. Set it ONLY then.
  demoMode: true,
  demoNotice: "Demo website. Clinic details, services and wording are sample content for demonstration, not a real clinic's verified information.",

  /* ---- Clinic ---- */
  clinicName: "Varanasi Dental Care",
  clinicTagline: "Dental Care",
  clinicSlogan: "Healthy Smiles \u00B7 Brighter Lives",
  clinicDescription: "Information about dental services, an easy appointment enquiry, and direct Call and WhatsApp contact. The clinic confirms your final appointment time.",
  clinicStory: "This page helps patients see the clinic's services and send an appointment enquiry. Details such as the doctor, timings and fees are shown only after the clinic has confirmed them. Replace this text with the clinic's own story.",
  aboutPoints: [
    "Send an appointment enquiry online",
    "Call or WhatsApp the clinic directly",
    "The clinic confirms your final time",
    "Ask about any service before you visit",
  ],
  city: "Varanasi",
  state: "Uttar Pradesh",

  /* ---- Doctor (leave "" if not available — never invent credentials) ---- */
  doctorName: "",
  doctorQualification: "",     // e.g. "BDS, MDS"
  doctorSpecialization: "",    // e.g. "Prosthodontics"
  doctorBio: "",               // 2–3 sentences supplied by the clinic

  /* ---- Contact (leave "" if not available) ---- */
  clinicPhone: "+917236839750",             // tel: format, e.g. "+919876543210"
  clinicPhoneDisplay: "+91 72368 39750",      // e.g. "+91 98765 43210"
  whatsappNumber: "917236839750",          // e.g. "919876543210" (country code, no + or spaces)
  email: "",
  address: {
    line1: "Rampur Jiwan",   // e.g. "123 Dental Care Road"
    line2: "Ghazipur, Uttar Pradesh",   // e.g. "Cantonment, Varanasi, Uttar Pradesh — 221002"
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
    logo: "",   // e.g. "assets/images/logo.svg" — leave "" to use the built-in tooth icon
    hero: "",   // e.g. "assets/images/hero-dental.jpg"
    clinic: "", // e.g. "assets/images/clinic-about.jpg"
    doctor: "", // e.g. "assets/images/doctor.jpg"
  },
  gallery: [
    { label: "Reception",       category: "Reception",      src: "" }, // e.g. "assets/images/gallery-01.jpg"
    { label: "Treatment Room",  category: "Treatment Room", src: "" }, // "assets/images/gallery-02.jpg"
    { label: "Waiting Area",    category: "Waiting Area",   src: "" }, // "assets/images/gallery-03.jpg"
    { label: "Equipment",       category: "Equipment",      src: "" }, // "assets/images/gallery-04.jpg"
    { label: "Clinic Exterior", category: "Exterior",       src: "" }, // "assets/images/gallery-05.jpg"
  ],

  /* ---- Hero trust badges ---- */
  // Only statements that are true of this website. Add claims about the clinic itself
  // (equipment, experience, hygiene) only after the clinic confirms them.
  trustBadges: [
    { icon: "check", label: "Easy appointment enquiry" },
    { icon: "phone", label: "Call or WhatsApp the clinic" },
    { icon: "clock", label: "Clinic confirms your final time" },
    { icon: "shield", label: "No sign-up needed" },
  ],

  /* ---- WhatsApp messages ---- */
  messages: {
    general: "Hello, I would like to know more about your dental services.",
    appointment: "Hello, I would like to request a dental appointment.",
  },

  /* ---- Voice / text receptionist (free, runs in the visitor's browser) ----
     enabled: false hides the receptionist completely.
     name: only the assistant's first name, not a claim about the clinic.
     The receptionist reads services, phone, WhatsApp, address, hours and doctor from this file.
     Anything left "" or empty is answered as "please confirm with the clinic". ---- */
  receptionist: { enabled: true, name: "Priya" },

  /* ---- Services (icon: tooth sparkle pulse bolt star layers gem family shield alert) ---- */
  services: [
    { icon: "tooth",   name: "General Dentistry", hi: "जनरल डेंटिस्ट्री",        desc: "Routine check-ups and basic dental care." },
    { icon: "sparkle", name: "Dental Cleaning", hi: "डेंटल क्लीनिंग",          desc: "Professional cleaning of teeth." },
    { icon: "pulse",   name: "Root Canal Treatment", hi: "रूट कैनाल ट्रीटमेंट",     desc: "Treatment for a badly damaged or infected tooth." },
    { icon: "bolt",    name: "Dental Implants", hi: "डेंटल इम्प्लांट",          desc: "Replacement for missing teeth." },
    { icon: "star",    name: "Teeth Whitening", hi: "टीथ व्हाइटनिंग",          desc: "Treatment to lighten tooth colour." },
    { icon: "layers",  name: "Crowns & Bridges", hi: "क्राउन और ब्रिज",         desc: "Caps and bridges for damaged or missing teeth." },
    { icon: "gem",     name: "Cosmetic Dentistry", hi: "कॉस्मेटिक डेंटिस्ट्री",       desc: "Treatments that improve how teeth look." },
    { icon: "family",  name: "Family Dentistry", hi: "फैमिली डेंटिस्ट्री",         desc: "Dental care for different age groups." },
    { icon: "shield",  name: "Preventive Dentistry", hi: "प्रिवेंटिव डेंटिस्ट्री",     desc: "Regular check-ups and care to prevent problems." },
    { icon: "alert",   name: "Urgent Dental Problems", hi: "अर्जेंट डेंटल प्रॉब्लम्स",   desc: "For urgent problems, call the clinic directly." },
  ],

  /* ---- Why choose us ---- */
  // Replace with points the clinic itself confirms. These only describe how this website works.
  whyUs: [
    { icon: "check", title: "Simple enquiry",         desc: "Send your preferred day and time in under a minute." },
    { icon: "clock", title: "Clinic confirms",        desc: "Your final time is confirmed by the clinic, not the website." },
    { icon: "phone", title: "Direct contact",         desc: "Call or WhatsApp the clinic whenever you prefer." },
    { icon: "chat",  title: "Questions welcome",      desc: "Ask about any service before you visit." },
    { icon: "pin",   title: "Details from the clinic", desc: "Timings, doctor and fees are shown once the clinic confirms them." },
    { icon: "user",  title: "Your details stay yours", desc: "The website stores nothing. Your enquiry goes to WhatsApp only when you press send." },
  ],

  /* ---- Treatment process ---- */
  process: [
    { icon: "user",  step: "01", title: "Consultation",             desc: "Discuss your concerns and goals." },
    { icon: "star",  step: "02", title: "Examination",               desc: "The dentist examines your teeth and explains what they find." },
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
    { q: "Do you treat children?", a: "Please ask the clinic by call or WhatsApp. The clinic will tell you which age groups it treats." },
    { q: "What are the clinic hours?", a: "See the opening hours in the Contact section. For urgent problems, please call the clinic directly." },
    { q: "How can I find the clinic?", a: "Use the address and the Google Maps link in the Contact section." },
  ],
};
