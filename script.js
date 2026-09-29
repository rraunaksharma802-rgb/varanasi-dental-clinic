(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const C = (typeof SITE_CONFIG !== "undefined") ? SITE_CONFIG : null;
  if (!C) { console.error("SITE_CONFIG missing — load config.js before script.js"); return; }
  const DEMO = !!C.demoMode;

  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ok = (v) => !!v && String(v).trim() !== "" && !/\[|\]|X{3,}|example\.com/i.test(String(v));
  const phoneOk = ok(C.clinicPhone), waOk = ok(C.whatsappNumber);
  const mapsOk = /^https?:\/\//.test(C.googleMapsUrl || "");
  const tel = () => `tel:${C.clinicPhone}`;
  const wa = (msg) => `https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  const hasAddr = ok(C.address.line1) && ok(C.address.line2);

  const toast = (msg) => {
    const t = $("#toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 3200);
  };
  const demoNote = (el, text) => el.addEventListener("click", (e) => { e.preventDefault(); toast(text); });

  /* ---------- icons ---------- */
  const P = {
    tooth: '<path d="M12 2.5c-2.300 0-3.900 1.400-5 2.900-1 1.900-1 4.800 0 8.600.500 2 1 6.500 2 6.500s1-3 1-5 1-3 2-3 2 1 2 3 0 5 1 5 1.500-4.500 2-6.500c1-3.800 1-6.700 0-8.600-1.100-1.500-2.700-2.900-5-2.900z"/>',
    shield: '<path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.500 2.500M15.500 15.500L18 18M18 6l-2.500 2.500M8.500 15.500L6 18"/>',
    star: '<path d="M12 3l2.600 5.600 6.100.6-4.600 4.100 1.300 6-5.400-3.200-5.400 3.200 1.300-6-4.600-4.100 6.100-.6z"/>',
    pulse: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/>',
    gem: '<path d="M6 3h12l3 5-9 13L3 8z"/><path d="M3 8h18M9 3l3 5 3-5"/>',
    family: '<circle cx="8" cy="7" r="2.400"/><circle cx="16" cy="7" r="2.400"/><path d="M3 20c0-3 2.200-5 5-5s5 2 5 5M11 20c0-3 2.200-5 5-5s5 2 5 5"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    phone: '<path d="M22 16.900v3a2 2 0 01-2.200 2A19.800 19.800 0 013 5.200 2 2 0 015 3h3a2 2 0 012 1.700c.1.800.3 1.700.6 2.500a2 2 0 01-.5 2.100L8.900 10.600a16 16 0 006.500 6.500l1.300-1.300a2 2 0 012.100-.5c.8.300 1.600.5 2.500.6a2 2 0 011.700 2z"/>',
    chat: '<path d="M21 11.500a8.400 8.400 0 01-8.900 8.400 8.500 8.500 0 01-3.800-.9L3 20l1-5.300a8.400 8.400 0 1117-3.200z"/>',
    pin: '<path d="M12 21s7-6.500 7-12a7 7 0 10-14 0c0 5.500 7 12 7 12z"/><circle cx="12" cy="9" r="2.400"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    mail: '<path d="M3 5h18v14H3z"/><path d="M3 6l9 7 9-7"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.800"/><path d="M21 16l-5-5-8 8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.500-6 8-6s8 2 8 6"/>',
  };
  const icon = (n, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.tooth}</svg>`;
  $$("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));

  function fillVisual(el, src, alt, label, ico) {
    const placeholder = () => { el.classList.add("is-placeholder"); el.innerHTML = `<div class="ph">${icon(ico, "icon icon-lg")}<b>${esc(label)}</b></div>`; };
    if (!src) return placeholder();
    const img = new Image(); img.alt = alt; img.loading = "lazy"; img.decoding = "async";
    img.onerror = placeholder;
    img.onload = () => { el.classList.remove("is-placeholder"); el.innerHTML = ""; el.appendChild(img); };
    img.src = src;
  }

  /* ---------- brand / meta ---------- */
  document.title = `${C.clinicName} — General & Cosmetic Dentistry in ${C.city}`;
  if (ok(C.websiteUrl)) { const c = $('link[rel="canonical"]'); if (c) c.href = C.websiteUrl; const o = $('meta[property="og:url"]'); if (o) o.content = C.websiteUrl; }
  $("#logo-icon").innerHTML = icon("tooth");
  $$(".logo-mark").forEach((el) => { if (!el.innerHTML) el.innerHTML = icon("tooth"); });
  $("#brand-name").textContent = C.clinicName.split(" ")[0] || C.clinicName;
  $("#brand-city").textContent = C.clinicTagline;
  $("#hero-slogan").textContent = C.clinicSlogan;
  $("#hero-desc").textContent = C.clinicDescription;
  $("#banner-icon").innerHTML = icon("tooth");

  /* ---------- CTAs ---------- */
  $$("[data-call]").forEach((a) => { if (phoneOk) a.href = tel(); else if (DEMO) { a.href = "#contact"; demoNote(a, "Phone number will be added here"); } else a.hidden = true; });
  $$("[data-wa]").forEach((a) => {
    const msg = C.messages[a.dataset.wa] || C.messages.general;
    if (waOk) a.href = wa(msg); else if (DEMO) { a.href = "#contact"; a.removeAttribute("target"); demoNote(a, "WhatsApp number will be added here"); } else a.hidden = true;
  });
  if (!$$(".sticky-cta a").filter((a) => !a.hidden).length) $(".sticky-cta").hidden = true;

  /* ---------- trust badges ---------- */
  $("#badges").innerHTML = (C.trustBadges || []).map((b) => `<div class="badge"><span class="badge-icon">${icon(b.icon)}</span><span>${esc(b.label)}</span></div>`).join("");

  /* ---------- visuals ---------- */
  fillVisual($("#hero-visual"), C.images.hero, "Patient at the dental clinic", "Clinic Photo", "tooth");
  fillVisual($("#about-visual"), C.images.about, "Inside the clinic", "Clinic Interior", "image");
  fillVisual($("#doctor-visual"), C.images.doctor, `Portrait of ${C.doctorName || "the dentist"}`, "Doctor Photo", "user");

  /* ---------- about ---------- */
  $("#clinic-story").textContent = C.clinicStory;
  $("#about-ticks").innerHTML = (C.aboutPoints || []).map((p) => `<li>${esc(p)}</li>`).join("");

  /* ---------- doctor ---------- */
  const dn = ok(C.doctorName) ? C.doctorName : "", dq = ok(C.doctorQualification) ? C.doctorQualification : "";
  const ds = ok(C.doctorSpecialization) ? C.doctorSpecialization : "", db = ok(C.doctorBio) ? C.doctorBio : "";
  $("#doc-name").textContent = dn || "Meet the Specialist";
  $("#doc-qual").textContent = [dq, ds].filter(Boolean).join(" \u00B7 ");
  $("#doc-bio").textContent = db || (dn ? "" : "Doctor details will be added here.");

  /* ---------- services ---------- */
  $("#services-grid").innerHTML = C.services.map((s) => {
    const msg = `Hello, I would like to know more about ${s.name}.`;
    const link = waOk ? wa(msg) : "#appointment";
    return `<article class="s-card"><a class="s-inner" href="${link}" ${waOk ? 'target="_blank" rel="noopener"' : ""}><div class="icon-wrap">${icon(s.icon)}</div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></a></article>`;
  }).join("");
  $("#f-service").innerHTML += C.services.map((s) => `<option>${esc(s.name)}</option>`).join("") + "<option>Other</option>";

  /* ---------- why us ---------- */
  $("#why-grid").innerHTML = C.whyUs.map((w) => `<div class="why-item"><span class="why-icon">${icon(w.icon)}</span><div><b>${esc(w.title)}</b><p>${esc(w.desc)}</p></div></div>`).join("");

  /* ---------- process ---------- */
  $("#process-list").innerHTML = C.process.map((p) => `<li><span class="p-circle">${icon(p.icon)}</span><span class="num">${p.step}</span><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></li>`).join("");

  /* ---------- gallery + filters ---------- */
  const gal = C.gallery.filter((g) => g.src || DEMO);
  if (!gal.length) { $("#gallery").hidden = true; $("#nav-gallery").hidden = true; }
  else {
    const cats = ["All", ...new Set(gal.map((g) => g.category).filter(Boolean))];
    $("#filter-row").innerHTML = cats.map((c, i) => `<button type="button" class="chip${i === 0 ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
    const render = (cat) => {
      const items = gal.filter((g) => cat === "All" || g.category === cat);
      $("#gallery-grid").innerHTML = items.map((_, i) => `<figure class="gal-item" id="gal-${i}"></figure>`).join("");
      items.forEach((g, i) => {
        const el = $(`#gal-${i}`); fillVisual(el, g.src, g.label, g.label, "image");
        if (g.src) { const cap = document.createElement("figcaption"); cap.textContent = g.label; el.appendChild(cap); }
      });
    };
    render("All");
    $$(".chip", $("#filter-row")).forEach((btn) => btn.addEventListener("click", () => {
      $$(".chip", $("#filter-row")).forEach((b) => b.classList.toggle("active", b === btn));
      render(btn.dataset.cat);
    }));
  }

  /* ---------- testimonials removed from layout unless present; kept out of reference design, so skip rendering silently if no container ---------- */

  /* ---------- FAQ ---------- */
  $("#faq-list").innerHTML = C.faqs.map((f, i) => `
    <div class="faq-item">
      <h3><button type="button" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">${esc(f.q)}<span class="sign" aria-hidden="true">+</span></button></h3>
      <div class="a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" hidden><p>${esc(f.a)}</p></div>
    </div>`).join("");
  $$(".faq-item button").forEach((btn) => btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const open = btn.getAttribute("aria-expanded") !== "true";
    $$(".faq-item").forEach((o) => {
      const b = $("button", o), p = $(".a", o), isThis = o === item, state = isThis ? open : false;
      b.setAttribute("aria-expanded", state); p.hidden = !state; o.classList.toggle("open", state); $(".sign", b).textContent = state ? "\u2212" : "+";
    });
  }));

  /* ---------- contact ---------- */
  const tba = '<em class="tba-text">Details to be added</em>';
  const rows = [];
  if (hasAddr) rows.push(["pin", "Address", esc(`${C.address.line1}, ${C.address.line2}`)]); else if (DEMO) rows.push(["pin", "Address", tba]);
  if (phoneOk) rows.push(["phone", "Phone", `<a href="${tel()}">${esc(C.clinicPhoneDisplay || C.clinicPhone)}</a>`]); else if (DEMO) rows.push(["phone", "Phone", tba]);
  if (waOk) rows.push(["chat", "WhatsApp", `<a href="${wa(C.messages.general)}" target="_blank" rel="noopener">${esc(C.clinicPhoneDisplay || C.whatsappNumber)}</a>`]); else if (DEMO) rows.push(["chat", "WhatsApp", tba]);
  const hrs = (C.openingHours || []).filter((h) => ok(h.time)).map((h) => `${esc(h.days)}: ${esc(h.time)}`);
  if (hrs.length) rows.push(["clock", "Opening Hours", hrs.join("<br>")]); else if (DEMO) rows.push(["clock", "Opening Hours", tba]);
  if (ok(C.email)) rows.push(["mail", "Email", `<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`]); else if (DEMO) rows.push(["mail", "Email", tba]);
  $("#info-list").innerHTML = rows.map(([i, l, v]) => `<li><span class="icon-slot">${icon(i)}</span><span><b>${l}</b><span>${v}</span></span></li>`).join("");
  if (mapsOk) $("#map-embed").innerHTML = `<iframe src="${C.googleMapsUrl}" style="border:0;width:100%;height:100%" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Clinic location map"></iframe>`;
  else $("#map-embed").innerHTML = `<div class="ph">${icon("pin", "icon icon-lg")}<b>Google Maps</b><small>${DEMO ? "Add the clinic's Maps link in config.js" : "Location to be added"}</small></div>`;

  /* ---------- footer ---------- */
  $("#f-brand").textContent = C.clinicName;
  $("#f-desc").textContent = C.clinicSlogan;
  $("#f-services").innerHTML = C.services.slice(0, 6).map((s) => `<a href="#services">${esc(s.name)}</a>`).join("");
  const soc = [["Facebook", C.facebookUrl], ["Instagram", C.instagramUrl], ["Twitter", C.twitterUrl]].filter(([, u]) => /^https?:\/\//.test(u || ""));
  const socHtml = soc.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`).join("");
  $("#f-social").innerHTML = socHtml; $("#f-social2").innerHTML = socHtml || (DEMO ? "<span>Add social links in config.js</span>" : "");
  $("#f-copy").textContent = `\u00A9 ${new Date().getFullYear()} ${C.clinicName}. All rights reserved.`;

  /* ---------- mobile menu ---------- */
  const menuBtn = $("#menuBtn"), nav = $("#nav");
  const setMenu = (open) => { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });

  /* ---------- appointment enquiry -> WhatsApp ---------- */
  const form = $("#appointment"), status = $("#formStatus");
  const dateEl = $("#f-date"); if (dateEl) dateEl.min = new Date().toISOString().split("T")[0];
  const setStatus = (t, err) => { status.textContent = t; status.classList.toggle("error", !!err); };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const name = (d.get("name") || "").trim(), phone = (d.get("phone") || "").trim();
    $("#f-name").removeAttribute("aria-invalid"); $("#f-phone").removeAttribute("aria-invalid");
    if (name.length < 2) { $("#f-name").setAttribute("aria-invalid", "true"); $("#f-name").focus(); return setStatus("Please enter your name.", true); }
    if (!/^[+\d][\d\s-]{8,14}$/.test(phone) || phone.replace(/\D/g, "").length < 10) { $("#f-phone").setAttribute("aria-invalid", "true"); $("#f-phone").focus(); return setStatus("Please enter a valid 10-digit phone number.", true); }
    if (!waOk) return setStatus(DEMO ? "Demo: add the clinic WhatsApp number in config.js to enable this." : "WhatsApp enquiry is not available right now — please call the clinic.", true);
    const msg = `${C.messages.appointment}\n\nName: ${name}\nPhone: ${phone}\nService: ${d.get("service") || "Not specified"}\nPreferred date: ${d.get("date") || "Flexible"}\nPreferred time: ${d.get("time") || "Flexible"}\nMessage: ${(d.get("message") || "").trim() || "\u2014"}`;
    setStatus("Opening WhatsApp with your enquiry\u2026", false);
    window.open(wa(msg), "_blank", "noopener");
    form.reset();
  });

  /* ---------- structured data ---------- */
  const dentist = { "@context": "https://schema.org", "@type": "Dentist", name: C.clinicName, description: C.clinicDescription };
  if (ok(C.websiteUrl)) dentist.url = C.websiteUrl;
  if (phoneOk) dentist.telephone = C.clinicPhone;
  if (ok(C.email)) dentist.email = C.email;
  if (hasAddr) dentist.address = { "@type": "PostalAddress", streetAddress: C.address.line1, addressLocality: C.city, addressRegion: C.state, addressCountry: "IN" };
  if (mapsOk) dentist.hasMap = C.googleMapsUrl;
  const sameAs = soc.map(([, u]) => u); if (sameAs.length) dentist.sameAs = sameAs;
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: C.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  $("#schema-block").textContent = JSON.stringify([dentist, faq]);
})();
