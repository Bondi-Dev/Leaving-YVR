/* QUESTIONS AND MATCHING
   Each question has an id, a title and options. Every question here is asked, in this order.
   To add a question: add it here, then add a scorer with the same id in SCORERS below.
   "extra: true" questions are written and scored but switched off; delete the flag to ask them.
   "short: true" marks the questions a shorter test version would keep (see experiment in config.js). */

const IMPORTANCE = [
  { label: "Not for me", value: 0 },
  { label: "Nice to have", value: 1 },
  { label: "Important", value: 2 },
  { label: "The whole point", value: 3 }
];

const QUESTIONS = [
  { id: "month", short: true, title: "When do you want to travel?", grid: true,
    options: [{ label: "I'm flexible", value: 0 }].concat(
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(function (m, i) { return { label: m, value: i + 1 }; })) },
  { id: "temp", short: true, title: "What weather are you after?",
    options: [
      { label: "Hot", hint: "28°C and up", value: "hot" },
      { label: "Warm", hint: "21 to 28°C", value: "warm" },
      { label: "Mild", hint: "12 to 21°C", value: "mild" },
      { label: "Cold and snowy", hint: "Below 8°C", value: "cold" }] },
  { id: "rain", extra: true, title: "How do you feel about rainy season?",
    options: [
      { label: "Avoid it", value: "avoid" },
      { label: "Fine if it's cheaper and quieter", value: "ok" }] },
  { id: "budget", short: true, title: "What's your daily budget once you're there?", sub: "Per person, in Canadian dollars, not counting flights.",
    options: [
      { label: "Shoestring", hint: "Under $70", value: 1 },
      { label: "Moderate", hint: "$70 to $170", value: 2 },
      { label: "Comfortable", hint: "$170 to $350", value: 3 },
      { label: "Money is no object", hint: "$350 and up", value: 4 }] },
  { id: "fare", short: true, title: "How much would you spend on flights?", sub: "Return fare from Vancouver, per person.",
    options: [
      { label: "Nothing, I'd rather drive", value: 0 },
      { label: "Up to $500", value: 1 },
      { label: "Up to $900", value: 2 },
      { label: "Up to $1,500", value: 3 },
      { label: "Up to $2,200", value: 4 },
      { label: "Whatever it takes", value: 5 }] },
  { id: "flight", short: true, title: "How long a journey will you put up with?", sub: "Door to door from Vancouver, one way.",
    options: [
      { label: "A drive, a ferry or a short hop", value: 1 },
      { label: "Up to 6 hours", value: 2 },
      { label: "Up to 11 hours", value: 3 },
      { label: "Up to 18 hours", value: 4 },
      { label: "As long as it takes", value: 5 }] },
  { id: "length", title: "How long is the trip?",
    options: [
      { label: "A long weekend", value: 1 },
      { label: "About a week", value: 2 },
      { label: "Two weeks or more", value: 3 }] },
  { id: "remote", short: true, title: "How hard should it be to get there?",
    options: [
      { label: "Easy", hint: "Land at a major airport and you've arrived", value: 1 },
      { label: "One connection is fine", value: 2 },
      { label: "Several legs, no problem", value: 3 },
      { label: "The harder the better", hint: "Boats, small planes, the middle of nowhere", value: 4 }] },
  { id: "crowd", short: true, title: "Famous or obscure?",
    options: [
      { label: "The famous places are famous for a reason", value: "famous" },
      { label: "A mix", value: "mix" },
      { label: "Somewhere my friends haven't heard of", value: "obscure" }] },
  { id: "history", short: true, title: "History and ancient sites", options: IMPORTANCE },
  { id: "beach", short: true, title: "Beaches and warm water", options: IMPORTANCE },
  { id: "nature", short: true, title: "Landscapes and wildlife", options: IMPORTANCE },
  { id: "food", short: true, title: "Food", options: IMPORTANCE },
  { id: "city", title: "Big-city energy", options: IMPORTANCE },
  { id: "night", title: "Nightlife", options: IMPORTANCE },
  { id: "adventure", title: "Adventure", sub: "Hiking, diving, skiing and the like.", options: IMPORTANCE },
  { id: "pace", extra: true, title: "What pace do you want?",
    options: [
      { label: "Slow down and relax", value: "relax" },
      { label: "A balance", value: "mix" },
      { label: "See and do as much as possible", value: "packed" }] },
  { id: "company", extra: true, title: "Who's coming?",
    options: [
      { label: "Just me", value: "solo" },
      { label: "My partner", value: "couple" },
      { label: "Friends", value: "friends" },
      { label: "Family with kids", value: "family" }] },
  { id: "experience", extra: true, title: "How much have you travelled?",
    options: [
      { label: "This is my first big trip", value: "first" },
      { label: "A fair amount", value: "some" },
      { label: "I've done the obvious places", value: "seasoned" }] }
];

