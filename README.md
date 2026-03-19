# pi-protected-branches

A Pi extension that prevents accidental commits and pushes to protected branches.

## Features

Protects these branches:
- `main`
- `master`
- `production`

## Behaviors

- **Blocking mode:** When Pi runs a git commit/push command, shows a confirmation dialog
- **Warning mode:** Shows a notification when user types a protected branch command
- **Info:** Displays protected branch list on session start

## Usage

Install the extension:

```bash
ln -s ~/pi-extensions/pi-protected-branches-ext ~/.pi/agent/extensions/pi-protected-branches-ext
```

Attempting to commit or push to a protected branch will trigger a confirmation prompt.