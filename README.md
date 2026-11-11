# Where Next?

A travel-destination quiz for people starting in Vancouver, BC. Static site: no server, no build step, free to host.

## Files

| File | What it does | Edit it when |
|---|---|---|
| `config.js` | Site name, Google Analytics ID, A/B split | Connecting analytics or changing the test |
| `destinations.js` | The list of places and their scores | Adding or correcting a destination |
| `quiz.js` | The questions and the matching rules | Adding a question or changing how answers are weighted |
| `app.js` | Screens, buttons, tracking | Changing how the quiz behaves |
| `style.css` | Colours and layout | Changing the look |
| `index.html` | The page shell | Changing the title or share preview text |

## Try it on your computer

Double-click `index.html`.

## Put it online (GitHub Pages)

1. Create a free GitHub account and a new public repository, for example `where-next`.
2. In Terminal, from this folder:

```bash
git init
git add .
git commit -m "First version"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/where-next.git
git push -u origin main
```

3. On GitHub: Settings → Pages → Source "Deploy from a branch" → Branch `main`, folder `/ (root)` → Save.
4. After a minute or two it is live at `https://YOUR_USERNAME.github.io/where-next/`.

To publish a change later: `git add . && git commit -m "what changed" && git push`.

## Connect Google Analytics

1. In Google Analytics, create a GA4 property and a Web data stream for your live address.
2. Copy the Measurement ID (it starts with `G-`).
3. Paste it into `GA_ID` in `config.js` and push.

Until an ID is set, events are printed in the browser console instead, so you can see what would be sent.

### Events sent

| Event | When | Extra details |
|---|---|---|
| `quiz_start` | Start button clicked | `question_count` |
| `question_answered` | Each answer | `question_id`, `question_number`, `answer` |
| `question_back` | Back clicked | `question_id` |
| `quiz_complete` | Last answer given | `top_result`, `top_match` |
| `travel_link_click` | Google Flights or directions link clicked | `destination`, `link_type` |
| `result_share` | Share clicked | `top_result` |
| `shared_result_view` | Someone opens a shared link | `shared_result` |
| `quiz_restart` | Start over clicked | |

Every event also carries `experiment` and `variant`. With no test running these are `none` and `base`.

## A/B testing (off by default)

Everyone gets the same base site until you turn a test on in `config.js` (`experiment.enabled: true`). Each new visitor is then randomly placed in `control` or `test` and keeps that group on return visits. Add `?v=control` or `?v=test` to the address to preview a group.

One test is ready as an example: with `name: "quiz_length"`, the test group gets only the questions marked `short: true` in `quiz.js`. To compare groups in GA4, register `variant` as a custom dimension (Admin → Custom definitions) and break reports down by it.

For a new test, pick a new name and add `if (inTest("your_name")) { ... }` in `app.js` where the two versions should differ. Run one test at a time.

## Add a destination

Open `destinations.js`, copy any row, and change the values. The column guide is at the top of the file. Nothing else needs to change.

## Known limits

- Temperatures are estimated from each place's warmest and coolest month. Daily costs, fares and journey times are rough estimates. None of it is live data.
- Everything is rated for a traveller starting in Vancouver. Fare ranges are set in `FARE_RANGES` in `destinations.js`.
- Shared links carry the destination and match in the address (`?d=...&m=...`).
- The scores are one person's judgement. Correct any place you know better.
