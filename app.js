(function () {
  "use strict";

  /* ---------- Analytics ---------- */
  var gaOn = /^G-[A-Z0-9]+$/.test(CONFIG.GA_ID);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (gaOn) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", CONFIG.GA_ID);
  }

  /* ---------- A/B testing (off unless CONFIG.experiment.enabled) ---------- */
  var exp = CONFIG.experiment || {};
  function pickVariant() {
    if (!exp.enabled) return "base";
    var forced = new URLSearchParams(location.search).get("v");
    if (forced === "control" || forced === "test") return forced;
    var key = "variant_" + exp.name, saved = null;
    try { saved = localStorage.getItem(key); } catch (e) {}
    if (saved === "control" || saved === "test") return saved;
    var v = Math.random() < exp.testShare ? "test" : "control";
    try { localStorage.setItem(key, v); } catch (e) {}
    return v;
  }
  var variant = pickVariant();
  var inTest = function (name) { return exp.enabled && exp.name === name && variant === "test"; };
  if (gaOn) gtag("set", "user_properties", { experiment: exp.enabled ? exp.name : "none", variant: variant });

  function track(name, params) {
    params = Object.assign({ experiment: exp.enabled ? exp.name : "none", variant: variant }, params || {});
    if (gaOn) gtag("event", name, params);
    else console.debug("[analytics off]", name, params);
  }

  /* ---------- State ---------- */
  var questions = QUESTIONS.filter(function (q) { return !q.extra && (!inTest("quiz_length") || q.short); });
  var params = new URLSearchParams(location.search);
  var shared = DESTINATIONS.filter(function (d) { return d.slug === params.get("d"); })[0];
  var answers = {};
  var step = -1; // -1 intro, 0..n-1 questions, n results
  var app = document.getElementById("app");
  var bar = document.getElementById("bar");

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function render() {
    app.innerHTML = "";
    bar.style.width = (step < 0 ? 0 : Math.round(100 * Math.min(step, questions.length) / questions.length)) + "%";
    if (step < 0) return renderIntro();
    if (step >= questions.length) return renderResults();
    renderQuestion(questions[step]);
    window.scrollTo(0, 0);
  }

  function renderIntro() {
    var box = el("section", "intro");
    if (shared) {
      var m = parseInt(params.get("m"), 10);
      var note = el("div", "card top shared");
      note.appendChild(el("p", "eyebrow", "A friend's result"));
      var sh = el("div", "card-head");
      var st = el("div");
      st.appendChild(el("h3", "", shared.name));
      st.appendChild(el("p", "country", shared.country));
      sh.appendChild(st);
      if (m > 0 && m <= 100) sh.appendChild(el("div", "match", m + "%"));
      note.appendChild(sh);
      note.appendChild(el("p", "blurb", shared.blurb));
      box.appendChild(note);
      track("shared_result_view", { shared_result: shared.name });
    }
    box.appendChild(el("p", "eyebrow", DESTINATIONS.length + " destinations, rated for trips from " + CONFIG.homeCity));
    box.appendChild(el("h1", "", shared ? "Where would you end up?" : "Where should you go next?"));
    box.appendChild(el("p", "lede", "Answer " + questions.length + " quick questions about weather, budget and what you like to do. Get three places that fit, from a ferry ride away to the middle of nowhere."));
    var go = el("button", "btn", "Find my destination");
    go.onclick = function () { step = 0; track("quiz_start", { question_count: questions.length }); render(); };
    box.appendChild(go);
    box.appendChild(el("p", "fine", "Takes about two minutes. No sign-up."));
    app.appendChild(box);
  }

  function renderQuestion(q) {
    var box = el("section", "question");
    box.appendChild(el("p", "eyebrow", "Question " + (step + 1) + " of " + questions.length));
    box.appendChild(el("h2", "", q.title));
    if (q.sub) box.appendChild(el("p", "sub", q.sub));
    var list = el("div", "options" + (q.grid ? " grid" : ""));
    q.options.forEach(function (o) {
      var b = el("button", "option" + (answers[q.id] === o.value ? " chosen" : ""));
      b.appendChild(el("span", "label", o.label));
      if (o.hint) b.appendChild(el("span", "hint", o.hint));
      b.onclick = function () {
        answers[q.id] = o.value;
        track("question_answered", { question_id: q.id, question_number: step + 1, answer: String(o.value) });
        step++;
        if (step >= questions.length) {
          var top = rankDestinations(answers)[0];
          track("quiz_complete", { top_result: top.dest.name, top_match: top.match });
        }
        render();
      };
      list.appendChild(b);
    });
    box.appendChild(list);
    if (step > 0) {
      var back = el("button", "link", "Back");
      back.onclick = function () { step--; track("question_back", { question_id: q.id }); render(); };
      box.appendChild(back);
    }
    app.appendChild(box);
  }

  function renderResults() {
    var ranked = rankDestinations(answers).slice(0, CONFIG.resultsShown);
    var box = el("section", "results");
    box.appendChild(el("p", "eyebrow", "Your matches"));
    box.appendChild(el("h2", "", "Pack for " + ranked[0].dest.name + "."));
    ranked.forEach(function (r, i) {
      var card = el("article", "card" + (i === 0 ? " top" : ""));
      var head = el("div", "card-head");
      var title = el("div");
      title.appendChild(el("h3", "", r.dest.name));
      title.appendChild(el("p", "country", r.dest.country));
      head.appendChild(title);
      head.appendChild(el("div", "match", r.match + "%"));
      card.appendChild(head);
      card.appendChild(el("p", "blurb", r.dest.blurb));
      if (r.flexible) card.appendChild(el("p", "when", "Best month for you: " + MONTHS[r.month - 1]));
      var ul = el("ul", "why");
      r.reasons.forEach(function (t) { ul.appendChild(el("li", "good", t)); });
      r.caveats.forEach(function (t) { ul.appendChild(el("li", "bad", t)); });
      card.appendChild(ul);
      var trip = el("div", "trip");
      trip.appendChild(el("p", "", "Getting there: " + r.dest.journey));
      if (r.dest.fare > 0) trip.appendChild(el("p", "", "Typical return fare: " + FARE_RANGES[r.dest.fare] + " CAD"));
      var link = travelLink(r.dest);
      var a = el("a", "", link.text);
      a.href = link.url; a.target = "_blank"; a.rel = "noopener";
      a.onclick = function () { track("travel_link_click", { destination: r.dest.name, link_type: r.dest.airport ? "flights" : "directions" }); };
      trip.appendChild(a);
      card.appendChild(trip);
      box.appendChild(card);
    });

    var actions = el("div", "actions");
    var share = el("button", "btn", "Share my result");
    share.onclick = function () {
      var url = location.origin + location.pathname + "?d=" + ranked[0].dest.slug + "&m=" + ranked[0].match + "&utm_source=share&utm_medium=result";
      var text = "My next trip should be " + ranked[0].dest.name + " (" + ranked[0].match + "% match). Where should you go?";
      track("result_share", { top_result: ranked[0].dest.name });
      if (navigator.share) navigator.share({ title: CONFIG.siteName, text: text, url: url }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(text + " " + url).then(function () { share.textContent = "Copied to clipboard"; });
    };
    var again = el("button", "btn ghost", "Start over");
    again.onclick = function () { answers = {}; step = -1; shared = null; track("quiz_restart"); render(); };
    actions.appendChild(share);
    actions.appendChild(again);
    box.appendChild(actions);
    box.appendChild(el("p", "fine", "Temperatures, costs and fares are rough estimates, not forecasts or quotes. Check entry rules and your government's travel advisories before you book."));
    app.appendChild(box);
    window.scrollTo(0, 0);
  }

  document.title = CONFIG.siteName + " | Find your next travel destination";
  render();
})();