const TEMP_BANDS = { hot: [28, 45], warm: [21, 28], mild: [12, 21], cold: [-30, 8] };

function tempScore(pref, t) {
  var b = TEMP_BANDS[pref];
  if (t >= b[0] && t <= b[1]) return 1;
  var gap = t < b[0] ? b[0] - t : t - b[1];
  return Math.max(0, 1 - gap / 8);
}

function closeness(table, pref, level) { return table[pref][level - 1]; }
const REMOTE_FIT = { 1: [1, 0.6, 0.2, 0], 2: [1, 1, 0.5, 0.1], 3: [0.6, 0.8, 1, 0.8], 4: [0.1, 0.4, 0.8, 1] };
const CROWD_FIT = { famous: [0.2, 0.6, 1], mix: [0.7, 1, 0.7], obscure: [1, 0.5, 0.1] };
const COST_WORDS = ["", "very cheap", "affordable", "mid-range", "expensive"];
const INTEREST_WEIGHT = [0, 1, 2.5, 4.5];

function interest(key, phrase) {
  return function (d, v) {
    // "Not for me": lean slightly away from places known mainly for it, so results suit the person
    // instead of always favouring places that are good at everything.
    if (!v) return { w: 0.8, s: 1 - d[key] / 3 };
    // "The whole point" is strict: only world-class places score well.
    var s = v === 3 ? Math.pow(d[key] / 3, 2) : d[key] / 3;
    return { w: INTEREST_WEIGHT[v], s: s, good: d[key] === 3 ? phrase : null };
  };
}

