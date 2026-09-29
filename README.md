# 🌱 goGreen

goGreen is a local Git contribution-graph experiment tool. It generates dated commits so you can test contribution visualizations, calendar patterns, and Git workflows in a disposable repository.

It should not be used to misrepresent professional activity, coursework, or open-source contributions.

## About

The tool creates one small `data.json` change per generated date. It previews every date and a calendar before it can write or push anything.

## Getting Started

Node.js 18+ and Git are required. No npm dependencies are needed.

Preview 100 unique random dates from the previous 365 completed days:

```bash
node index.js
```

Use `--seed` when you need the same preview again:

```bash
node index.js --count 20 --days 90 --seed classroom-demo
```

Pushing requires a clean working tree, a dedicated non-default branch, a GitHub `origin`, and explicit `--yes` confirmation:

```bash
git switch -c experiment/contribution-calendar
node index.js --count 100 --days 365 --seed classroom-demo --push --yes
```

Each generated commit changes only `data.json`, and commits are pushed to the current branch only after the full preview has been shown.

## Safety

- Dry run is the default.
- `--push` without `--yes` is rejected.
- `main` and `master` are always rejected.
- The origin must point to GitHub.
- The working tree must be clean before any commits are created.

## Tests

```bash
npm test
```

## Credits

Huge thanks to [Akshay Saini](https://github.com/akshaymarch7) for the original video behind this project.
