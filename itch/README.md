# Twitch Chaos Cats — itch.io wrapper

This folder contains the HTML5 wrapper used to publish the game on **itch.io**.
The actual game keeps running on Render — the page simply embeds the live game
in a fullscreen iframe (`twitch-chaos-cats.onrender.com`).

## How to upload to itch.io

1. Go to <https://itch.io> → sign in → click your avatar → **Upload new project**.
2. Set **Kind of project**: `HTML`.
3. Under **Uploads**, click **Upload files** and choose `twitch-chaos-cats.zip`.
   itch.io will detect `index.html` at the zip root as the entry point.
4. Fill in the project settings:
   - **Title**: `Twitch Chaos Cats`
   - **Short description**: a chaotic multiplayer game driven by the Twitch chat.
   - Upload a **cover image** and **screenshot(s)** (optional but recommended).
   - Add the tag `twitch` (and any others you like).
5. Create / publish the project. On the game page press **Play** — the wrapper
   will load and embed the live game from Render.

After publishing you can still tweak embedding in itch.io:
**Edit project → Uploads → Edit (next to the zip) → Embedded game options**
(set e.g. ratio, allow fullscreen) — no need to re-upload the zip for those.

## If embedded game is blank

Some browsers / embedded contexts may block third-party iframes. The wrapper
shows a fallback link **"open it in a new tab ↗"** in the top-right corner.
The game itself is fully playable in a normal browser tab on Render.

## Changing the game URL

Open `itch/index.html` and replace the two occurrences of
`https://twitch-chaos-cats.onrender.com/`, then rebuild the zip:

```powershell
Compress-Archive -Path itch\index.html -DestinationPath itch\twitch-chaos-cats.zip -Force
```

## Notes

- The game requires the streamer's Twitch channel to be hosted by the Render
  server (the Twitch bot processes `!join`, booster commands, etc.).
- This repo folder is **not** part of the game build — it's only for the itch.io
  listing.