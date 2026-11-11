/* SITE SETTINGS */
const CONFIG = {
  siteName: "Where Next?",
  homeCity: "Vancouver",

  // Paste your GA4 Measurement ID here (looks like "G-AB12CD34EF"). Leave "" to keep tracking off.
  GA_ID: "",

  // How many matches to show on the result page.
  resultsShown: 3,

  // A/B TESTING. Off by default: every visitor gets the same base site.
  // To run a test later, set enabled to true and give the test a name. Each new visitor is then
  // randomly put in "control" or "test", and every analytics event carries that label.
  // One test is already wired up as an example: name "quiz_length" gives the "test" group
  // only the questions marked short: true in quiz.js.
  experiment: {
    enabled: false,
    name: "quiz_length",
    testShare: 0.5
  }
};
