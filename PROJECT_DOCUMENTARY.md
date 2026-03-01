# Project Documentary

## 📌 Overview
This project is a full stack web application built with a React/TypeScript frontend and an Express/Mongo backend. It provides music streaming features where administrators can upload songs and albums, and users can play tracks through an in‑browser player. The project structure is split into `frontend/` and `backend/` directories:

- **frontend/** – Vite‑based React app in TypeScript • Zustand for state management • Radix UI and icons • TailwindCSS styling
- **backend/** – Express server with MongoDB models • Cloudinary for media uploads • RESTful controllers and routes

The player component currently supports basic playback (previous, play/pause, next, volume) but the UI shows additional icons (shuffle, repeat, queue, microphone, device, show all) that are **not yet functional**. This documentary explains how to implement those features and where to place the necessary code.

---

## 🎯 Goals
1. Give new contributors a high‑level orientation of the codebase.
2. Explain how the player store works and where to add new state and logic.
3. Provide step‑by‑step instructions for wiring up the remaining buttons:
   - Shuffle
   - Repeat
   - Queue (add to queue and show queue)
   - Microphone (future voice input or mute toggle)
   - Device selector (choose playback device)
   - Show all (navigate to Songs page)

---

## 🗂️ Important File Locations
Use the following paths when editing or adding files:

| Feature | Location | Description |
|---------|----------|-------------|
| Player state | `frontend/src/stores/usePlayerStore.ts` | Zustand store managing queue and playback |
| Playback UI | `frontend/src/layout/components/PlaybackControls.tsx` | Component displaying control icons |
| Section grid + show all nav | `frontend/src/components/SectionGrid.tsx` | Grid of items with optional "Show all" button |
| Songs page | `frontend/src/pages/songs/SongsPage.tsx` (create) | Full page listing all songs |
| Routing | `frontend/src/App.tsx` | React Router setup |

---

## 📦 Store Enhancements (`usePlayerStore.ts`)
The shared state for playback lives in `usePlayerStore.ts`. To support shuffle/repeat/queue:

1. **Add new state fields**
   ```ts
   shuffle: boolean;
   repeat: "none" | "one" | "all";
   queue: Song[];       // queued tracks beyond current song
   ```
2. **Initialize them** in `create`:
   ```ts
   shuffle: false,
   repeat: 'none',
   queue: [],
   ```
3. **Implement actions** to toggle shuffle/repeat, add to queue, and advance the queue.
   Example:
   ```ts
   toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),
   setRepeat: (mode) => set({ repeat: mode }),
   addToQueue: (song) => set(state => ({ queue: [...state.queue, song] })),
   next: () => {
     // if queue not empty use queue.shift()
     // else advance in track list (taking shuffle/repeat into account)
   }
   ```
4. **Export selectors** for these new fields so components can read them.

> 💡 Tip: look at the existing `setSongs`, `play`, and `next` implementations for pattern guidance.

---

## 🎛️ Updating `PlaybackControls.tsx`
This component renders the control icons. The unimplemented icons appear around the core controls.

1. **Import additional icons** at the top:
   ```ts
   import {
     Shuffle,
     Repeat,
     RepeatOne,
     ListMusic,
     Microphone,
     Airplay,
     Grid,
   } from 'lucide-react';
   ```
2. **Retrieve new state and actions** from the store:
   ```ts
   const { shuffle, toggleShuffle, repeat, setRepeat, queue, addToQueue } = usePlayerStore();
   ```
3. **Add click handlers** for each icon. Example:
   ```tsx
   <IconButton onClick={toggleShuffle} active={shuffle}><Shuffle /></IconButton>
   <IconButton onClick={() => setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none')}>
     {repeat === 'one' ? <RepeatOne /> : <Repeat />}
   </IconButton>
   <IconButton onClick={() => setShowQueue(true)}><ListMusic /></IconButton>
   <IconButton onClick={() => {/* placeholder: open mic dialog */}}><Microphone /></IconButton>
   <IconButton onClick={() => {/* placeholder: select device */}}><Airplay /></IconButton>
   <IconButton onClick={() => navigate('/songs')}><Grid /></IconButton> // show all
   ```
4. **Reflect active states** visually by conditionally styling buttons when `shuffle`/`repeat` are active.

Leave comments or TODOs for microphone/device to implement later (potential integration with Web Audio API).

---

## 📁 Creating the Songs Page
When the user clicks **Show all**, they should be taken to a page displaying every song. Add:

### 1. `frontend/src/pages/songs/SongsPage.tsx`
```tsx
import React from 'react';
import { useMusicStore } from '../../stores/useMusicStore';
import SectionGrid from '../../components/SectionGrid';

