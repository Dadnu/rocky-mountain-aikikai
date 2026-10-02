# Rocky Mountain Aikikai website

Static site (HTML/CSS/JS, no build step) hosted on GitHub Pages.

## Pages
index, about, instructors, classes, gallery, announcements, contact.
Text that still needs confirming is marked on the page in yellow as `[...]` (class `todo`).
Search for `class="todo"` before launch and remove every one.

## Posting an announcement
1. On github.com open `data/announcements.json` and click the pencil (Edit).
2. Add an entry at the top of the list (keep the commas between entries):

```json
{
  "date": "2026-11-05",
  "title": "No class Thanksgiving week",
  "body": "The rec center is closed Nov 26-27. Regular classes resume Tuesday, Dec 1.",
  "expires": "2026-12-01",
  "pinned": true
}
```

- `date` and `expires` use YYYY-MM-DD. After `expires` the item disappears on its own. Leave `expires` out to keep it forever.
- `pinned: true` also shows the title in a red bar at the top of every page.
- In `body`, a blank line starts a new paragraph; `[text](https://link)` makes a link.
3. Click **Commit changes**. The site updates in about a minute.

If the announcements area says "could not be loaded", the JSON has a typo (usually a missing comma or quote). Paste it into https://jsonlint.com to find it.

## Local preview
`fetch()` does not work from file://, so serve the folder:
```
python -m http.server 8000
```
then open http://localhost:8000

## Custom domain
Do NOT add a CNAME file until DNS for rockymountainaikikai.com points at GitHub Pages.
At that point set the domain in Settings -> Pages (GitHub creates the CNAME file), then tick Enforce HTTPS.
