/* Voice + text receptionist UI. Free: uses only the visitor's browser (speech recognition + speech synthesis).
   Needs config.js, receptionist.js. Stores nothing and sends nothing anywhere by itself. */
(function () {
  "use strict";
  var C = (typeof CLINIC_CONFIG !== "undefined") ? CLINIC_CONFIG : null;
  var Rec = window.Receptionist;
  var $ = function (id) { return document.getElementById(id); };
  var fab = $("vrOpen"), panel = $("vrPanel");
  if (!C || !Rec || !fab || !panel) return;
  if (C.receptionist && C.receptionist.enabled === false) return;
  fab.hidden = false;

  var log = $("vrLog"), statusEl = $("vrStatus"), micBtn = $("vrMic"), input = $("vrInput"), speakChk = $("vrSpeak"), note = $("vrVoiceNote");
  var state = null, active = false, listening = false, speaking = false, recog = null, voice = null, lastSummary = null, greeted = false;
  if (C.demoMode) $("vrDemo").hidden = false;

  var okv = function (v) { return typeof v === "string" && v.trim() !== "" && !/\[|\]|X{3,}|example\.com/i.test(v); };
  function setStatus(t) { statusEl.textContent = t; }
  function toastMsg(t) { var el = $("toast"); if (!el) return setStatus(t); el.textContent = t; el.classList.add("on"); clearTimeout(toastMsg._t); toastMsg._t = setTimeout(function () { el.classList.remove("on"); }, 2800); }

  /* ---------- transcript ---------- */
  function addMsg(kind, text, speakText, urgent) {
    var d = document.createElement("div");
    d.className = "vr-msg " + kind + (urgent ? " urgent" : "");
    d.textContent = text;
    if (kind === "bot" && speakText && voice) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "vr-listen"; b.textContent = "Suniye";
      b.addEventListener("click", function () { speak(speakText, true); });
      d.appendChild(b);
    }
    log.appendChild(d);
    var body = log.parentElement; body.scrollTop = body.scrollHeight;
  }

  /* ---------- voice out (browser speech synthesis: fallback quality only) ---------- */
  function pickVoice() {
    if (!(window.speechSynthesis)) { voice = null; note.textContent = "Is browser mein awaaz mein jawab support nahi hai. Jawab text mein dikhenge."; return; }
    var vs = speechSynthesis.getVoices() || [];
    var hi = vs.filter(function (v) { return /^hi/i.test(v.lang); });
    var fem = /(female|lekha|kalpana|swara|heera|neerja|google|hindi|हिन्दी|हिंदी)/i;
    voice = hi.filter(function (v) { return fem.test(v.name) && !/\bmale\b/i.test(v.name); })[0] || hi[0] || vs.filter(function (v) { return /^en-IN/i.test(v.lang); })[0] || null;
    if (!voice) note.textContent = "Is phone mein Hindi awaaz install nahi mili, isliye jawab sirf text mein dikhenge. Phone Settings > Language > Text-to-speech mein Hindi voice data download kar sakte hain.";
    else note.textContent = "Awaaz: " + voice.name + " (" + voice.lang + "). Yeh browser ki free awaaz hai. Phone ke hisaab se robotic lag sakti hai. Behtar awaaz ke liye alag (paid ya limited) TTS service chahiye.";
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } else { pickVoice(); }

  function speak(text, force) {
    if (!voice || !(window.speechSynthesis)) return;
    if (!force && !speakChk.checked) return;
    stopListening();
    try { speechSynthesis.cancel(); } catch (e) {}
    var hindi = /^hi/i.test(voice.lang);
    var parts = String(text).split(/(?<=[।.!?])\s+/).filter(Boolean);
    speaking = true;
    parts.forEach(function (p, i) {
      var u = new SpeechSynthesisUtterance(p);
      u.voice = voice; u.lang = voice.lang; u.rate = hindi ? 0.92 : 0.88; u.pitch = 1.05;
      if (i === parts.length - 1) u.onend = u.onerror = function () { speaking = false; if (active) setStatus("Aapki baari. Mic dabayein ya type karein."); };
      speechSynthesis.speak(u);
    });
    setStatus("Bol rahi hoon...");
  }

  /* ---------- voice in (browser speech recognition) ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { micBtn.disabled = true; micBtn.title = "Is browser mein mic support nahi. Android Chrome mein kholein, ya type karein."; }
  else if (window.isSecureContext === false) { micBtn.disabled = true; micBtn.title = "Mic ke liye https page chahiye (GitHub Pages par chalega)."; }

  function stopListening() {
    if (recog && listening) { try { recog.abort(); } catch (e) {} }
    listening = false; micBtn.classList.remove("on"); micBtn.setAttribute("aria-pressed", "false");
  }
  function startListening() {
    if (!SR || micBtn.disabled) { setStatus("Mic is browser mein available nahi hai. Type karke baat kar sakte hain."); return; }
    if (!active) beginChat();
    if (speaking) { try { speechSynthesis.cancel(); } catch (e) {} speaking = false; }
    var finalText = "", gotError = false;
    try { recog = new SR(); } catch (e) { setStatus("Mic shuru nahi ho paya. Type karke baat karein."); return; }
    recog.lang = "hi-IN"; recog.interimResults = true; recog.continuous = false; recog.maxAlternatives = 1;
    recog.onstart = function () { listening = true; micBtn.classList.add("on"); micBtn.setAttribute("aria-pressed", "true"); setStatus("Sun rahi hoon... boliye."); };
    recog.onresult = function (e) {
      var interim = "";
      for (var i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript; else interim += e.results[i][0].transcript;
      }
      if (interim) setStatus("Sun rahi hoon: " + interim);
    };
    recog.onerror = function (e) {
      gotError = true; listening = false; micBtn.classList.remove("on");
      var m = {
        "not-allowed": "Mic ki permission band hai. Chrome ke address bar mein lock icon > Permissions > Microphone > Allow karein. Tab tak type karke baat kar sakte hain.",
        "service-not-allowed": "Is browser ne mic ki anumati nahi di. Type karke baat karein.",
        "no-speech": "Kuch sunai nahi diya. Mic dobara dabayein.",
        "network": "Speech service ke liye internet chahiye. Type karke baat kar sakte hain.",
        "audio-capture": "Mic nahi mila. Type karke baat kar sakte hain.",
        "aborted": ""
      };
      if (e.error !== "aborted") setStatus(m[e.error] || ("Mic error: " + e.error + ". Type karke baat kar sakte hain."));
    };
    recog.onend = function () {
      listening = false; micBtn.classList.remove("on"); micBtn.setAttribute("aria-pressed", "false");
      if (finalText.trim()) handleUser(finalText.trim());
      else if (!gotError) setStatus("Kuch sunai nahi diya. Mic dobara dabayein ya type karein.");
    };
    try { recog.start(); } catch (e) { setStatus("Mic shuru nahi hua. Dobara try karein."); }
  }

  /* ---------- conversation ---------- */
  function beginChat(silent) {
    active = true; state = Rec.newState(); lastSummary = null; $("vrSummary").hidden = true;
    if (silent) return;
    var g = Rec.respond("namaste", state, C);
    state = g.state;
    addMsg("bot", g.roman, g.deva);
    speak(g.deva);
    setStatus("Aapki baari. Mic dabayein ya type karein.");
  }
  function endChat() {
    active = false; stopListening();
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    speaking = false;
    setStatus("Baat band ho gayi. Dobara shuru karne ke liye kuch bhi type karein ya mic dabayein.");
    addMsg("sys", "Baat band ho gayi. Is page ne kuch save ya bheja nahi.");
  }
  function handleUser(text) {
    if (!active) beginChat(true);
    addMsg("user", text);
    var r = Rec.respond(text, state, C);
    state = r.state;
    addMsg("bot", r.roman, r.deva, r.flag === "urgent");
    if (r.summary) showSummary(r.summary);
    if (r.end) { speak(r.deva); setTimeout(endChat, 500); return; }
    speak(r.deva);
  }

  /* ---------- summary: copy / WhatsApp (user sends) / fill existing form ---------- */
  function summaryText(s) {
    return ["*Appointment REQUEST (voice receptionist, confirm nahi hui)*", "Service: " + s.service, "Date: " + s.date, "Time: " + s.time, "Naam: " + s.name].join("\n");
  }
  function showSummary(s) {
    lastSummary = s;
    var dl = $("vrSummaryList"); dl.textContent = "";
    [["Service", s.service], ["Din", s.date], ["Time", s.time], ["Naam", s.name]].forEach(function (p) {
      var dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = p[0]; dd.textContent = p[1]; dl.appendChild(dt); dl.appendChild(dd);
    });
    $("vrSummaryStatus").textContent = s.status;
    var wa = $("vrWa");
    if (okv(C.whatsappNumber)) { wa.href = "https://wa.me/" + C.whatsappNumber + "?text=" + encodeURIComponent(summaryText(s)); wa.hidden = false; } else wa.hidden = true;
    $("vrSummary").hidden = false;
    var body = log.parentElement; setTimeout(function () { body.scrollTop = body.scrollHeight; }, 50);
  }
  $("vrCopy").addEventListener("click", function () {
    if (!lastSummary) return;
    var t = summaryText(lastSummary);
    function fb() {
      var ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toastMsg("Summary copy ho gayi."); } catch (e) { toastMsg("Copy nahi hua. Text select karke copy karein."); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toastMsg("Summary copy ho gayi."); }, fb); else fb();
  });
  $("vrFill").addEventListener("click", function () {
    if (!lastSummary) return;
    var s = lastSummary, name = $("f-name"), date = $("f-date"), svc = $("f-service"), msg = $("f-message");
    if (name && s.name !== "Not given") name.value = s.name;
    if (date && s.dateIso && (!date.min || s.dateIso >= date.min)) date.value = s.dateIso;
    if (svc && s.service !== "Not given") { for (var i = 0; i < svc.options.length; i++) if (svc.options[i].text === s.service) { svc.selectedIndex = i; break; } }
    if (msg) msg.value = "Preferred time: " + s.time + ". (Voice receptionist se bani request)";
    closePanel();
    var f = $("appointment"); if (f && f.scrollIntoView) f.scrollIntoView({ behavior: "smooth", block: "center" });
    var ph = $("f-phone"); if (ph) setTimeout(function () { ph.focus(); }, 500);
    toastMsg("Form bhar diya. Apna phone number daalkar 'Send Enquiry' dabayein.");
  });

  /* ---------- panel open / close ---------- */
  function openPanel() {
    panel.hidden = false; fab.hidden = true;
    if (!greeted) {
      greeted = true;
      if (C.demoMode) addMsg("sys", "Yeh demo website hai. Jankari sample hai.");
      beginChat(); // opening the panel is a tap, so the browser allows the greeting to be spoken
    }
    setTimeout(function () { input.focus(); }, 50);
  }
  function closePanel() {
    stopListening(); try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} speaking = false;
    panel.hidden = true; fab.hidden = false; fab.focus();
  }
  fab.addEventListener("click", openPanel);
  $("vrClose").addEventListener("click", closePanel);
  $("vrEnd").addEventListener("click", function () { if (active) endChat(); else setStatus("Abhi koi baat chalu nahi hai."); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) closePanel(); });
  micBtn.addEventListener("click", function () { if (listening) stopListening(); else startListening(); });
  $("vrForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value.trim(); if (!v) return;
    input.value = ""; stopListening(); handleUser(v);
  });
  $("vrChips").addEventListener("click", function (e) { var q = e.target && e.target.getAttribute && e.target.getAttribute("data-q"); if (q) handleUser(q); });
  window.addEventListener("pagehide", function () { try { speechSynthesis.cancel(); } catch (e) {} });
})();