const SongsPage = () => {
  const { songs } = useMusicStore();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Songs</h1>
      <SectionGrid items={songs} type="song" showAll={false} />
    </div>
  );
};

export default SongsPage;
```

### 2. Update routing in `frontend/src/App.tsx`:
```tsx
import SongsPage from './pages/songs/SongsPage';

// inside <Routes> add:
<Route path="/songs" element={<SongsPage />} />
```

### 3. Ensure `SectionGrid` accepts a `showAll` prop to hide the extra button when used on the full page (already implemented earlier).

---

## 🛣️ Navigation (`SectionGrid.tsx`)
The existing `SectionGrid` component has a "Show all" button; wire it to the new `/songs` route:

```tsx
if (showAll) {
  <button onClick={() => navigate(`/songs`)}>{showAllLabel || 'Show all'}</button>
}
```

The component already lives at `frontend/src/components/SectionGrid.tsx`.

---

## 🔔 Toast Feedback
Optionally display notifications when shuffle or repeat modes change:

```ts
import { toast } from 'react-hot-toast';

// inside handlers:
toggleShuffle: () => set(state => {
  const newVal = !state.shuffle;
  toast(newVal ? 'Shuffle enabled' : 'Shuffle disabled');
  return { shuffle: newVal };
});
```

This enhances UX.

---

## ⚙️ Backend Impact
The new buttons are purely client‑side. No backend changes are required unless you later persist user settings (e.g. shuffle/repeat preferences). For now, the only relevant backend area is the songs API which already supports listing all songs.

Endpoints you can call from frontend using `frontend/src/lib/axios.ts`:

- `GET /api/songs` – list all songs (used by music store initialization)
- `POST /api/songs` – upload new song (used by admin dialog)

No modification needed to support playlist queue or shuffle on the server.

---

## 🧪 Testing & Verification
1. Start the backend: `cd backend && npm install && npm run dev`.
2. Start the frontend: `cd frontend && npm install && npm run dev`.
3. Upload an album/song via admin panel to have data.
4. Check playback controls:
   - Click **shuffle** and play multiple songs to confirm random order.
   - Cycle **repeat** through none/all/one and observe behaviour.
   - Add tracks to queue and click next to ensure queued songs play first.
   - Click **Show all** to visit the songs page.

For unimplemented icons (mic, device), ensure they at least have click handlers that log a TODO.

---

## 🚀 Contribution Tips
- If you add new state or handlers to the store, add corresponding TypeScript types in `frontend/src/types/index.ts`.
- Keep UI components presentational; avoid embedding logic there—delegate to the store or custom hooks.
- Use `run npx prettier --write` to format added files.

---

## 📝 Notes for Future Work
- Microphone icon: implement voice commands or lyric search via Web Speech API.
- Device selector: integrate with Web Audio API or cast to external devices.
- Persist shuffle/repeat preferences per user in the backend.
- Add an interactive queue panel for viewing and rearranging queued songs.

---

## ✅ Summary
By following the steps above, a developer can make all remaining buttons functional and expand the player experience. This documentary provides paths, code examples, and context to support further feature development.

Feel free to extend the document as the project grows.

---

*Generated March 1, 2026*