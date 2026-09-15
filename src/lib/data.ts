export const NAV = [
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'The network', href: '#network' },
  { label: 'Your team', href: '#team' },
  { label: 'FAQ', href: '#faq' },
]

/** Reel reference slots. Files are expected at public/reels/reel-N.jpg (or .webp / .png). */
export const REELS = [
  { id: 1, handle: '@creator.one', views: '1.2M / 24H', note: 'Match this energy', src: './reels/reel-1.jpg' },
  { id: 2, handle: '@creator.two', views: '640K / 24H', note: 'Same hook, 2 seconds', src: './reels/reel-2.jpg' },
  { id: 3, handle: '@creator.three', views: '120K / 24H', note: 'Mirror the angle', src: './reels/reel-3.jpg' },
  { id: 4, handle: '@creator.four', views: '890K / 24H', note: 'Caption stays playful', src: './reels/reel-4.jpg' },
]

export const FAQ = [
  { q: 'What do I actually have to do?', a: 'Film, and upload. You open the app, look at this week’s references, film them, and send your clips in one upload. Everything after that is your team’s job.' },
  { q: 'Do I still use Google Drive?', a: 'No. No folders, no file names, no failed uploads. Your clips go straight from your camera roll into the app, and they are matched and routed for you.' },
  { q: 'Who edits my content?', a: 'Your own in-house editors. The moment you upload, each clip goes to whichever of your editors is free, so nothing waits in a queue. You approve the final cut in the app.' },
  { q: 'Where do my posts go?', a: 'Across your network of Instagram accounts, and the traffic goes to your fan page. You can see every account, every post and every number in your dashboard.' },
  { q: 'What if an account gets banned?', a: 'It gets replaced and you get a notification. Warm accounts are kept ready for exactly this, so your posting does not stop while it is sorted.' },
  { q: 'How do I join?', a: 'Apply through the site. A manager reviews every application personally and gets back to you. If it is a fit, you are set up and filming the same week.' },
]

export const NOTIFICATIONS = [
  { t: 'Account @account_27 was banned. A replacement is already live.', k: 'ban' },
  { t: 'Your clip is live. 12K views in the first hour.', k: 'live' },
  { t: 'New reference added. Mia R. left notes.', k: 'info' },
  { t: 'Dani K. finished your edit. Ready for approval.', k: 'info' },
  { t: 'This week’s list is up. 8 references waiting.', k: 'info' },
  { t: 'Upload complete. 12 clips matched and sent to your editors.', k: 'live' },
]

export const APPLY_HREF = 'mailto:apply@halevaura.com?subject=Application%20to%20halevaura'
