/* Hinglish receptionist LOGIC. Fixed rules, not an AI model.
   Reads everything about the clinic from CLINIC_CONFIG (config.js). Never invents hours,
   fees, doctors or services. Never says an appointment is booked: it only writes a REQUEST.
   Works in the browser and in Node (for tests). */
(function (root) {
  "use strict";

  var DAY_NAMES = ["Ravivar", "Somvar", "Mangalvar", "Budhvar", "Guruvar", "Shukravar", "Shanivar"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WEEKDAYS = [
    ["sunday", "sun", "ravivar", "itwar", "इतवार", "रविवार"],
    ["monday", "mon", "somvar", "सोमवार"],
    ["tuesday", "tue", "mangalvar", "मंगलवार"],
    ["wednesday", "wed", "budhvar", "बुधवार"],
    ["thursday", "thu", "guruvar", "brihaspativar", "veervar", "गुरुवार", "वीरवार"],
    ["friday", "fri", "shukravar", "शुक्रवार"],
    ["saturday", "sat", "shanivar", "शनिवार"]
  ];

  function norm(t) { return " " + String(t || "").toLowerCase().replace(/[.,!?;"'()]/g, " ").replace(/\s+/g, " ").trim() + " "; }
  function has(t, words) { for (var i = 0; i < words.length; i++) if (t.indexOf(words[i]) !== -1) return true; return false; }
  function hasWord(t, words) { for (var i = 0; i < words.length; i++) if (t.indexOf(" " + words[i] + " ") !== -1) return true; return false; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addDays(now, n) { var d = new Date(now.getTime()); d.setDate(d.getDate() + n); return d; }
  function dateLabel(d) { return DAY_NAMES[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()]; }
  function filled(v) { return typeof v === "string" && v.trim() !== "" && !/\[|\]|X{3,}|example\.com/i.test(v); }

  var STOP = [" stop ", " band karo", " band kar", " bye ", " alvida", " bas ", " rehne do", " ruko ", "बंद करो", "बंद कर", "रुको", "अलविदा", "बाय"];
  var EMERGENCY = ["emergency", "bahut dard", "bohot dard", "bahot dard", "asahya", "unbearable", "bleeding", "khoon", "khun ", "sujan", "swelling", "soojan", "chehra phool", "bukhar", "fever", "saans", "breath", "accident", "daant toot", "बहुत दर्द", "असहनीय", "खून", "सूजन", "चेहरा फूल", "बुखार", "सांस", "एक्सीडेंट", "इमरजेंसी", "इमरजेन्सी", "दांत टूट"];
  var MEDICAL = ["dard", "pain", "cavity", "keeda", "sadan", "infection", "pus", "masoode", "gums", "ilaj", "ilaaj", "dawai", "medicine", "antibiotic", "painkiller", "kya problem", "kya hua", "diagnos", "kaun si dawa", "दर्द", "कीड़ा", "सड़न", "मसूड", "इलाज", "दवा", "दवाई", "इन्फेक्शन"];
  var GREET = [" hello", " hi ", " hii", " hey", "namaste", "namaskar", "pranam", "good morning", "good evening", "नमस्ते", "नमस्कार", "हेलो", "हैलो"];
  var APPT = ["appointment", "apointment", "book", "booking", "milna", "dikhana", "dikhwana", "check up", "checkup", "check-up", "slot", "aana hai", "ana hai", "अपॉइंटमेंट", "अपोइंटमेंट", "बुक", "मिलना", "दिखाना", "आना है", "टाइम चाहिए", "चेकअप"];
  var SERVICES_Q = ["service", "kya kya", "kaun kaun", "kaun si", "list", "सर्विस", "सेवा", "क्या क्या", "कौन कौन"];
  var HOURS = ["timing", "time kya", "kab khula", "kab tak", "khula", "open", "band hota", "kitne baje", "hours", "टाइमिंग", "समय क्या", "कब खुल", "कितने बजे", "खुला"];
  var ADDRESS = ["address", "kahan", "kaha hai", "location", "pata", "kidhar", "kaise pahunch", "map", "पता", "कहां", "कहाँ", "लोकेशन", "कहा है"];
  var FEES = ["fees", "fee ", "kitna paisa", "kitne paise", "charge", "cost", "price", "rate", "kharcha", "kitna lagega", "kitne ka", "फीस", "कितना पैसा", "कितने पैसे", "चार्ज", "खर्च", "कितना लगेगा", "रेट"];
  var DOCTORS = ["doctor", "dentist", "dr.", " dr ", "डॉक्टर", "डाक्टर"];
  var HUMAN = ["staff", "insaan", "human", "call karo", "call kar", "baat karni", "baat karna", "phone number", "number do", "contact", "whatsapp", "स्टाफ", "बात करनी", "बात करना", "नंबर", "कॉल", "व्हाट्सएप"];
  var THANKS = ["thanks", "thank you", "shukriya", "dhanyavad", "dhanyawad", "शुक्रिया", "धन्यवाद", "थैंक"];
  var SKIP = [" nahi", " nahin", " no ", " skip", " mat ", " rehne do", "नहीं", "नही", "स्किप", "रहने दो"];
  var CHANGE = ["badal", "change", "dobara", "phir se", "naya", "बदल", "दोबारा", "फिर से"];

  // Service keyword -> words a patient may say. The service itself comes from config.js.
  var ALIASES = [
    ["root canal", ["root canal", "rct", "रूट कैनाल", "रूटकैनाल"]],
    ["implant", ["implant", "इम्प्लांट", "इंप्लांट"]],
    ["whitening", ["whitening", "safed", "व्हाइटनिंग", "सफेद"]],
    ["cleaning", ["cleaning", "scaling", "safai", "सफाई", "क्लीनिंग"]],
    ["crown", ["crown", "bridge", "क्राउन", "ब्रिज"]],
    ["cosmetic", ["cosmetic", "smile makeover", "कॉस्मेटिक"]],
    ["family", ["family", "फैमिली", "परिवार"]],
    ["preventive", ["preventive", "प्रिवेंटिव"]],
    ["general", ["general", "check up", "checkup", "check-up", "चेकअप", "जनरल"]],
    ["urgent", ["urgent", "अर्जेंट"]]
  ];

  function services(C) { return (C && C.services) || []; }
  function sName(s) { return s.name; }
  function sHi(s) { return s.hi || s.name; }
  function matchService(t, C) {
    var list = services(C);
    for (var a = 0; a < ALIASES.length; a++) {
      if (has(t, ALIASES[a][1])) {
        for (var i = 0; i < list.length; i++) if (list[i].name.toLowerCase().indexOf(ALIASES[a][0]) !== -1) return list[i];
      }
    }
    for (var j = 0; j < list.length; j++) if (t.indexOf(list[j].name.toLowerCase()) !== -1) return list[j];
    return null;
  }

  function extractDate(raw, now) {
    var t = norm(raw), d = null, word = null;
    if (hasWord(t, ["parso", "parson"]) || has(t, ["परसों", "परसो"])) { d = addDays(now, 2); word = "Parso"; }
    else if (hasWord(t, ["kal", "tomorrow", "kl"]) || has(t, ["कल"])) { d = addDays(now, 1); word = "Kal"; }
    else if (hasWord(t, ["aaj", "today", "aj"]) || has(t, ["आज"])) { d = addDays(now, 0); word = "Aaj"; }
    if (d) return { text: word + " (" + dateLabel(d) + ")", iso: iso(d) };
    for (var i = 0; i < WEEKDAYS.length; i++) {
      for (var j = 0; j < WEEKDAYS[i].length; j++) {
        var w = WEEKDAYS[i][j];
        var found = /^[a-z]+$/.test(w) ? hasWord(t, [w]) : t.indexOf(w) !== -1;
        if (found) {
          var diff = (i - now.getDay() + 7) % 7; if (diff === 0) diff = 7;
          var dd0 = addDays(now, diff);
          return { text: dateLabel(dd0) + " (agle " + DAY_NAMES[i] + ")", iso: iso(dd0) };
        }
      }
    }
    function build(dd, mm) {
      if (!(dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12)) return null;
      var y = now.getFullYear(), c = new Date(y, mm - 1, dd);
      if (c.getMonth() !== mm - 1) return null;
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (c < today) c = new Date(y + 1, mm - 1, dd);
      return { text: dateLabel(c), iso: iso(c) };
    }
    var m = t.match(/(\d{1,2})\s*[\/\-]\s*(\d{1,2})/);
    if (m) { var r = build(parseInt(m[1], 10), parseInt(m[2], 10)); if (r) return r; }
    var mn = t.match(/(\d{1,2})\s*(?:th|st|nd|rd)?\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/);
    if (mn) { var r2 = build(parseInt(mn[1], 10), MONTHS.map(function (x) { return x.toLowerCase(); }).indexOf(mn[2]) + 1); if (r2) return r2; }
    var mo = t.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(\d{1,2})\b/);
    if (mo) { var r3 = build(parseInt(mo[2], 10), MONTHS.map(function (x) { return x.toLowerCase(); }).indexOf(mo[1]) + 1); if (r3) return r3; }
    return null;
  }

  function extractTime(raw) {
    var t = norm(raw), part = null, clock = null;
    if (has(t, ["subah", "morning", "सुबह"])) part = "subah";
    else if (has(t, ["dopahar", "afternoon", "दोपहर"])) part = "dopahar";
    else if (has(t, ["shaam", "sham", "evening", "शाम"])) part = "shaam";
    else if (has(t, ["raat", "night", "रात"])) part = "raat";
    var m = t.match(/(\d{1,2})[:.](\d{2})\s*(am|pm|baje|बजे)?/);
    if (m && parseInt(m[1], 10) <= 23 && parseInt(m[2], 10) <= 59) {
      clock = pad(parseInt(m[1], 10)) + ":" + m[2] + (m[3] === "am" || m[3] === "pm" ? " " + m[3].toUpperCase() : "");
    } else {
      var m2 = t.match(/(\d{1,2})\s*(baje|bje|बजे|am|pm)/);
      if (m2) {
        var h = parseInt(m2[1], 10);
        if (h >= 1 && h <= 12) clock = h + (m2[2] === "am" || m2[2] === "pm" ? " " + m2[2].toUpperCase() : " baje");
      }
    }
    if (!clock && !part) return null;
    return { text: part && clock ? part + " " + clock : (clock || part) };
  }

  function cleanName(raw) {
    var s = String(raw || "").trim();
    s = s.replace(/\b(mera naam|my name is|naam hai|mera nam|i am|main hoon|main hu|hai|hoon|hu)\b/gi, " ");
    s = s.replace(/मेरा नाम|नाम है|मैं हूँ|मैं हूं|है|हूँ|हूं/g, " ");
    s = s.replace(/[^A-Za-zऀ-ॿ\s]/g, " ").replace(/\s+/g, " ").trim();
    if (!s || s.length > 40) return null;
    return s.replace(/\b([a-z])/g, function (c) { return c.toUpperCase(); });
  }

  function newState() { return { stage: "idle", appt: { date: null, dateIso: null, time: null, name: null, service: null }, nameAsked: false }; }

  function phoneInfo(C) {
    var disp = filled(C.clinicPhoneDisplay) ? C.clinicPhoneDisplay : (filled(C.clinicPhone) ? C.clinicPhone : "");
    if (disp) return { r: "Clinic ka number: " + disp + ". WhatsApp bhi kar sakte hain.", d: "क्लिनिक का नंबर है " + disp.replace(/\D/g, "").split("").join(" ") + "। आप व्हाट्सएप भी कर सकते हैं।" };
    return { r: "Clinic ka number abhi website par set nahi hai.", d: "क्लिनिक का नंबर अभी वेबसाइट पर सेट नहीं है।" };
  }

  function summary(st, C) {
    var a = st.appt, n = filled(C.clinicName) ? C.clinicName : "Clinic";
    return {
      clinic: n + (C.demoMode ? " [DEMO]" : ""),
      service: a.service || "Not given", date: a.date || "Not given", dateIso: a.dateIso || null,
      time: a.time || "Not given", name: a.name || "Not given",
      status: "REQUEST ONLY. Abhi confirm nahi hui. Clinic staff confirm karega."
    };
  }

  function nextAsk(st) {
    var a = st.appt;
    if (!a.date) return { stage: "ask_date", r: "Aap kis din aana chahenge? Jaise 'kal', 'Somvar', ya '28 Oct'.", d: "आप किस दिन आना चाहेंगे? जैसे कल, सोमवार, या अट्ठाईस अक्टूबर।" };
    if (!a.time) return { stage: "ask_time", r: "Theek hai. Time kaun sa theek rahega? Jaise 'subah 11 baje' ya 'shaam 5 baje'.", d: "ठीक है। कौन सा समय ठीक रहेगा? जैसे सुबह ग्यारह बजे, या शाम पाँच बजे।" };
    if (!st.nameAsked) return { stage: "ask_name", r: "Request ki summary mein naam likhna ho to bata dijiye. Naam dena zaruri nahi hai, 'skip' bol sakte hain. Phone number main nahi maangti.", d: "रिक्वेस्ट की समरी में नाम लिखना हो तो बता दीजिए। नाम देना ज़रूरी नहीं है, स्किप बोल सकते हैं। फ़ोन नंबर मैं नहीं माँगती।" };
    return null;
  }

  function respond(text, state, C, now) {
    C = C || (typeof CLINIC_CONFIG !== "undefined" ? CLINIC_CONFIG : {});
    now = now || new Date();
    var st = state ? clone(state) : newState();
    var t = norm(text);
    var demo = !!C.demoMode, tag = demo ? " (sample jankari)" : "", tagD = demo ? " (सैंपल जानकारी)" : "";
    var clinic = filled(C.clinicName) ? C.clinicName : "clinic";
    var me = (C.receptionist && filled(C.receptionist.name)) ? C.receptionist.name : "receptionist";
    function out(r, d, extra) { var o = { roman: r, deva: d, state: st }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }

    if (!t.trim()) return out("Mujhe kuch sunai nahi diya. Dobara bol dijiye ya type kar dijiye.", "मुझे कुछ सुनाई नहीं दिया। दोबारा बोल दीजिए या टाइप कर दीजिए।");

    if (has(t, STOP)) return out("Theek hai, conversation band kar rahi hoon. Dhanyavad!", "ठीक है, बातचीत बंद कर रही हूँ। धन्यवाद!", { end: true });

    if (has(t, EMERGENCY)) {
      return out("Yeh sunkar mujhe chinta ho rahi hai. Bahut zyada dard, sujan, bleeding, bukhar, saans lene mein dikkat ya chot jaisi halat mein appointment ka intezaar mat kijiye. Turant kisi qualified dentist ya najdiki hospital ke emergency vibhag se sampark kijiye.",
        "यह सुनकर मुझे चिंता हो रही है। बहुत ज़्यादा दर्द, सूजन, खून, बुखार, साँस लेने में दिक्कत या चोट जैसी हालत में अपॉइंटमेंट का इंतज़ार मत कीजिए। तुरंत किसी योग्य डेंटिस्ट या नज़दीकी अस्पताल के इमरजेंसी विभाग से संपर्क कीजिए।", { flag: "urgent" });
    }

    var inFlow = st.stage === "ask_date" || st.stage === "ask_time" || st.stage === "ask_name";
    var wantsAppt = has(t, APPT);
    var pre = "", preD = "";

    if (has(t, MEDICAL) && st.stage !== "ask_name") {
      var medR = "Main sirf reception mein madad karti hoon, isliye dard ya ilaaj ke bare mein salah nahi de sakti. Iske liye qualified dentist se dikhana sahi rahega.";
      var medD = "मैं सिर्फ़ रिसेप्शन में मदद करती हूँ, इसलिए दर्द या इलाज के बारे में सलाह नहीं दे सकती। इसके लिए किसी योग्य डेंटिस्ट को दिखाना सही रहेगा।";
      if (!inFlow && !wantsAppt) return out(medR + " Chahein to main appointment request note kar sakti hoon.", medD + " चाहें तो मैं अपॉइंटमेंट रिक्वेस्ट नोट कर सकती हूँ।");
      if (!inFlow) { pre = medR + " "; preD = medD + " "; }
    }

    if (st.stage === "done" && has(t, CHANGE)) {
      st = newState(); st.stage = "ask_date";
      return out("Theek hai, naye sire se likhte hain. Aap kis din aana chahenge?", "ठीक है, नए सिरे से लिखते हैं। आप किस दिन आना चाहेंगे?");
    }
    var starting = false;
    if (wantsAppt && !inFlow) { st = newState(); st.stage = "ask_date"; starting = true; inFlow = true; }

    if (inFlow) {
      var a = st.appt;
      if (st.stage === "ask_name") {
        if (has(t, SKIP) || t.trim() === "no") { a.name = null; st.nameAsked = true; }
        else {
          var nm = (extractDate(text, now) || extractTime(text) || matchService(t, C) || has(t, APPT)) ? null : cleanName(text);
          if (!nm) return out("Naam samajh nahi aaya. Dobara bata dijiye, ya 'skip' bol dijiye.", "नाम समझ नहीं आया। दोबारा बता दीजिए, या स्किप बोल दीजिए।");
          a.name = nm; st.nameAsked = true;
        }
      } else {
        var dt = extractDate(text, now), tm = extractTime(text), sv = matchService(t, C);
        if (dt && !a.date) { a.date = dt.text; a.dateIso = dt.iso; }
        if (tm && !a.time) a.time = tm.text;
        if (sv && !a.service) a.service = sv.name;
        if (!dt && !tm && !sv && !starting) {
          var again = nextAsk(st);
          var lead = st.stage === "ask_date" ? "Date samajh nahi aayi." : "Time samajh nahi aaya.";
          var leadD = st.stage === "ask_date" ? "तारीख़ समझ नहीं आई।" : "समय समझ नहीं आया।";
          return out(lead + " " + again.r, leadD + " " + again.d);
        }
      }
      var nx = nextAsk(st);
      if (nx) {
        st.stage = nx.stage;
        var intro = starting ? "Zaroor, main appointment request note kar leti hoon. Dhyan rahe, main booking confirm nahi kar sakti, sirf request clinic tak pahunchane ke liye details likhti hoon. " : "";
        var introD = starting ? "ज़रूर, मैं अपॉइंटमेंट रिक्वेस्ट नोट कर लेती हूँ। ध्यान रहे, मैं बुकिंग कन्फर्म नहीं कर सकती, सिर्फ़ रिक्वेस्ट के लिए जानकारी लिखती हूँ। " : "";
        return out(pre + intro + nx.r, preD + introD + nx.d);
      }
      st.stage = "done";
      var ph = phoneInfo(C);
      return out("Maine aapki appointment REQUEST note kar li hai, lekin yeh abhi booked ya confirm nahi hai. Clinic ka staff availability dekh kar aapko confirm karega. Neeche summary hai. " + ph.r,
        "मैंने आपकी अपॉइंटमेंट रिक्वेस्ट नोट कर ली है, लेकिन यह अभी बुक या कन्फर्म नहीं हुई है। क्लिनिक का स्टाफ उपलब्धता देखकर आपको कन्फर्म करेगा। नीचे समरी है। " + ph.d,
        { summary: summary(st, C) });
    }

    if (has(t, THANKS)) return out("Aapka swagat hai! Aur kuch madad chahiye to bataiye.", "आपका स्वागत है! और कुछ मदद चाहिए तो बताइए।");

    if (has(t, FEES)) return out("Fees ya kharcha jaanch ke baad dentist hi sahi bata sakte hain, aur yeh ilaaj par nirbhar karta hai. Website par fees set nahi hai, isliye clinic se call ya WhatsApp par poochh lijiye.",
      "फीस या खर्च जाँच के बाद डेंटिस्ट ही सही बता सकते हैं, और यह इलाज पर निर्भर करता है। वेबसाइट पर फीस सेट नहीं है, इसलिए क्लिनिक से कॉल या व्हाट्सएप पर पूछ लीजिए।");

    var sv2 = matchService(t, C);
    if (sv2 && !has(t, HOURS) && !has(t, ADDRESS)) {
      return out(sv2.name + ": " + sv2.desc + " Yeh website par likhi jankari hai" + tag + ". Kya yeh clinic mein available hai, kitna lagega, yeh clinic se confirm karna hoga. Chahein to appointment request note kar loon?",
        sHi(sv2) + ": यह वेबसाइट पर लिखी जानकारी है" + tagD + "। यह क्लिनिक में उपलब्ध है या नहीं, और कितना खर्च लगेगा, यह क्लिनिक से कन्फर्म करना होगा। चाहें तो मैं अपॉइंटमेंट रिक्वेस्ट नोट कर लूँ?");
    }
    if (has(t, SERVICES_Q) || (has(t, ["treatment"]) && !has(t, MEDICAL))) {
      var L = services(C);
      if (!L.length) return out("Website par services ki list abhi set nahi hai. Clinic se call ya WhatsApp par poochh lijiye.", "वेबसाइट पर सर्विसेज़ की सूची अभी सेट नहीं है। क्लिनिक से कॉल या व्हाट्सएप पर पूछ लीजिए।");
      return out("Website par ye services likhi hain" + tag + ": " + L.map(sName).join(", ") + ". Kya clinic mein available hain, yeh clinic se confirm karein. Kisi ke liye appointment request chahiye to bol dijiye.",
        "वेबसाइट पर ये सर्विसेज़ लिखी हैं" + tagD + ": " + L.map(sHi).join(", ") + "। क्लिनिक में उपलब्ध हैं या नहीं, यह क्लिनिक से कन्फर्म करें। किसी के लिए अपॉइंटमेंट रिक्वेस्ट चाहिए तो बोल दीजिए।");
    }
    if (has(t, HOURS)) {
      var hrs = (C.openingHours || []).filter(function (h) { return h && filled(h.time); });
      if (!hrs.length) return out("Clinic ki timing abhi website par confirm nahi hai. Kripya clinic ko call ya WhatsApp karke poochh lijiye.", "क्लिनिक की टाइमिंग अभी वेबसाइट पर कन्फर्म नहीं है। कृपया क्लिनिक को कॉल या व्हाट्सएप करके पूछ लीजिए।");
      var txt = hrs.map(function (h) { return h.days + ": " + h.time; }).join("; ");
      return out("Clinic ki timing" + tag + ": " + txt + ". Asli din aur time clinic se confirm kar lijiye.", "क्लिनिक की टाइमिंग" + tagD + ": " + txt + "। असली दिन और समय क्लिनिक से कन्फर्म कर लीजिए।");
    }
    if (has(t, ADDRESS)) {
      var ad = C.address || {};
      if (filled(ad.line1) && filled(ad.line2)) return out("Website par address" + tag + ": " + ad.line1 + ", " + ad.line2 + ".", "वेबसाइट पर पता" + tagD + ": " + ad.line1 + ", " + ad.line2 + "।");
      return out("Clinic ka address abhi website par set nahi hai. Clinic se poochh lijiye.", "क्लिनिक का पता अभी वेबसाइट पर सेट नहीं है। क्लिनिक से पूछ लीजिए।");
    }
    if (has(t, HUMAN)) { var p = phoneInfo(C); return out("Bilkul, aap seedhe clinic staff se baat kar sakte hain. " + p.r, "बिल्कुल, आप सीधे क्लिनिक स्टाफ से बात कर सकते हैं। " + p.d); }
    if (has(t, DOCTORS)) {
      if (filled(C.doctorName)) return out("Website par doctor ka naam: " + C.doctorName + (filled(C.doctorQualification) ? ", " + C.doctorQualification : "") + ".", "वेबसाइट पर डॉक्टर का नाम: " + C.doctorName + "।");
      return out("Doctor ki jankari abhi website par confirm nahi hai. Clinic se poochh lijiye. Aap appointment request bhi de sakte hain.", "डॉक्टर की जानकारी अभी वेबसाइट पर कन्फर्म नहीं है। क्लिनिक से पूछ लीजिए। आप अपॉइंटमेंट रिक्वेस्ट भी दे सकते हैं।");
    }
    if (has(t, GREET)) return out("Namaste! Main " + me + ", " + clinic + " ki virtual receptionist" + tag + ". Main ek automatic assistant hoon, insaan nahi. Services, timing ya appointment request mein madad kar sakti hoon. Bataiye, kya madad chahiye?",
      "नमस्ते! मैं " + me + " हूँ, " + clinic + " की वर्चुअल रिसेप्शनिस्ट। मैं एक ऑटोमैटिक असिस्टेंट हूँ, इंसान नहीं। सर्विसेज़, टाइमिंग या अपॉइंटमेंट रिक्वेस्ट में मदद कर सकती हूँ। बताइए, क्या मदद चाहिए?");

    return out("Maaf kijiye, yeh mujhe poori tarah samajh nahi aaya. Main services, timing, address ya appointment request mein madad kar sakti hoon. Chahein to clinic staff se seedhe baat kar lijiye.",
      "माफ़ कीजिए, यह मुझे पूरी तरह समझ नहीं आया। मैं सर्विसेज़, टाइमिंग, पता या अपॉइंटमेंट रिक्वेस्ट में मदद कर सकती हूँ। चाहें तो क्लिनिक स्टाफ से सीधे बात कर लीजिए।");
  }

  var api = { respond: respond, newState: newState, extractDate: extractDate, extractTime: extractTime };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Receptionist = api;
})(typeof window !== "undefined" ? window : globalThis);