/* Each scorer returns { w: weight, s: score from 0 to 1, good: reason text, bad: caveat text } or null. */
const SCORERS = {
  temp: function (d, v, ctx) {
    var t = tempIn(d, ctx.month), s = tempScore(v, t);
    return { w: 3, s: s, good: "Around " + t + "°C in " + MONTHS[ctx.month - 1], bad: "About " + t + "°C in " + MONTHS[ctx.month - 1] + ", not quite the weather you asked for" };
  },
  rain: function (d, v, ctx) {
    var wet = d.wet.indexOf(ctx.month) !== -1;
    return { w: v === "avoid" ? 2.5 : 0.5, s: wet ? 0 : 1, bad: MONTHS[ctx.month - 1] + " is the rainy or off season there" };
  },
  budget: function (d, v) {
    var over = d.cost - v;
    return { w: 3, s: over <= 0 ? 1 : Math.max(0, 1 - over * 0.5), good: v < 4 && d.cost <= v ? "Fits your budget (" + COST_WORDS[d.cost] + ")" : null, bad: "Likely to run over your budget" };
  },
  fare: function (d, v) {
    var over = d.fare - v;
    return { w: 3, s: over <= 0 ? 1 : Math.max(0, 1 - over * 0.5), bad: v === 0 ? "You'd need to fly" : "Flights likely cost more than you wanted" };
  },
  flight: function (d, v) {
    var over = d.far - v;
    return { w: 2.5, s: over <= 0 ? 1 : Math.max(0, 1 - over * 0.45), bad: "A longer journey than you wanted" };
  },
  length: function (d, v) {
    var s = 1;
    if (v === 1) s = d.far === 1 ? 1 : d.far === 2 && d.remote === 1 ? 0.5 : 0;
    if (v === 2) s = (d.far === 5 ? 0.4 : d.far === 4 ? 0.8 : 1) * (d.remote === 4 ? 0.5 : 1);
    return { w: 2.5, s: s, bad: "A lot of travel time for a trip this short" };
  },
  remote: function (d, v) {
    return { w: 2.5, s: closeness(REMOTE_FIT, v, d.remote), good: v >= 3 && d.remote >= 3 ? (d.remote === 4 ? "Properly hard to reach" : "Takes some effort to reach") : (v === 1 && d.remote === 1 ? "Easy to get to" : null), bad: v <= 2 ? "Takes more effort to reach than you wanted" : null };
  },
  crowd: function (d, v) {
    return { w: 2, s: closeness(CROWD_FIT, v, d.crowd), good: v === "obscure" && d.crowd === 1 ? "Well off the usual tourist trail" : null, bad: v === "obscure" && d.crowd === 3 ? "Very popular, so expect company" : null };
  },
  history: interest("history", "World-class history"),
  beach: interest("beach", "Outstanding beaches"),
  nature: interest("nature", "Spectacular landscapes and wildlife"),
  food: interest("food", "A serious food destination"),
  city: interest("city", "Real big-city energy"),
  night: interest("night", "Great nightlife"),
  adventure: interest("adventure", "Top-tier adventure"),
  pace: function (d, v) {
    if (v === "mix") return null;
    var s = v === "relax" ? (d.beach + d.nature + (3 - d.crowd)) / 8 : (d.city + d.history + d.adventure) / 7;
    return { w: 1.5, s: Math.min(1, s) };
  },
  company: function (d, v) {
    if (v === "family") return { w: 1.5, s: d.remote === 4 ? 0 : d.remote === 3 ? 0.5 : 1, bad: "A tough journey with kids" };
    if (v === "friends") return { w: 1, s: (d.night + d.adventure) / 5 };
    if (v === "couple") return { w: 1, s: (d.beach + d.food + d.nature) / 8 };
    return { w: 1, s: (d.city + d.adventure + d.food) / 7 };
  },
  experience: function (d, v) {
    if (v === "some") return null;
    if (v === "first") return { w: 1.5, s: (d.crowd / 3 + (4 - d.remote) / 3) / 2 };
    return { w: 1.5, s: ((3 - d.crowd) / 2 + (d.remote - 1) / 3) / 2 };
  }
};

/* For "I'm flexible", pick each destination's best month for the weather the person asked for. */
function bestMonth(d, tempPref) {
  var best = 1, bestScore = -1;
  for (var m = 1; m <= 12; m++) {
    var s = tempScore(tempPref || "warm", tempIn(d, m)) - (d.wet.indexOf(m) !== -1 ? 0.6 : 0);
    if (s > bestScore) { bestScore = s; best = m; }
  }
  return best;
}

function rankDestinations(answers) {
  return DESTINATIONS.map(function (d) {
    var flexible = !answers.month;
    var ctx = { month: flexible ? bestMonth(d, answers.temp) : answers.month };
    var total = 0, max = 0, good = [], bad = [];
    Object.keys(SCORERS).forEach(function (id) {
      var answer = answers[id];
      if (id === "rain" && answer === undefined) answer = "ok"; // always warn about rainy season
      if (answer === undefined) return;
      var r = SCORERS[id](d, answer, ctx);
      if (!r) return;
      total += r.w * r.s; max += r.w;
      if (r.s >= 0.85 && r.good) good.push({ text: r.good, w: r.w });
      if (r.s <= 0.5 && r.bad) bad.push({ text: r.bad, w: r.w });
    });
    good.sort(function (a, b) { return b.w - a.w; });
    bad.sort(function (a, b) { return b.w - a.w; });
    return {
      dest: d, match: max ? Math.round(100 * total / max) : 0,
      month: ctx.month, flexible: flexible,
      reasons: good.slice(0, 4).map(function (g) { return g.text; }),
      caveats: bad.slice(0, 2).map(function (b) { return b.text; })
    };
  }).sort(function (a, b) { return b.match - a.match; });
}

if (typeof module !== "undefined") module.exports = { QUESTIONS: QUESTIONS, rankDestinations: rankDestinations };
