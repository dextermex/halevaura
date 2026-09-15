# Reel reference frames

The site reads four creator reel start-frames from this folder. Nothing is shipped here by default,
because the frames must be the real, approved screenshots (known faces, content cleared for use).

Drop the four files in with exactly these names (9:16 portrait, JPG preferred, WebP or PNG also fine
if you update `src/lib/data.ts`):

```
public/reels/reel-1.jpg
public/reels/reel-2.jpg
public/reels/reel-3.jpg
public/reels/reel-4.jpg
```

Then edit the handle, 24h view count and manager note for each card in `src/lib/data.ts` (`REELS`).

Until the files exist, every reel slot renders an honest hatched placeholder that says
"Reel frame N · drop file in /reels" so nothing fake is shown on the page.
