# HelloStay Frontend Concepts
>Purpose
This document stores frontend technical concepts learned while building HelloStay.

>For every concept, document:
- Definition
- Purpose
- Command / Syntax (if applicable)
- Example
- Industry Practice
- Common Mistakes
- HelloStay Usage

---

## npm (Node Package Manager)
>Definition
The default package manager for Node.js, used to install and manage third-party code libraries.

>Purpose
To easily download dependencies (like React, Bootstrap, or Vite) without having to manually download the source code.

>Command
`npm install <package_name>`

>Industry Practice
Always rely on `package.json` to keep track of dependencies rather than remembering what you installed. `npm install` automatically reads `package.json` and installs everything needed.

>HelloStay Usage
Used to elegantly flip the `ArrowRight` icon on the `Sidebar` active tab and handle hover states for the `Facilities` grid.

---

## Splash Screen Routing & Layouts
>Definition
A technique where the application uses a "gatekeeper" route (often `/` or `/splash`) to evaluate the environment or user session before rendering the main application layout.

>Purpose
Prevents UI flickering or exposing protected dashboards to unauthenticated users by evaluating `localStorage` state *before* mounting the `<MainLayout />`.

>Example Flow
```jsx
// Splash.jsx (Entry Point)
useEffect(() => {
  const session = localStorage.getItem('helloStay_session');
  if (session) navigate('/dashboard');
  else navigate('/login');
}, []);
```

>HelloStay Usage
Used in `Splash.jsx` to create a premium entry experience. Because the desktop (Electron) version opens offline instantly, a Splash screen gives the app time to load data while displaying a professional animation.

---

## Local Storage Session Management
>Definition
Storing serialized user profile data in the browser's `localStorage` to persist authentication state across page reloads.

>Keys Used in HelloStay
- `helloStay_session`: The active authenticated user object. If missing, the user is logged out.
- `helloStay_accounts`: An array of saved user profiles. Used in `Login.jsx` to render the "Profile Selection" screen.
- `helloStay_keepLoggedIn`: Boolean. If true, the Splash screen instantly routes to Dashboard. If false, the session is cleared upon explicit logout or ignored on restart.

>Industry Practice
While acceptable for non-sensitive data and Profile Selection lists (like Netflix profiles), real session tokens should be stored in `HttpOnly` cookies in production to prevent Cross-Site Scripting (XSS) attacks.er.

---

## npm fund
>Definition
A command that displays information about how to financially support the open-source developers who created the packages you just installed.

>Purpose
Open-source software is free, but developers rely on donations to maintain it. `npm fund` simply lists the donation links provided by package authors.

>Industry Practice
**Safely ignored.** You do not need to run this command, and it is absolutely not an error. Most developers completely ignore the "packages are looking for funding" message.

---

## Tailwind CSS
>Definition
A utility-first CSS framework packed with classes like `flex`, `pt-4`, `text-center` and `rotate-90` that can be composed to build any design, directly in your markup.

>Purpose
To rapidly build modern websites without ever leaving the HTML/JSX. It completely eliminates the need to write custom CSS classes and avoids class name collisions.

>Command
`npm install -D tailwindcss@3 postcss autoprefixer`
`npx tailwindcss init -p`

>Industry Practice
Tailwind has become the industry standard for modern React applications because it scales better than traditional CSS and prevents stylesheet bloat. It requires a mindset shift from "semantic classes" (e.g. `.card`) to "utility classes" (e.g. `bg-white shadow-md rounded-lg`).

>HelloStay Usage
Replaced Bootstrap as the core design system as per Architecture Decision 59, providing the granular control needed for a premium desktop application UI.

---

## React Router DOM
>Definition
The standard routing library for React applications. It enables client-side routing, meaning the URL changes and components swap out without the browser actually requesting a new HTML page from the server.

>Purpose
Creates a Single Page Application (SPA) feel, making navigation instant.

>Command
`npm install react-router-dom`

>Industry Practice
Use the `<BrowserRouter>` at the highest level of the app (usually `App.jsx`). Use `<Routes>` and `<Route>` to map paths to components.

>HelloStay Usage
Used to navigate between the Login screen and the various Dashboard modules (Rooms, Bookings, HR, etc.).

---

## Layout Component Pattern (Outlet)
>Definition
A design pattern in React Router where a parent component defines the surrounding structure (like a Sidebar and Topbar), and uses an `<Outlet />` component to render the dynamic child content based on the current URL.

>Purpose
Prevents code duplication. Instead of importing the Sidebar into every single page, the Layout component handles it once.

>Example
```jsx
<Route path="/" element={<MainLayout />}>
  <Route path="rooms" element={<Rooms />} />
</Route>
```
When visiting `/rooms`, React Router renders `<MainLayout>` and injects `<Rooms>` exactly where the `<Outlet />` tag is placed inside `MainLayout`.

---

## Framer Motion
>Definition
A production-ready motion library for React.

>Purpose
Makes it incredibly easy to add complex animations, page transitions, and gestures using declarative syntax.

>HelloStay Usage
Used to add subtle fade-ins and slide-ups to our dashboard cards to make the desktop app feel premium and alive.

---

## Lucide React
>Definition
A beautifully crafted, open-source icon library.

>HelloStay Usage
Used throughout the Sidebar and Topbar for consistent, clean iconography matching our design system.

---

## React State (`useState`)
>Definition
A React Hook that allows you to add state (memory) to functional components. When state changes, React automatically re-renders the component to reflect the new data.

>Purpose
To track variables that change over time and affect the UI (like tracking the progress bar in the Installer, or storing form input).

>Syntax
```jsx
import { useState } from 'react';
const [progress, setProgress] = useState(0);
```
- `progress`: The current value.
- `setProgress`: The function used to update the value.
- `0`: The initial value.

>HelloStay Usage
Used in the `Installer.jsx` to manage the installation progress percentage, and in `Login.jsx` to toggle between 'owner' and 'employee' views.

---

## React Effects (`useEffect`)
>Definition
A React Hook that lets you synchronize a component with an external system or run side effects (like fetching data, setting up subscriptions, or starting a timer).

>Purpose
To execute code that shouldn't run during the main render cycle.

>Syntax
```jsx
useEffect(() => {
  // Setup code (e.g., start a timer)
  const timer = setInterval(() => console.log('Tick'), 1000);

  // Cleanup function (runs when component unmounts)
  return () => clearInterval(timer);
}, []); // Empty dependency array means this runs ONLY ONCE when the component mounts.
```

>HelloStay Usage
Used in `Installer.jsx` to start the simulated setup interval. The cleanup function ensures the timer stops if the user navigates away before it finishes.

---

## Navigation (`useNavigate`)
>Definition
A hook from `react-router-dom` that allows you to programmatically navigate between pages without using an `<a>` tag or `<Link>` component.

>Purpose
Used to redirect the user after they click a button or complete an action (like successfully submitting a registration form).

>Syntax
```jsx
import { useNavigate } from 'react-router-dom';

export default function MyComponent() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/dashboard'); // Instantly swaps the screen to the dashboard
  };
}
```

>HelloStay Usage
Used across the Authentication UI to route users:
- From the completed Installer to the Owner Registration.
- From successful Registration to the Login screen.
- From the Login screen to the Dashboard.

---

## Building UI Forms in React
>Definition
React forms require a slightly different mental model than raw HTML. In React, forms are often "controlled", meaning React state becomes the "single source of truth" for the input fields.

>Industry Practice
1. Always use `onChange` to update state as the user types.
2. Provide visual feedback for focus (`focus:ring-2`) and hover states.
3. Group related inputs into grids (`grid-cols-2`) to maximize screen real estate on desktop applications.

>HelloStay Usage
The `RegisterOwner.jsx` and `RegisterEmployee.jsx` files use Tailwind classes (`focus:ring-blue-500`, `bg-gray-50`) to create premium, commercial-grade forms that look native to a desktop environment. They implement the "Upload Area" pattern using dashed borders and drag-and-drop visuals.

---

## The Spread Operator (`...`)
>Definition
In JavaScript, three dots (`...`) are called the "spread operator". It unpacks all the elements from an array or an object into a new array or object.

>Purpose
In React, state is *immutable* (you cannot change it directly). If you have an object in state and want to update just one property, you must copy the entire object first, and then overwrite the property. The spread operator makes this copying easy.

>Syntax Example
```jsx
// Imagine we have this state:
const [user, setUser] = useState({ name: 'John', age: 25 });

// BAD: Never mutate state directly like this in React!
// user.age = 26; 

// GOOD: Copy all existing properties using '...', then overwrite age
setUser({ ...user, age: 26 }); 
```

>HelloStay Usage
Used in `RegisterHotel.jsx` when updating the form data: `setFormData({...formData, hotelName: e.target.value})`. This copies the existing totalRooms and facilities, and only updates the hotelName.

---

## LocalStorage
>Definition
A built-in feature of the user's web browser that allows you to save data directly on their computer. The data persists even if they close the browser tab or restart their computer.

>Purpose
To remember information between page reloads without needing a backend database. It can only store **strings** (text).

>Syntax Example
```javascript
// Saving data to the browser
localStorage.setItem('myKey', 'Hello World');

// Retrieving data from the browser
const data = localStorage.getItem('myKey');
console.log(data); // Outputs: "Hello World"
```

>HelloStay Usage
Used to save the Hotel Registration details in `RegisterHotel.jsx` and read them in `Dashboard.jsx`.

---

## JSON.stringify() and JSON.parse()
>Definition
Because `localStorage` can **only store text**, you cannot save a Javascript Object (like `{ hotelName: "Plaza" }`) directly. You must convert the Object into a text string, and convert it back when you read it.

>Purpose
- `JSON.stringify()`: Converts a Javascript Object into a Text String.
- `JSON.parse()`: Converts a Text String back into a Javascript Object.

>Syntax Example
```javascript
const hotel = { name: "Plaza", rooms: 50 };

// Convert object to string to save it
localStorage.setItem('hotelData', JSON.stringify(hotel));

// Read string from storage
const rawString = localStorage.getItem('hotelData');

// Convert string back to an object so we can use it
const actualHotelObject = JSON.parse(rawString);
console.log(actualHotelObject.name); // Outputs: "Plaza"
```

>HelloStay Usage
Used in the Hotel Setup flow to safely store the complex `formData` object containing the hotel details and facilities arrays into the browser.

---

## Rendering Lists in React (`.map()`)
>Definition
In React, we do not use `for` loops to render multiple items (like a list of rooms or a grid of cards). Instead, we use the Javascript `.map()` function, which loops over an array and returns a new React element for each item.

>Purpose
To dynamically generate UI components based on data arrays.

>Syntax Example
```jsx
const facilities = ["WiFi", "Pool", "Gym"];

return (
  <div>
    {facilities.map((facility, index) => (
       // React requires a unique "key" prop for every item mapped in an array
       <span key={index}>{facility}</span>
    ))}
  </div>
);
```

>HelloStay Usage
Used extensively in `Dashboard.jsx` to render the KPI stat cards, and in `RegisterHotel.jsx` to render the clickable grid of Facility buttons.

---

## Lazy State Initialization
>Definition
Passing a **function** into `useState` instead of a direct value. This tells React to only execute that function once when the component first loads.

>Problem it Solves
If you use `useEffect` to instantly overwrite state on the first load (e.g., reading from LocalStorage), React has to render the component twice in a row, which throws performance warnings in the IDE ("Calling setState synchronously within an effect"). 

>Syntax Example
```jsx
// BAD: Forces a double-render and throws IDE warnings
const [data, setData] = useState("Loading...");
useEffect(() => {
  setData(localStorage.getItem('myKey'));
}, []);

// GOOD: "Lazy Initialization". Reads storage once, correctly, with no warnings.
const [data, setData] = useState(() => {
  return localStorage.getItem('myKey') || "Default Value";
});
```

>HelloStay Usage
Used in `Dashboard.jsx` to load the Hotel Details from `localStorage` the exact millisecond the Dashboard opens, avoiding double-renders.

---

## Conditional CSS Classes (`clsx`)
>Definition
`clsx` is a tiny utility library that makes it easy to conditionally combine CSS class names.

>Purpose
In Tailwind, you often want a button to be blue if it's selected, and gray if it's not. Writing raw Javascript string concatenations for this gets messy. `clsx` solves this cleanly.

>Syntax Example
```jsx
import clsx from 'clsx';

const isSelected = true;

// If isSelected is true, it adds 'bg-blue-500'. If false, it adds 'bg-gray-200'.
const buttonClass = clsx(
  "p-4 rounded-lg text-white", // Base classes always applied
  isSelected ? "bg-blue-500" : "bg-gray-200" // Conditional classes
);

return <button className={buttonClass}>Click Me</button>;
```

>HelloStay Usage
Used in the `Sidebar.jsx` to highlight the currently active navigation link, and in `RegisterHotel.jsx` to visually highlight the facilities the owner clicks on.

---

## recharts
>Definition
A composable charting library built on React components. Instead of imperatively drawing charts with canvas or SVG commands, you declare chart parts as JSX elements and pass data arrays to them.

>Purpose
To render data visualizations (bar charts, line charts, pie charts, etc.) inside React applications without writing raw SVG or canvas logic.

>Command
`npm install recharts`

>Syntax Example
```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Available', value: 40, fill: '#10b981' },
  { name: 'Occupied', value: 35, fill: '#ef4444' },
];

function MyChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
```

>Industry Practice
- Always wrap charts in `<ResponsiveContainer>` so they resize with their parent container.
- Use `<Cell>` to assign individual colors to bars/segments.
- Use `margin` prop on the chart to add breathing room around the axes.
- `<Tooltip>` `contentStyle` accepts CSS-like objects for custom popup styling.

>Common Mistakes
- Forgetting `ResponsiveContainer` — causes the chart to render at 0x0 pixels.
- Passing `width` and `height` directly to `<BarChart>` — makes the chart fixed-size and non-responsive.

>HelloStay Usage
Used in `Dashboard.jsx` to render the Room Occupancy Overview bar chart showing Available, Occupied, Cleaning, and Reserved room counts with color-coded bars.

---

## Modal Component Pattern
>Definition
A UI pattern where a child component renders an overlay (backdrop) and a positioned content card on top of the current page, temporarily blocking interaction with the rest of the application.

>Purpose
To capture focused user input (like a form) without navigating away from the current page. Commonly used for Add, Edit, Confirm, and Detail-view interactions.

>Syntax Example
```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg"
            >
              {/* Modal content here */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
```

>Industry Practice
- Use `z-50` or higher to ensure the modal sits above all other content.
- Use `backdrop-blur-sm` or `bg-black/40` on the backdrop for a modern frosted-glass effect.
- Wrap modal content in `AnimatePresence` so it animates in/out smoothly.
- Always provide an `onClose` callback triggered by the backdrop click AND an explicit X button.
- Reset form state when the modal closes to prevent stale data on re-open.

>Common Mistakes
- Not resetting form state on close — next open shows old values.
- Missing `onClick={handleClose}` on the backdrop — user cannot dismiss the modal by clicking outside.
- Using `fixed` without `inset-0` — modal does not center properly.

>HelloStay Usage
Used in `AddRoomModal.jsx` — a form overlay for adding new rooms. Uses Framer Motion spring animation, backdrop blur, form validation with inline errors, and resets state on close.

---

## Data Table Pattern (Sort, Search, Filter, Paginate)
>Definition
A custom-built HTML `<table>` enhanced with interactive features: column sorting, text search, dropdown filtering, and page navigation — all managed via React state.

>Purpose
To display tabular data in a way that lets users quickly find, organize, and navigate through records without needing a third-party table library.

>Syntax Example
```jsx
const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
const [searchQuery, setSearchQuery] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const ROWS_PER_PAGE = 10;

// Sort handler
const handleSort = (key) => {
  setSortConfig(prev => ({
    key,
    direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
  }));
};

// Filtered + sorted data
const filtered = data
  .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  .sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    return sortConfig.direction === 'asc' ? 1 : -1;
  });

// Paginated slice
const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
```

>Industry Practice
- Use `useMemo` for the filtered/sorted computation to avoid recalculating on every render.
- Reset `currentPage` to 1 whenever `searchQuery` or `statusFilter` changes.
- Show "Showing X to Y of Z" text in the pagination footer.
- Use sort indicator icons (ChevronUp/ChevronDown) next to the active column header.

>Common Mistakes
- Forgetting to reset `currentPage` when filters change — user sees an empty page.
- Sorting strings without `.toLowerCase()` — "Zebra" sorts before "apple" because uppercase letters have lower char codes.
- Not using `useMemo` — expensive filter+sort runs on every keystroke, causing lag with large datasets.

>HelloStay Usage
Used in `Rooms.jsx` to build a premium data table with column header click-to-sort, real-time search by room number/type, status dropdown filter, and 10-row pagination with Previous/Next buttons.

---

## Status Badges (Color-Coded Conditional Rendering)
>Definition
A pattern where a data field's value is mapped to a specific color scheme (background, text, and border) to provide instant visual status recognition.

>Purpose
To let users scan a table and immediately understand the state of each record without reading the text — color acts as a pre-attentive visual cue.

>Syntax Example
```jsx
const STATUS_STYLES = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Occupied: 'bg-red-50 text-red-700 border-red-200',
  Cleaning: 'bg-orange-50 text-orange-700 border-orange-200',
  Reserved: 'bg-blue-50 text-blue-700 border-blue-200',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}
```

>Industry Practice
- Define a constant map (`STATUS_STYLES`) at the top of the file rather than inline ternaries — keeps JSX clean and makes colors easy to update.
- Use a consistent hue pattern: light background (`-50`), dark text (`-700`), medium border (`-200`) from the same color family.
- Green = Positive/Ready, Red = Blocked/Occupied, Orange = In Progress/Warning, Blue = Informational/Planned.

>Common Mistakes
- Using completely different color families for each status — creates visual chaos instead of instant recognition.
- Hardcoding colors inside the `<span>` — makes it impossible to reuse or maintain.

>HelloStay Usage
Used in `Rooms.jsx` and `Dashboard.jsx` to display room status with instant visual clarity: Green=Available, Red=Occupied, Orange=Cleaning, Blue=Reserved, as defined in Architecture Decision 60.

---

## `useMemo` (React Hook)
>Definition
A React Hook that memoizes (caches) the result of an expensive computation. It only recalculates the value when one of its dependencies changes.

>Purpose
Prevents unnecessary recalculations on every render. Without `useMemo`, filtering and sorting a large array would run on every keystroke in a search box, causing lag.

>Syntax Example
```jsx
import { useMemo } from 'react';

const filteredRooms = useMemo(() => {
  let result = [...rooms];
  if (searchQuery) {
    result = result.filter(r => r.name.includes(searchQuery));
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}, [rooms, searchQuery]); // Only recalculates when rooms or searchQuery changes
```

>Industry Practice
- Use `useMemo` for any computation that iterates over arrays (filter, sort, map) or performs expensive calculations.
- Always list every external variable the computation depends on in the dependency array.
- Do NOT use `useMemo` for simple values — it adds overhead that outweighs the benefit.

>Common Mistakes
- Empty dependency array `[]` when the computation uses external state — the memoized value becomes stale.
- Using `useMemo` for trivial calculations — the caching overhead is slower than just recalculating.

>HelloStay Usage
Used in `Rooms.jsx` line 66 to memoize the filtered + sorted room list. This ensures the expensive filter+sort operation only runs when `rooms`, `searchQuery`, `statusFilter`, or `sortConfig` changes — not on every render.

---

## Functional State Updates (`prev => ...`)
>Definition
A pattern where you pass a **function** to a state setter instead of a direct value. The function receives the previous state as its argument and returns the new state.

>Purpose
When the new state depends on the previous state (like appending to an array or toggling a boolean), the functional form guarantees you're working with the latest value — even if React batches multiple state updates.

>Syntax Example
```jsx
// BAD: May use a stale value of 'count' if updates are batched
setCount(count + 1);

// GOOD: Always uses the most recent state, even in rapid updates
setCount(prev => prev + 1);

// Appending to an array
setRooms(prev => [...prev, newRoom]);

// Removing from an array
setRooms(prev => prev.filter(r => r.id !== roomId));
```

>Industry Practice
- Always use functional updates when the new state is derived from the old state.
- Use direct value setting only when the new state is completely independent (e.g., `setIsOpen(false)`).

>Common Mistakes
- Using the stale closure value instead of `prev` — causes lost updates when state changes rapidly (like rapid button clicks).

>HelloStay Usage
Used in `Rooms.jsx` line 33: `setRooms(prev => [...prev, newRoom])` to safely append a new room to the existing list without losing any rooms that were added between renders.

---

## `AnimatePresence` (Framer Motion)
>Definition
A component from Framer Motion that enables exit animations. Without it, when a component is removed from the DOM (like closing a modal), it simply vanishes. `AnimatePresence` keeps the component in the DOM long enough to play its `exit` animation.

>Purpose
To animate components that are conditionally rendered — specifically, to animate them OUT when they disappear (not just IN when they appear).

>Syntax Example
```jsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isModalOpen && (
    <motion.div
      initial={{ opacity: 0 }}    // When it first appears
      animate={{ opacity: 1 }}    // While it's on screen
      exit={{ opacity: 0 }}       // When it's removed — AnimatePresence enables this
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

>Industry Practice
- Always wrap conditionally rendered `motion.*` elements in `AnimatePresence` if you want exit animations.
- The direct child of `AnimatePresence` must have a unique `key` prop if you're rendering multiple items.
- `AnimatePresence` must be placed **outside** the conditional check, not inside.

>Common Mistakes
- Placing `AnimatePresence` inside the `{condition && ...}` — it gets removed before the exit animation can play.
- Forgetting `exit` prop on the `motion.*` element — nothing happens when the component unmounts.

>HelloStay Usage
Used in `AddRoomModal.jsx` to wrap the modal overlay. When the user clicks Close or the backdrop, the modal fades out with a spring scale animation instead of vanishing instantly.

---

## `motion.div` / `motion.tr` (Framer Motion Animated Components)
>Definition
Framer Motion exports animated versions of HTML elements. `motion.div` is a regular `<div>` that can accept animation props like `initial`, `animate`, `exit`, and `transition`.

>Purpose
To declaratively define how an element should appear, behave, and disappear — without writing CSS keyframes or JavaScript animation loops.

>Syntax Example
```jsx
import { motion } from 'framer-motion';

// Animate a div fading in and sliding up
<motion.div
  initial={{ opacity: 0, y: 20 }}   // Starting state (invisible, 20px below)
  animate={{ opacity: 1, y: 0 }}     // End state (visible, normal position)
>
  Hello World
</motion.div>

// Animate a table row
<motion.tr
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: i * 0.05 }}   // Stagger: each row appears 50ms after the previous
>
  <td>Data</td>
</motion.tr>
```

>Industry Practice
- Use `initial` for the state before animation starts.
- Use `animate` for the state the element should reach.
- Use `transition` to customize timing (spring, tween, delay, duration).
- You can use `motion.*` on ANY HTML element — `motion.div`, `motion.tr`, `motion.span`, `motion.button`, etc.

>Common Mistakes
- Using `motion.div` when `motion.tr` is needed — causes invalid HTML structure inside `<table>`.
- Forgetting `animate` — element stays stuck in the `initial` state.

>HelloStay Usage
Used in `Dashboard.jsx` for page entrance (`opacity: 0 → 1, y: 10 → 0`) and activity timeline stagger. Used in `Rooms.jsx` on `<motion.tr>` to fade in each table row with a 30ms delay between rows.

---

## Framer Motion `transition` Prop
>Definition
A prop on `motion.*` elements that controls how the animation plays — its speed, easing, physics, and delay.

>Purpose
Without `transition`, Framer Motion uses a default spring animation. The `transition` prop lets you customize the feel — snappy, smooth, delayed, or physics-based.

>Syntax Example
```jsx
// Spring animation (natural, physics-based)
<motion.div
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
/>

// Delayed entrance (stagger effect)
<motion.div
  transition={{ delay: i * 0.1 }}  // Each item waits 100ms longer
/>

// Tween (linear or eased over fixed duration)
<motion.div
  transition={{ duration: 0.3, ease: 'easeInOut' }}
/>
```

>Spring Parameters:
- `type: 'spring'` — Physics-based animation (bouncy, natural feel)
- `damping` — How quickly the animation stops (higher = less bouncy)
- `stiffness` — How fast the animation moves (higher = snappier)
- `mass` — How heavy the object feels (higher = slower, more momentum)

>Industry Practice
- Use `spring` for modals and cards (natural, premium feel).
- Use `delay` with `.map()` index for staggered list entrances.
- Use `duration` for simple fades where spring physics feel excessive.

>Common Mistakes
- Very high `stiffness` + low `damping` — animation looks jittery and overshoots.
- Forgetting `delay` is in seconds, not milliseconds — `delay: 100` means 100 seconds, not 100ms.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 104: `transition={{ type: 'spring', damping: 25, stiffness: 300 }}` for a snappy but smooth modal entrance. Used in `Dashboard.jsx` and `Rooms.jsx` with `delay: i * 0.1` and `delay: i * 0.03` for staggered list animations.

---

## `export default function`
>Definition
ES6 JavaScript syntax that exports a function as the **default** export of a file. This allows other files to import it using any name they choose.

>Purpose
Each React component lives in its own file. `export default` makes the component available for import in other files (like `AppRoutes.jsx`).

>Syntax Example
```jsx
// In Rooms.jsx
export default function Rooms() {
  return <div>Rooms Page</div>;
}

// In AppRoutes.jsx — can use any name
import Rooms from '../pages/Rooms';
// OR even: import MyRooms from '../pages/Rooms';
```

>Industry Practice
- Each file should have exactly ONE default export.
- The filename and the function name should match (e.g., `Rooms.jsx` exports `Rooms`).
- Named exports (`export function Foo`) are used for utilities, not components.

>Common Mistakes
- Having multiple `export default` in one file — causes "Duplicate export" errors.
- Forgetting `export default` — the import in other files silently receives `undefined`.

>HelloStay Usage
Every component file in HelloStay uses this pattern: `export default function Dashboard()`, `export default function Rooms()`, `export default function AddRoomModal()`, etc.

---

## Template Literals (Backticks with `${}`)
>Definition
JavaScript string syntax using backticks (`` ` ``) instead of quotes. Template literals allow embedded expressions using `${expression}` inside the string.

>Purpose
Cleanly combine strings with variables without using `+` concatenation, which becomes unreadable with multiple variables.

>Syntax Example
```jsx
const name = "Alice";
const age = 25;

// Old way (messy)
const msg1 = "My name is " + name + " and I am " + age + " years old";

// Template literal (clean)
const msg2 = `My name is ${name} and I am ${age} years old`;

// In JSX — dynamic className
<h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>

// Multi-line strings
const html = `
  <div>
    <p>Hello</p>
  </div>
`;
```

>Industry Practice
- Use template literals whenever combining strings with variables.
- Template literals are also required for JSX attribute values that need dynamic parts inside strings.

>Common Mistakes
- Using regular quotes with `+` concatenation — harder to read and error-prone.
- Forgetting to close the `${}` expression — causes syntax errors.

>HelloStay Usage
Used in `Dashboard.jsx` line 98: `` className={`text-2xl font-bold ${stat.color}`} `` to dynamically set the color class based on the KPI card's color property.

---

## `parseInt()` and `parseFloat()` (Number Conversion)
>Definition
- `parseInt("100")` — Converts a string to an **integer** (whole number). Returns `NaN` if the string isn't numeric.
- `parseFloat("25.50")` — Converts a string to a **floating-point** number (decimal).

>Purpose
`localStorage` stores everything as text. When you read `"100"` from storage, it's the text `"100"`, not the number `100`. These functions convert text to usable numbers for math operations.

>Syntax Example
```jsx
const text = "2500";
const number = parseInt(text);      // 2500
const decimal = parseFloat("3.14"); // 3.14

// With fallback (|| 0) if conversion fails
const price = parseInt(formData.pricePerNight) || 0;
```

>Industry Practice
- Always use `|| 0` or `?? 0` as a fallback to avoid `NaN` propagating through calculations.
- Use `parseInt` for whole numbers (room count, occupancy).
- Use `parseFloat` for money/decimals (price per night).

>Common Mistakes
- Doing math on strings without converting — `"5" + "10"` gives `"510"` (concatenation), not `15.
- Forgetting the fallback — `parseInt(undefined)` returns `NaN`, which breaks all downstream math.

>HelloStay Usage
Used in `Dashboard.jsx` line 30: `parseInt(hotelData.totalRooms) || 100` to safely convert the room count string from localStorage into a number with a fallback of 100. Used in `AddRoomModal.jsx` for price and occupancy conversion.

---

## `Math.floor()`, `Math.ceil()`, `Math.max()`, `Math.min()`
>Definition
Built-in JavaScript Math methods:
- `Math.floor(3.7)` → `3` — Rounds **down** to nearest integer.
- `Math.ceil(3.2)` → `4` — Rounds **up** to nearest integer.
- `Math.max(5, 10, 3)` → `10` — Returns the **largest** value.
- `Math.min(5, 10, 3)` → `3` — Returns the **smallest** value.

>Purpose
Used for calculations that need whole numbers (pagination bounds, occupancy counts, clamping values).

>Syntax Example
```jsx
// Calculate 40% of rooms, rounded down
const available = Math.floor(totalRooms * 0.4);  // 40.6 → 40

// Calculate total pages needed for pagination
const totalPages = Math.ceil(25 / 10);  // 2.5 → 3 pages

// Clamp page number between 1 and max
const safePage = Math.max(1, Math.min(desiredPage, totalPages));
```

>Industry Practice
- `Math.floor` for array indexing and percentage calculations.
- `Math.ceil` for pagination (always round up — you need a page for the remainder).
- `Math.max` / `Math.min` for clamping values within bounds.

>Common Mistakes
- Using `Math.round` instead of `Math.floor` for pagination — can skip records.
- Not handling `NaN` — `Math.floor(NaN)` returns `NaN`, not 0.

>HelloStay Usage
Used in `Dashboard.jsx` for fallback occupancy values (`Math.floor(totalRoomsNum * 0.4)`). Used in `Rooms.jsx` line 46: `Math.ceil(updated.length / ROWS_PER_PAGE)` for pagination total, and `Math.max(1, p - 1)` / `Math.min(totalPages, p + 1)` to clamp page navigation.

---

## `.filter()` (Array Method)
>Definition
Creates a new array containing only the elements that pass a test (return `true` from a callback function). The original array is NOT modified.

>Purpose
To selectively include or exclude items from an array based on a condition — like filtering rooms by status, or removing a deleted item.

>Syntax Example
```jsx
const rooms = [
  { id: 1, status: 'Available' },
  { id: 2, status: 'Occupied' },
  { id: 3, status: 'Available' },
];

// Keep only Available rooms
const available = rooms.filter(r => r.status === 'Available');
// Result: [{ id: 1 }, { id: 3 }]

// Remove a room by ID
const remaining = rooms.filter(r => r.id !== 2);
// Result: [{ id: 1 }, { id: 3 }]
```

>Industry Practice
- `.filter()` always returns a **new array** — the original is untouched (immutable pattern).
- Chain `.filter()` with `.map()` for selective rendering: `rooms.filter(r => r.active).map(r => <Row />)`.
- Use arrow functions for concise filter callbacks.

>Common Mistakes
- Modifying the original array instead of filtering — `rooms.splice(i, 1)` mutates; `rooms.filter(...)` is safe.
- Returning the condition without `return` keyword — works in arrow functions but confuses beginners.

>HelloStay Usage
Used in `Dashboard.jsx` lines 36-37 to count rooms by status: `rooms.filter(r => r.roomStatus === 'Available').length`. Used in `Rooms.jsx` line 42 to remove a deleted room: `rooms.filter(r => r.id !== roomId)`.

---

## `.sort()` (Array Method)
>Definition
Sorts the elements of an array in place and returns the sorted array. The sort order is determined by a comparison callback function.

>Purpose
To arrange data in a specific order — alphabetical (A-Z), numerical (ascending), or date-based.

>Syntax Example
```jsx
const rooms = [
  { name: 'Suite 301', price: 5000 },
  { name: 'Room 101', price: 2000 },
  { name: 'Deluxe 201', price: 3500 },
];

// Sort by price ascending
rooms.sort((a, b) => a.price - b.price);

// Sort by name alphabetical
rooms.sort((a, b) => a.name.localeCompare(b.name));

// Sort by name — descending
rooms.sort((a, b) => b.name.localeCompare(a.name));
```

>Comparison Function Rules:
- Return **negative** if `a` should come before `b`.
- Return **positive** if `a` should come after `b`.
- Return **0** if order doesn't change.

>Industry Practice
- Always use `.toLowerCase()` when sorting strings — otherwise "Zebra" sorts before "apple".
- `.sort()` **mutates** the original array — make a copy first: `[...arr].sort(...)` or sort inside `useMemo`.
- Use `localeCompare()` for string comparison — it handles special characters and locale rules.

>Common Mistakes
- Sorting strings without `.toLowerCase()` — uppercase letters have lower char codes than lowercase.
- Forgetting to copy the array before sorting — mutates the original state, which React forbids.
- Using `a - b` for string comparison — returns `NaN`, causing unpredictable order.

>HelloStay Usage
Used in `Rooms.jsx` lines 81-91 inside `useMemo` to sort rooms by the active column. Strings are lowercased before comparison for case-insensitive sorting.

---

## `.slice()` (Array Method)
>Definition
Returns a shallow copy of a portion of an array, from the `start` index up to (but not including) the `end` index. The original array is NOT modified.

>Purpose
To extract a subset of data — most commonly used for pagination to get "page 2's 10 rows" from a larger array.

>Syntax Example
```jsx
const allRooms = [A, B, C, D, E, F, G, H, I, J, K, L]; // 12 items

// Page 1 (first 10 items, index 0 to 9)
const page1 = allRooms.slice(0, 10);  // [A, B, C, D, E, F, G, H, I, J]

// Page 2 (items 10 to 19, but only 2 exist)
const page2 = allRooms.slice(10, 20); // [K, L]

// Generic formula: page N, 10 per page
const pageN = allRooms.slice((currentPage - 1) * 10, currentPage * 10);
```

>Industry Practice
- `.slice()` is the standard approach for client-side pagination.
- It does NOT modify the original array — safe for React state.
- Combine with `.filter()` and `.sort()` first, then `.slice()` the result.

>Common Mistakes
- `.splice()` vs `.slice()` — `.splice()` **removes** items from the original array (mutating). `.slice()` **copies** a portion (safe).
- Off-by-one errors — `.slice(0, 10)` gives items 0-9 (10 items), not 0-10 (11 items).

>HelloStay Usage
Used in `Rooms.jsx` lines 97-100: `filteredRooms.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)` to extract exactly 10 rooms per page.

---

## `.push()` (Array Method)
>Definition
Adds one or more elements to the **end** of an array and returns the new length. This **mutates** the original array.

>Purpose
To append a new item to an existing array. In React, this is used inside state updates (where the array is first copied).

>Syntax Example
```jsx
const rooms = ['Room 101', 'Room 102'];

// Mutating (dangerous in React outside of state setters)
rooms.push('Room 103');

// Safe in React — copy first, then push
const updated = [...rooms, newRoom];  // Preferred immutable pattern
setRooms(updated);
```

>Industry Practice
- In React, prefer the spread operator `[...arr, newItem]` over `.push()` for immutability.
- `.push()` is acceptable inside a state update when you've already created a copy.

>Common Mistakes
- Using `.push()` directly on React state — `rooms.push(newRoom)` mutates state, causing unpredictable renders and breaking should-component-update optimizations.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 73: `existing.push(newRoom)` inside `handleSubmit` — safe because `existing` is a freshly parsed copy from localStorage, not React state.

---

## `.trim()` (String Method)
>Definition
Removes whitespace from both the beginning and end of a string. Does NOT remove spaces in the middle.

>Purpose
To clean up user input before storing or comparing — prevents accidental leading/trailing spaces from causing bugs.

>Syntax Example
```jsx
const input = "  Room 301  ";
const cleaned = input.trim();  // "Room 301"

// Check if a field is not empty (after removing spaces)
if (formData.roomNumber.trim() !== '') {
  // User actually typed something
}
```

>Industry Practice
- Always `.trim()` text input before validation and before storing in a database.
- Use `.trim()` in validation checks — prevents a field with only spaces from passing as "filled".

>Common Mistakes
- Forgetting `.trim()` — a user typing "   " (spaces only) passes a non-empty check but is effectively blank.
- Using `.trim()` on non-string values — causes an error if the value is `null` or `undefined`.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 32: `formData.roomNumber.trim()` to validate that the room number isn't just whitespace. Used on line 64 before storing the room number.

---

## `.toLocaleString('en-IN')` (Number Formatting)
>Definition
Converts a number to a string formatted according to a specific locale's conventions. `'en-IN'` formats numbers in the Indian numbering system (e.g., `12,50,000` instead of `1,250,000`).

>Purpose
To display prices, salaries, and other monetary values in a format that users in India are familiar with.

>Syntax Example
```jsx
const price = 12500;

// Indian format: 12,500
price.toLocaleString('en-IN');  // "12,500"

const bigNumber = 1250000;
bigNumber.toLocaleString('en-IN');  // "12,50,000"

// In JSX
<span>{'\u20B9'}{room.pricePerNight.toLocaleString('en-IN')}</span>
// Renders: ₹12,500
```

>Industry Practice
- Pass `'en-IN'` locale for Indian projects, `'en-US'` for US formatting.
- Combine with the Rupee symbol `\u20B9` for complete price display.

>Common Mistakes
- Forgetting the locale — `price.toLocaleString()` uses the browser's default, which may not be Indian format.
- Not using it at all — raw numbers like `2500` look unprofessional compared to `2,500`.

>HelloStay Usage
Used in `Rooms.jsx` line 224: `{room.pricePerNight.toLocaleString('en-IN')}` to display prices like ₹2,500 instead of 2500.

---

## `Date.now()` (Timestamp Generation)
>Definition
Returns the number of milliseconds elapsed since January 1, 1970 (Unix Epoch). This is guaranteed to be unique for sequential calls.

>Purpose
To generate unique IDs for client-side created objects before they're synced to a database. Since timestamps are sequential, no two calls return the same value in the same millisecond.

>Syntax Example
```jsx
const newRoom = {
  id: Date.now(),  // e.g., 1687500000000
  roomNumber: '301',
};
```

>Industry Practice
- Acceptable for temporary client-side IDs during development.
- In production, the backend should assign real auto-incrementing or UUID IDs.
- Never use `Date.now()` for security-sensitive tokens — it's predictable.

>Common Mistakes
- Using `Date.now()` as a permanent database ID — can cause collisions if two users create items at the same millisecond.
- Using `Math.random()` for IDs instead — not guaranteed unique.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 63: `id: Date.now()` to generate a unique identifier for each new room created in localStorage.

---

## `e.preventDefault()` (Form Submission Control)
>Definition
A method on the native browser event object that stops the browser's default behavior for that event. For forms, the default behavior is to submit data and reload the page.

>Purpose
In React SPAs, we never want a form submission to reload the page — it would destroy all React state. `preventDefault()` stops the reload so JavaScript can handle the submission.

>Syntax Example
```jsx
const handleSubmit = (e) => {
  e.preventDefault();  // Stop the page from reloading
  // Now do your custom logic
  const newRoom = { ... };
  saveToStorage(newRoom);
};
```

>Industry Practice
- Always call `e.preventDefault()` as the first line in form submit handlers.
- Without it, the entire React application state is lost on page reload.

>Common Mistakes
- Forgetting `e.preventDefault()` — form submission causes a full page reload, destroying all state.
- Calling it after async operations — must be called synchronously at the top of the handler.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 59: `e.preventDefault()` inside `handleSubmit` to prevent the form from reloading the page when the user clicks "Add Room".

---

## `<select>` and `<option>` (Dropdown Form Elements)
>Definition
HTML form elements for dropdown selections. `<select>` creates the dropdown container; `<option>` defines each selectable item.

>Purpose
To present a fixed list of choices (like room type or status) where the user picks one option.

>Syntax Example
```jsx
const ROOM_TYPES = ['Single', 'Double', 'Suite', 'Deluxe'];

<select
  value={formData.roomType}
  onChange={(e) => handleChange('roomType', e.target.value)}
  className="..."
>
  {ROOM_TYPES.map(type => (
    <option key={type} value={type}>{type}</option>
  ))}
</select>
```

>Industry Practice
- Always use `value` + `onChange` for controlled dropdowns in React.
- Define options in a constant array outside the component — keeps JSX clean.
- Use `appearance-none` in Tailwind to remove the default browser dropdown arrow, then add a custom one.

>Common Mistakes
- Forgetting the `value` prop on `<select>` — React shows a warning about controlled/uncontrolled switching.
- Not providing a `key` on `<option>` elements — causes React warnings when the list is dynamic.

>HelloStay Usage
Used in `AddRoomModal.jsx` for Room Type (line 148) and Room Status (line 163) dropdowns. Options are defined as `ROOM_TYPES` and `ROOM_STATUSES` constants.

---

## `type="number"` (Numeric Input)
>Definition
An HTML input type that restricts the keyboard to numeric characters and provides increment/decrement arrows. It also supports `min`, `max`, and `step` attributes.

>Purpose
To ensure users can only enter numbers for fields like price, quantity, and occupancy.

>Syntax Example
```jsx
<input
  type="number"
  min="0"        // Minimum allowed value
  max="100"      // Maximum allowed value
  step="100"     // Increment step (arrow keys change by 100)
  value={formData.pricePerNight}
  onChange={(e) => handleChange('pricePerNight', e.target.value)}
/>
```

>Industry Practice
- Use `min` to prevent negative values for quantities and prices.
- Use `step` to guide the user toward reasonable increments (e.g., step="100" for prices).
- The value is still a **string** from `e.target.value` — use `parseFloat()` or `parseInt()` to convert.

>Common Mistakes
- Assuming `type="number"` guarantees numeric data — users can still paste text. Always validate.
- Using `type="number"` for phone numbers or IDs — those are text, not numbers.

>HelloStay Usage
Used in `AddRoomModal.jsx` for Price Per Night (`min="0" step="100"`) and Max Occupancy (`min="1" max="10"`) fields.

---

## `type="button"` vs `type="submit"` (Button Behavior)
>Definition
- `type="submit"` — Triggers the parent `<form>`'s `onSubmit` handler when clicked.
- `type="button"` — Does nothing by default; only triggers its own `onClick` handler.

>Purpose
To control whether a button submits a form or just performs a standalone action. Inside a `<form>`, any button without an explicit `type` defaults to `submit`.

>Syntax Example
```jsx
<form onSubmit={handleSubmit}>
  {/* This button submits the form */}
  <button type="submit">Save</button>

  {/* This button closes the form WITHOUT submitting */}
  <button type="button" onClick={handleClose}>Cancel</button>
</form>
```

>Industry Practice
- Always explicitly set `type="button"` on Cancel/Close buttons inside a `<form>`.
- The default `type` in HTML is `"submit"` — omitting it on a Cancel button accidentally triggers form submission.

>Common Mistakes
- Forgetting `type="button"` on Cancel — clicking Cancel submits the form instead of closing the modal.
- Using `type="submit"` on a Delete button — triggers form validation and submission instead of deletion.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 231: the Cancel button uses `type="button"` to close the modal without submitting, while the "Add Room" button uses `type="submit"` to trigger `handleSubmit`.

---

## Props Destructuring (`{ prop1, prop2 }`)
>Definition
A JavaScript syntax that extracts properties from an object into named variables. In React, it's used to receive component props directly as named constants instead of accessing them via `props.xxx`.

>Purpose
Makes component code cleaner and more readable by avoiding repetitive `props.` prefixes.

>Syntax Example
```jsx
// Without destructuring (verbose)
function AddRoomModal(props) {
  return <div>{props.isOpen ? 'Open' : 'Closed'}</div>;
}

// With destructuring (clean)
function AddRoomModal({ isOpen, onClose, onRoomAdded }) {
  return <div>{isOpen ? 'Open' : 'Closed'}</div>;
}

// With default values
function Greeting({ name = 'Guest' }) {
  return <p>Hello, {name}</p>;
}
```

>Industry Practice
- Always destructure props at the function parameter level — it's the React community standard.
- Provide default values for optional props using `= defaultValue`.

>Common Mistakes
- Destructuring a prop that wasn't passed — results in `undefined`. Use default values as a safety net.
- Renaming accidentally — destructuring `({ isOpen: open })` renames the variable to `open`.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 24: `function AddRoomModal({ isOpen, onClose, onRoomAdded })` to cleanly receive modal visibility, close handler, and room-added callback.

---

## Conditional Rendering in JSX
>Definition
React supports three patterns for conditionally showing elements:
1. **Ternary** (`condition ? <A /> : <B />`) — shows one of two things.
2. **Logical AND** (`condition && <A />`) — shows one thing or nothing.
3. **If/else before return** — compute variables, then use them in JSX.

>Purpose
To show or hide UI elements based on state — like showing a delete confirmation vs. edit buttons, or showing an empty state vs. a data table.

>Syntax Example
```jsx
// Pattern 1: Ternary — show A or B
{isLoggedIn ? <Dashboard /> : <Login />}

// Pattern 2: Logical AND — show A or nothing
{rooms.length > 0 && <Table data={rooms} />}

// Pattern 3: Inline ternary in attributes
className={isActive ? 'bg-blue-500' : 'bg-gray-200'}

// Pattern 4: Ternary for inline content
{rooms.length === 0 ? 'No rooms yet' : `${rooms.length} rooms configured`}
```

>Industry Practice
- Use ternary for either/or display.
- Use `&&` for show/hide (the condition must be boolean or falsy-safe).
- Keep complex conditionals outside JSX for readability.

>Common Mistakes
- `{count && <p>Items: {count}</p>}` when `count` is `0` — renders `"0"` because `0` is truthy in JS. Use `{count > 0 && ...}` instead.
- Deeply nested ternaries — unreadable. Extract to a variable or use if/else.

>HelloStay Usage
Used extensively across all components:
- `Dashboard.jsx` line 103: `{hotelData.facilities.length > 0 && (...)}` — show facilities only if any exist.
- `Rooms.jsx` line 155: `{paginatedRooms.length === 0 ? <EmptyState /> : <Table />}` — empty vs. populated table.
- `Rooms.jsx` line 243: `{deletingId === room.id ? <ConfirmButtons /> : <ActionButtons />}` — inline delete confirmation.

---

## `overflow-x-auto` (Horizontal Scroll Container)
>Definition
A Tailwind CSS utility that adds a horizontal scrollbar when content exceeds the container width. `overflow-x` controls horizontal overflow; `auto` shows the scrollbar only when needed.

>Purpose
To prevent wide tables from breaking the page layout on smaller screens by allowing horizontal scrolling.

>Syntax Example
```jsx
<div className="overflow-x-auto">
  <table className="w-full">
    {/* Table may be wider than the screen */}
  </table>
</div>
```

>Industry Practice
- Always wrap `<table>` elements in an `overflow-x-auto` container in responsive designs.
- Without it, wide tables push out of their parent container, breaking the layout.

>Common Mistakes
- Forgetting the wrapper — table breaks out of its container on small screens.
- Using `overflow-x-scroll` instead — always shows a scrollbar, even when not needed.

>HelloStay Usage
Used in `Rooms.jsx` line 180: `<div className="overflow-x-auto">` wrapping the data table to ensure it remains scrollable on narrower viewports.

---

## `divide-y` (Tailwind Border Separator)
>Definition
A Tailwind CSS utility that adds a `border-bottom` to all child elements except the first one. Creates visual separation between list items without manually adding borders.

>Purpose
To create clean dividers between table rows or list items without writing custom CSS or adding `<hr>` elements.

>Syntax Example
```jsx
// Adds a thin border between each child div
<div className="divide-y divide-gray-100">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// In a table body — separates rows
<tbody className="divide-y divide-gray-50">
  <tr>...</tr>
  <tr>...</tr>
</tbody>
```

>Industry Practice
- Use `divide-y` on table `<tbody>` or list containers for clean row separation.
- Pair with `divide-gray-100` or `divide-gray-50` for subtle, non-distracting lines.

>Common Mistakes
- Using `divide-y` on a container with only one child — no visible effect (border is between items, not after the last one).
- Combining with `border-b` on children — creates double borders.

>HelloStay Usage
Used in `Rooms.jsx` line 207: `<tbody className="divide-y divide-gray-50">` to add subtle row separators in the data table.

---

## `disabled` Attribute (Disabling Interactive Elements)
>Definition
An HTML attribute that prevents a button or input from being interacted with. Disabled elements are typically grayed out and do not respond to clicks.

>Purpose
To prevent invalid actions — like clicking "Previous" when on page 1, or clicking "Submit" while a form is being processed.

>Syntax Example
```jsx
<button
  onClick={() => setCurrentPage(p => p - 1)}
  disabled={currentPage === 1}
  className={clsx(
    "p-2 rounded-lg border transition-colors",
    currentPage === 1
      ? "border-gray-100 text-gray-300 cursor-not-allowed"  // Disabled style
      : "border-gray-200 text-gray-600 hover:bg-gray-50"    // Active style
  )}
>
  Previous
</button>
```

>Industry Practice
- Always combine `disabled` with visual styling changes (grayed out, no hover effect, `cursor-not-allowed`).
- Disabled buttons still exist in the DOM — screen readers can read them for accessibility.

>Common Mistakes
- Setting `disabled` without visual changes — users don't know why the button isn't working.
- Using `pointer-events-none` instead of `disabled` — `pointer-events-none` doesn't work with keyboard navigation.

>HelloStay Usage
Used in `Rooms.jsx` lines 290-294 and 316-320: Previous/Next pagination buttons are disabled when on the first/last page respectively.

---

## `appearance-none` (Custom Select Styling)
>Definition
A Tailwind CSS utility that removes the browser's default dropdown styling (the native arrow and OS-specific appearance), allowing you to fully customize the `<select>` element.

>Purpose
Native `<select>` elements look different on every OS and are hard to style. `appearance-none` resets them to a blank slate so Tailwind classes can create a consistent, premium look.

>Syntax Example
```jsx
<select className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg bg-gray-50 appearance-none cursor-pointer">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

>Industry Practice
- Always pair `appearance-none` with a custom arrow icon (like a ChevronDown from Lucide) positioned with `absolute` styling.
- Add `cursor-pointer` to indicate the element is clickable.

>Common Mistakes
- Using `appearance-none` without a custom arrow — users don't see any visual cue that it's a dropdown.
- Forgetting `cursor-pointer` — the cursor changes to text input instead of pointer.

>HelloStay Usage
Used in `Rooms.jsx` line 144: the status filter `<select>` uses `appearance-none` for consistent cross-platform styling.

---

## `backdrop-blur-sm` (Background Blur Effect)
>Definition
A Tailwind CSS utility that applies a Gaussian blur to everything **behind** the element. The element itself remains sharp while the content underneath becomes frosted.

>Purpose
To create a modern frosted-glass overlay effect behind modals and popups — a hallmark of premium UI design (used in iOS, macOS, Linear, Stripe).

>Syntax Example
```jsx
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
```

>Industry Practice
- Combine `backdrop-blur-sm` with a semi-transparent background like `bg-black/40` for the classic frosted overlay.
- Use `sm`, `md`, or `lg` variants to control blur intensity.
- Performance note: heavy blur can impact performance on low-end devices — use `sm` for subtle effect.

>Common Mistakes
- Using `blur-sm` instead of `backdrop-blur-sm` — `blur-sm` blurs the element itself, not what's behind it.
- Using heavy blur on mobile — can cause frame drops.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 96: `backdrop-blur-sm` on the modal backdrop for a premium frosted-glass effect behind the modal card.

---

## `bg-black/40` (Opacity Color Syntax)
>Definition
Tailwind CSS syntax for applying a color with opacity. The `/40` means 40% opacity. `bg-black/40` creates a semi-transparent black overlay.

>Purpose
To create dimmed overlays, subtle backgrounds, and frosted-glass effects without writing custom CSS `rgba()` values.

>Syntax Example
```jsx
// Semi-transparent black (40% opacity)
<div className="bg-black/40" />

// Semi-transparent white (20% opacity)
<div className="bg-white/20" />

// Equivalent CSS: background-color: rgba(0, 0, 0, 0.4);
```

>Industry Practice
- `bg-black/40` to `bg-black/60` for modal overlays (dimming the background).
- `bg-white/10` to `bg-white/20` for glass effects on colored headers.
- Always pair with `backdrop-blur-*` for the full frosted-glass effect.

>Common Mistakes
- Using `bg-gray-900/40` instead of `bg-black/40` — gray with opacity looks muddy compared to pure black.
- Using opacity values above 70 — too dark, the background content becomes invisible.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 96: `bg-black/40` for the modal backdrop overlay. Used in `AddRoomModal.jsx` line 109: `bg-white/20` for the icon container in the modal header.

---

## `max-h-[90vh] overflow-y-auto` (Scrollable Modal)
>Definition
- `max-h-[90vh]` — Sets the maximum height to 90% of the viewport height (Tailwind arbitrary value syntax).
- `overflow-y-auto` — Adds a vertical scrollbar only when content exceeds the max height.

>Purpose
To prevent modals from growing taller than the screen on small viewports or when the form has many fields. The modal becomes scrollable instead of overflowing.

>Syntax Example
```jsx
<div className="max-h-[90vh] overflow-y-auto">
  {/* Long form content that may exceed screen height */}
</div>
```

>Industry Practice
- Always set `max-h-[90vh]` on modals — ensures the modal never completely covers the screen.
- The `10vh` remaining allows the user to see and click the backdrop to dismiss.
- `overflow-y-auto` is preferred over `overflow-y-scroll` — scrollbar appears only when needed.

>Common Mistakes
- Using `h-[90vh]` instead of `max-h-[90vh]` — forces the modal to always be 90% tall, even when content is small.
- Forgetting `overflow-y-auto` — content gets cut off at 90vh with no way to see the rest.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 105: `max-h-[90vh] overflow-y-auto` on the modal card to ensure the form remains scrollable on smaller screens.

---

## `space-y-5` (Vertical Spacing)
>Definition
A Tailwind CSS utility that adds consistent vertical spacing (margin-top) between child elements. `space-y-5` adds `1.25rem` (20px) between each child.

>Purpose
To create uniform gaps between form fields or stacked elements without manually adding margins to each element.

>Syntax Example
```jsx
<div className="space-y-5">
  <input placeholder="Field 1" />
  <input placeholder="Field 2" />
  <input placeholder="Field 3" />
  {/* Each field automatically has 20px gap above it */}
</div>
```

>Industry Practice
- Use `space-y-*` for vertical stacks and `space-x-*` for horizontal rows.
- Variants: `space-y-1` (4px), `space-y-2` (8px), `space-y-3` (12px), `space-y-4` (16px), `space-y-5` (20px), `space-y-6` (24px).
- Works by applying `margin-top` to all children except the first.

>Common Mistakes
- Using `space-y` on a container with `display: flex` — `space-y` uses margin, not gap. For flex containers, use `gap-*` instead.
- Mixing `space-y-*` with manual margins on children — creates uneven spacing.

>HelloStay Usage
Used in `AddRoomModal.jsx` line 125: `<form className="space-y-5">` to create consistent 20px spacing between all form fields.

---

## `flex-1` (Flexible Grow)
>Definition
A Tailwind CSS utility that sets `flex: 1 1 0%` — makes a flex item grow to fill all available space in its container, while also allowing it to shrink if needed.

>Purpose
To make buttons, inputs, or columns equally share the available width in a flex container.

>Syntax Example
```jsx
<div className="flex items-center gap-3">
  <button className="flex-1">Cancel</button>  {/* Takes half the space */}
  <button className="flex-1">Save</button>    {/* Takes the other half */}
</div>
```

>Industry Practice
- Use `flex-1` for equal-width button pairs (Cancel / Save, Yes / No).
- Use `flex-shrink-0` on elements that should NOT shrink (like icons next to text).

>Common Mistakes
- Using `w-full` inside flex instead of `flex-1` — `w-full` doesn't respect sibling elements' space.
- Using `flex-1` on a flex container itself — only works on flex children.

>HelloStay Usage
Used in `AddRoomModal.jsx` lines 232 and 238: both Cancel and Add Room buttons use `flex-1` to equally share the form footer width.

---

## Unicode Escape Sequences (`\u20B9`)
>Definition
A way to represent special characters in JavaScript strings using their Unicode code point. `\u20B9` is the Unicode for the Indian Rupee symbol (₹).

>Purpose
To display special characters that may not be available on all keyboards or in all character encodings.

>Syntax Example
```jsx
// Rupee symbol
const price = `\u20B9${amount}`;
// Renders: ₹2,500

// In JSX
<span>{'\u20B9'}{room.pricePerNight}</span>
// Renders: ₹2,500
```

>Industry Practice
- Use `\u20B9` for Rupee, `\u00A5` for Yen, `\u20AC` for Euro, `\u0024` for Dollar.
- In JSX, wrap in `{'\uXXXX'}` to embed inside JSX text content.

>Common Mistakes
- Copy-pasting the ₹ symbol directly — may cause encoding issues in some environments. Unicode escapes are safer.
- Forgetting the curly braces in JSX — `{'\u20B9'}` works, `'\u20B9'` inside JSX text doesn't interpolate.

>HelloStay Usage
Used in `Dashboard.jsx` line 66 and `Rooms.jsx` line 224 to display the Indian Rupee symbol (₹) before price values.

---

## `&apos;` (HTML Entity in JSX)
>Definition
An HTML entity that represents an apostrophe (single quote: `'`). In JSX, you cannot use raw `"` inside attribute values that are already quoted with `"`, so HTML entities are used.

>Purpose
To safely include special characters like apostrophes in JSX text content without breaking the JSX parser.

>Syntax Example
```jsx
// WRONG — breaks JSX parser
<p>Here&apos;s what&apos;s happening</p>

// CORRECT — use HTML entity
<p>Here&apos;s what&apos;s happening today.</p>

// ALTERNATIVE — use template literal
<p>{`Here's what's happening today.`}</p>
```

>Industry Practice
- JSX automatically escapes `'` and `"` in text content, but `&apos;` is the safest approach.
- Most modern JSX parsers handle `"` in text content, but `&apos;` is universally safe.

>Common Mistakes
- Writing raw apostrophes in JSX — works in most cases but can cause parser issues in older setups.
- Over-escaping — using `&apos;` everywhere makes source code hard to read.

>HelloStay Usage
Used in `Dashboard.jsx` line 86: `Here is what&apos;s happening at your property today` to safely include the apostrophe in "what's".

---

## `null` as Initial State
>Definition
Setting a state's initial value to `null` to indicate "nothing is selected" or "no value yet." This is different from `undefined` (which means "doesn't exist") or `""` (empty string).

>Purpose
To represent the absence of a selection or value in a type-safe way. `null` is explicit — it means "I intentionally have no value."

>Syntax Example
```jsx
// null = nothing selected yet
const [deletingId, setDeletingId] = useState(null);

// When user clicks delete:
setDeletingId(room.id);  // Now a room is marked for deletion

// When user cancels:
setDeletingId(null);     // Back to "nothing selected"

// Check in JSX
{deletingId === room.id ? <ConfirmButtons /> : <ActionButtons />}
```

>Industry Practice
- Use `null` for "selected item" states (selected row, active modal, editing ID).
- Use `""` (empty string) for text input initial values.
- Use `false` for boolean toggles (modal open/closed).

>Common Mistakes
- Using `undefined` instead of `null` — `undefined` can mean the variable wasn't declared, causing subtle bugs.
- Comparing with `== null` instead of `=== null` — `== null` matches both `null` and `undefined`.

>HelloStay Usage
Used in `Rooms.jsx` line 30: `const [deletingId, setDeletingId] = useState(null)` — tracks which room's delete confirmation is active. `null` means no delete is in progress.

---

## Searchable Dropdown (Type-to-Filter)
>Definition
A custom dropdown component that combines a text input with a filtered list of options. As the user types, the list narrows down to matching items. Unlike a native `<select>`, it supports searching, custom entries, and rich styling.

>Purpose
To give users the speed of selecting from presets while allowing free-text entry for custom values. Ideal for long lists (room types, countries, categories) where scrolling is slow.

>Syntax Example
```jsx
const [search, setSearch] = useState('');
const [selected, setSelected] = useState('');
const [showDropdown, setShowDropdown] = useState(false);

const filtered = items.filter(item =>
  item.toLowerCase().includes(search.toLowerCase())
);

<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onFocus={() => setShowDropdown(true)}
  placeholder="Search or type..."
/>
{showDropdown && (
  <div className="absolute z-20 mt-1 bg-white border rounded-xl shadow-lg max-h-52 overflow-y-auto">
    {filtered.map(item => (
      <button key={item} onClick={() => { setSelected(item); setSearch(item); setShowDropdown(false); }}>
        {item}
      </button>
    ))}
    {/* "Add custom" option if no exact match */}
  </div>
)}
```

>Industry Practice
- Always use `z-20` or higher for dropdown overlays so they appear above other content.
- Close dropdown on outside click using `useRef` + `useEffect` with `mousedown` listener.
- Show a "Add [custom]" option when the typed value doesn't match any preset.
- Limit dropdown height with `max-h-52 overflow-y-auto` for long lists.

>Common Mistakes
- Forgetting to close dropdown on outside click — leaves zombie dropdowns open.
- Not resetting selected value when user types something new — causes stale state.
- Using `z-10` which gets covered by other positioned elements.

>HelloStay Usage
Used in `AddRoomModal.jsx` for the Room Type selector. Shows 20 industry-standard room types as filterable suggestions, with an "Add [custom type]" option when the user types a value not in the list.

---

## Inline Status Change
>Definition
A pattern where a table cell switches between a display view (e.g., a colored badge) and an edit view (e.g., a `<select>` dropdown) when clicked, allowing quick status updates without navigating to a separate edit page.

>Purpose
To reduce clicks for high-frequency actions like changing room status. Front desk staff often need to update statuses rapidly — inline editing eliminates the need to open modals or navigate away from the table.

>Syntax Example
```jsx
const [editingId, setEditingId] = useState(null);

// In table row:
{editingId === room.id ? (
  <select
    autoFocus
    value={room.status}
    onChange={(e) => { handleStatusChange(room.id, e.target.value); setEditingId(null); }}
    onBlur={() => setEditingId(null)}
    className="text-xs font-semibold px-2 py-1.5 rounded-lg border"
  >
    <option value="Available">Available</option>
    <option value="Occupied">Occupied</option>
  </select>
) : (
  <button onClick={() => setEditingId(room.id)} className="badge-style">
    {room.status}
  </button>
)}
```

>Industry Practice
- Use `autoFocus` on the select/input when it appears so the user can immediately interact.
- Handle `onBlur` to cancel editing when user clicks away — prevents stuck edit states.
- Persist changes immediately to state/localStorage on selection, don't wait for a "Save" button.
- Only allow one row to be in edit mode at a time (single `editingId` state).

>Common Mistakes
- Forgetting `onBlur` handler — dropdown stays open forever if user clicks elsewhere.
- Not preventing event bubbling — clicking the badge might trigger row-level actions.
- Saving on every keystroke instead of on selection — causes unnecessary re-renders.

>HelloStay Usage
Used in `Rooms.jsx` for the Status column. Clicking the status badge reveals a dropdown to change status. Changes persist immediately to localStorage. `editingId` state ensures only one row is editable at a time.

---

## Dynamic Currency Display
>Definition
A pattern where the currency symbol shown in the UI is read from a shared configuration (localStorage or Context) rather than being hardcoded. This allows the same component to display different currencies based on the hotel's country.

>Purpose
To support multi-country usage without maintaining separate components for each currency. The currency is set once during hotel setup and flows through to all price-related displays.

>Syntax Example
```jsx
// Reading currency from localStorage
const currencySymbol = useMemo(() => {
  const saved = localStorage.getItem('helloStay_hotelData');
  const data = saved ? JSON.parse(saved) : {};
  return CURRENCY_SYMBOLS[data.currency] || '₹';  // fallback to ₹
}, []);

// In JSX
<label>Price Per Night ({currencySymbol})</label>
<input prefix={currencySymbol} type="number" />

// In table
<span>{currencySymbol}{room.price.toLocaleString()}</span>
```

>Industry Practice
- Use a symbol lookup map (object) for O(1) access instead of switch-case or if-else chains.
- Always provide a fallback symbol in case localStorage is empty or currency is undefined.
- Use `useMemo` for the currency lookup to avoid re-reading localStorage on every render.
- Store currency as a ISO code (e.g., 'INR', 'USD') in localStorage, not the symbol itself.

>Common Mistakes
- Hardcoding `₹` or `$` in components — breaks when the hotel is in another country.
- Storing the symbol instead of the code — makes it harder to use for formatting/locale operations.
- Not providing a fallback — causes blank or undefined to appear in the UI.

>HelloStay Usage
Used in `AddRoomModal.jsx` and `Rooms.jsx` to display the correct currency symbol. The symbol is read from `localStorage('helloStay_hotelData').currency` and looked up in a `CURRENCY_SYMBOLS` map. Fallback is `₹`.

---

## Auto-Populate Related Fields
>Definition
A UX pattern where selecting a value in one field automatically fills in related fields. For example, selecting a country pre-fills the currency field based on that country's standard currency.

>Purpose
To reduce manual input and prevent errors. Users don't need to remember which currency their country uses — the system knows and fills it in automatically. The user can still override if needed.

>Syntax Example
```jsx
const handleCountryChange = (countryCode) => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  setFormData(prev => ({
    ...prev,
    country: countryCode,
    currency: country ? country.currency : prev.currency  // auto-fill
  }));
};

<select onChange={(e) => handleCountryChange(e.target.value)}>
  {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
</select>

{/* Currency can still be manually changed */}
<select value={formData.currency} onChange={...}>
  {currencies.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
</select>
```

>Industry Practice
- Keep the auto-filled field editable — don't lock it. Some hotels in a country may use a different currency (e.g., a US hotel accepting EUR).
- Show a confirmation card after selection to give visual feedback of the auto-populated values.
- Use a lookup table (array of objects with `code` and `currency`) for the mapping.

>Common Mistakes
- Overwriting user's manual choice when a different field changes — always check if the field was already set by the user.
- Using a chain of if-else for mapping — use a clean data structure instead.
- Not providing a "no selection" default — forces the user into a currency before they're ready.

>HelloStay Usage
Used in `RegisterHotel.jsx`. When the user selects a Country, the Currency field is auto-populated with that country's standard currency (e.g., India → INR, US → USD). The user can still change the currency manually if needed.

---

## Role-Based Navigation (RBAC)
>Definition
A pattern where the navigation menu (sidebar) dynamically shows or hides items based on the logged-in user's role. Each navigation item declares which roles can access it, and the component filters accordingly.

>Purpose
To give different user types (Owner, Manager, Employee) a tailored experience. Owners see everything, managers see operational modules, and employees see only what they need. This prevents confusion and unauthorized access to sensitive modules.

>Syntax Example
```jsx
// Define nav items with role access
const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', roles: ['owner', 'manager', 'employee'] },
  { name: 'Rooms', path: '/rooms', roles: ['owner', 'manager', 'employee'] },
  { name: 'Bookings', path: '/bookings', roles: ['owner'] },
  { name: 'Employees', path: '/employees', roles: ['owner'] },
  { name: 'Expenses', path: '/expenses', roles: ['owner', 'manager'] },
  { name: 'Settings', path: '/settings', roles: ['owner'] },
];

// Read role from storage
const userRole = localStorage.getItem('helloStay_userRole') || 'owner';

// Filter items
const activeItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

// Render
{activeItems.map(item => <NavLink to={item.path}>{item.name}</NavLink>)}
```

>Industry Practice
- Define roles at the data level (each item has a `roles` array) — not in JSX conditionals.
- Always provide a fallback role (e.g., `|| 'owner'`) to prevent empty sidebars.
- Show the current role in the sidebar header so users know which account they're using.
- For production apps, roles come from the backend (JWT claims or session). localStorage is for MVP/setup phase only.

>Common Mistakes
- Hardcoding role checks in JSX (`{role === 'owner' && <NavLink />}`) — creates scattered, hard-to-maintain logic.
- Forgetting to store role before navigating to dashboard — Sidebar reads it on mount, so it must be set first.
- Not showing role description on login — users don't know what each role can access.

>HelloStay Usage
Used in `Sidebar.jsx` and `Login.jsx`. Each nav item has a `roles` array. The Login page stores the role in `localStorage('helloStay_userRole')`. The Sidebar filters items based on this role. Owner sees all 12 modules, Manager sees 4 (Dashboard, Rooms, Inventory, Expenses), Employee sees 3 (Dashboard, Rooms, Inventory).

---

## Computed Property Names
>Definition
A JavaScript feature (ES6) that allows you to use an expression as an object property key, wrapped in square brackets `[]`. Instead of writing `obj.fixedKey = value`, you write `obj[expression] = value`.

>Purpose
To dynamically set object keys based on variables. Commonly used in React when updating a specific field in state based on a parameter.

>Syntax Example
```jsx
// Regular object literal
const obj = { name: 'John' };

// Computed property name
const field = 'age';
const obj2 = { [field]: 25 };  // { age: 25 }

// In React state updates
const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  // If field = 'guestName', result: { ...prev, guestName: value }
};

// With template literal
const key = `charge_${room.id}`;
const charges = { [key]: 500 };  // { charge_123: 500 }
```

>Industry Practice
- Use computed property names for dynamic form handlers — one handler for all fields instead of separate handlers per field.
- The expression inside `[]` can be a variable, a template literal, or any expression that evaluates to a string.
- Avoid complex expressions inside `[]` — keep it simple (variable or template literal).

>Common Mistakes
- Forgetting the `[]` around the key — `{ field: value }` creates a key literally named "field", not the variable's value.
- Using computed property names when a static key would be clearer — don't overcomplicate.
- Not spreading the previous state — `return { [field]: value }` loses all other fields. Always use `prev => ({ ...prev, [field]: value })`.

>HelloStay Usage
Used extensively in `ManageFacilities.jsx` for dynamic form handlers: `setBookingForm(prev => ({ ...prev, [field]: value }))` and `setChargesForm(prev => ({ ...prev, [field]: value }))`. Also used in `Rooms.jsx`, `AddRoomModal.jsx`, and `RegisterHotel.jsx`.

---

## Optional Chaining (`?.`)
>Definition
A JavaScript operator (ES2020) that safely accesses nested properties of an object without throwing an error if an intermediate property is `null` or `undefined`. Written as `obj?.prop?.subprop`.

>Purpose
To avoid "Cannot read property of undefined" errors when accessing nested data that might not exist. Eliminates verbose null-checking chains.

>Syntax Example
```jsx
// Without optional chaining (verbose)
const restaurant = data && data.facilities && data.facilities.includes('Restaurant');

// With optional chaining (clean)
const restaurant = data?.facilities?.includes('Restaurant');

// Chaining multiple levels
const city = hotelData?.address?.city?.name;

// With nullish coalescing for default
const hasRestaurant = data?.facilities?.includes('Restaurant') ?? false;
```

>Industry Practice
- Use optional chaining when accessing localStorage data that might be null on first load.
- Combine with nullish coalescing (`??`) for default values.
- Don't over-chain — `a?.b?.c?.d?.e` is hard to read. Consider breaking into multiple lines.
- Optional chaining short-circuits: if `data` is null, `data?.facilities` returns `undefined` without evaluating further.

>Common Mistakes
- Using optional chaining when the variable is guaranteed to exist — adds unnecessary complexity.
- Forgetting that optional chaining returns `undefined`, not `false` — `null?.prop` is `undefined`, not `false`.
- Using `?.` when `||` would be more appropriate — `?.` only guards against null/undefined, not falsy values like `0` or `""`.

>HelloStay Usage
Used in `Sidebar.jsx`: `data.facilities?.includes('In-house Restaurant') ?? true` — safely checks if the facility exists in hotel data even if localStorage is empty or data is malformed. Also used in `ManageFacilities.jsx` for accessing nested hotel data.

---

## Nullish Coalescing (`??`)
>Definition
A JavaScript operator (ES2020) that returns the right-hand operand when the left-hand operand is `null` or `undefined`. Unlike `||`, it does NOT treat `0`, `""`, or `false` as falsy.

>Purpose
To provide default values only when a value is truly missing (`null`/`undefined`), not when it's falsy but valid (like `0` or empty string).

>Syntax Example
```jsx
// Problem with || (OR)
const count = 0;
console.log(count || 10);  // 10 — wrong! 0 is a valid value

// Solution with ?? (Nullish Coalescing)
console.log(count ?? 10);  // 0 — correct! Only uses default when null/undefined

// In React
const rooms = data?.totalRooms ?? 50;  // Use 50 only if totalRooms is null/undefined
const currency = hotelData?.currency ?? 'INR';  // Default to INR only if not set

// Chaining
const hasRestaurant = data?.facilities?.includes('Restaurant') ?? false;
```

>Industry Practice
- Use `??` when the fallback should only apply for missing values, not falsy values.
- Use `||` when any falsy value should trigger the fallback.
- Common with localStorage reads: `JSON.parse(saved)?.value ?? defaultValue`.

>Common Mistakes
- Using `||` instead of `??` when `0` or `""` are valid values — `0 || 10` gives `10`, but `0 ?? 10` gives `0`.
- Overusing `??` when `||` is more readable — if you want to treat all falsy values as "missing", use `||`.

>HelloStay Usage
Used in `Sidebar.jsx`: `data.facilities?.includes('In-house Restaurant') ?? true` — defaults to `true` if facilities data is missing. Used in `ManageFacilities.jsx` for safely reading hotel data and room data from localStorage.

---

## `e.stopPropagation()`
>Definition
A DOM event method that prevents an event from bubbling up to parent elements. When called inside a nested element's event handler, it stops the event from triggering handlers on parent elements.

>Purpose
To prevent unwanted side effects when clicking nested interactive elements inside a clickable container. For example, clicking a "Delete" button inside a clickable card should not also trigger the card's onClick.

>Syntax Example
```jsx
// Problem: clicking Delete also triggers card's onClick
<div onClick={() => openCard()}>
  <button onClick={() => deleteItem()}>Delete</button>  // Also opens card!
</div>

// Solution: stopPropagation
<div onClick={() => openCard()}>
  <button onClick={(e) => {
    e.stopPropagation();  // Prevents card's onClick from firing
    deleteItem();
  }}>Delete</button>
</div>

// In ManageFacilities.jsx
<button
  onClick={(e) => {
    e.stopPropagation();  // Don't trigger card's expand/collapse
    setShowBookingModal(true);
  }}
>
  New Booking
</button>
```

>Industry Practice
- Use `stopPropagation` when you have nested clickable elements and don't want the parent's click to fire.
- Always put `stopPropagation` as the first line in the handler — before any other logic.
- Consider whether the parent should be a `<div>` instead of a clickable element — sometimes the design is the issue, not the event.
- Prefer `stopPropagation` over CSS `pointer-events: none` when you need the nested element to remain interactive.

>Common Mistakes
- Forgetting to accept the `e` parameter — `onClick={() => stopPropagation()}` won't work; it needs `onClick={(e) => e.stopPropagation()}`.
- Using `stopPropagation` on every nested click — overuse makes code hard to follow. Only use when necessary.
- Not handling the action that should happen — `stopPropagation` only prevents the parent's handler; you still need to call your own handler.

>HelloStay Usage
Used extensively in `ManageFacilities.jsx` for nested buttons inside clickable facility cards. When clicking "New Booking", "Settings", or "Delete" buttons, `e.stopPropagation()` prevents the card's expand/collapse handler from also firing.

---

## `.find()` (Array Method)
>Definition
A JavaScript array method that returns the **first element** that satisfies a provided testing function. Returns `undefined` if no element matches.

>Purpose
To search for a single item in an array based on a condition. Unlike `.filter()` which returns all matches, `.find()` returns only the first match and stops.

>Syntax Example
```jsx
const rooms = [
  { id: 1, number: '101', type: 'Standard' },
  { id: 2, number: '202', type: 'Deluxe' },
  { id: 3, number: '303', type: 'Suite' },
];

// Find a specific room
const room = rooms.find(r => r.id === 2);
// { id: 2, number: '202', type: 'Deluxe' }

// Find with string matching
const country = COUNTRIES.find(c => c.code === 'IN');

// Find with optional chaining (safe)
const match = rooms.find(r => r.number === '999');
console.log(match);  // undefined — no error

// Use found item
const charge = PAYMENT_OPTIONS.find(p => p.value === booking.paymentType)?.label;
```

>Industry Practice
- Use `.find()` when you need one item; use `.filter()` when you need multiple.
- Always handle the `undefined` case — use optional chaining `?.` on the result.
- `.find()` stops at the first match — if you need all matches, use `.filter()`.
- The callback function should return a boolean (`true`/`false`).

>Common Mistakes
- Using `.find()` when you need `.filter()` — `.find()` returns only the first match.
- Not checking for `undefined` result — `rooms.find(r => r.id === 999).name` throws an error.
- Using `.findIndex()` when you need the item itself — `.findIndex()` returns the index, not the item.

>HelloStay Usage
Used in `ManageFacilities.jsx`: `PAYMENT_OPTIONS.find(p => p.value === booking.paymentType)?.label` to display the human-readable payment status label. Also used in `RegisterHotel.jsx` for country-currency mapping.

---

## `.some()` (Array Method)
>Definition
A JavaScript array method that tests whether **at least one element** in the array passes a provided test function. Returns `true` if any element matches, `false` otherwise.

>Purpose
To check if a condition is met by any element in an array without iterating through all elements. Returns early on first match, making it efficient for existence checks.

>Syntax Example
```jsx
const rooms = [
  { id: 1, type: 'Standard', status: 'Available' },
  { id: 2, type: 'Deluxe', status: 'Occupied' },
  { id: 3, type: 'Suite', status: 'Available' },
];

// Check if any room is occupied
const hasOccupied = rooms.some(r => r.status === 'Occupied');  // true

// Check if any room matches a type
const hasSuite = rooms.some(r => r.type === 'Suite');  // true

// In searchable dropdown (check for exact match)
const hasExactMatch = ITEMS.some(i => i.toLowerCase() === search.toLowerCase());

// Combining with .filter()
const allOccupied = rooms.filter(r => r.status === 'Occupied');
const someAvailable = rooms.some(r => r.status === 'Available');
```

>Industry Practice
- Use `.some()` for boolean existence checks — "does any item match?".
- Use `.every()` for "do all items match?" — opposite of `.some()`.
- `.some()` short-circuits — stops at the first match, so it's faster than `.filter()` when you only need a boolean.
- Don't use `.some()` when you need the actual item — use `.find()` instead.

>Common Mistakes
- Using `.some()` when you need the item — `.some()` returns `true`/`false`, not the element.
- Using `.filter().length > 0` when `.some()` would be cleaner and faster.
- Confusing `.some()` with `.every()` — `.some()` = any match, `.every()` = all must match.

>HelloStay Usage
Used in `AddRoomModal.jsx` and `ManageFacilities.jsx` for checking if a typed value matches any existing item: `INDUSTRY_ROOM_TYPES.some(t => t.toLowerCase() === typeSearch.toLowerCase())`. Also used in `Sidebar.jsx` for facility checks.

---

## Concept 62: Tab Navigation Pattern

>Definition
A tab-based navigation pattern that switches between different views within the same page without navigating to a new route. Uses a state variable to track the active tab and conditionally renders content.

>Purpose
- Organize related content into digestible sections
- Reduce page clutter by showing one section at a time
- Provide quick switching between views without page reloads
- Common in settings pages, reports, and multi-section modules

>Syntax Example
```jsx
const [activeTab, setActiveTab] = useState('overview');

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'occupancy', label: 'Occupancy', icon: BedDouble },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
];

// Tab bar
<div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
  {tabs.map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
        activeTab === tab.id
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <tab.icon className="w-4 h-4" />
      {tab.label}
    </button>
  ))}
</div>

// Conditional rendering
{activeTab === 'overview' && <OverviewSection />}
{activeTab === 'occupancy' && <OccupancySection />}
{activeTab === 'revenue' && <RevenueSection />}
```

>Industry Practice
- Use a state variable (`activeTab`) to track which tab is active
- Highlight the active tab with background color and shadow
- Include icons in tabs for visual clarity
- Use `flex-1` for equal-width tabs
- Animate tab content with Framer Motion for smooth transitions

>Common Mistakes
- Using separate routes for each tab (causes full page reloads)
- Not highlighting the active tab (poor UX)
- Making tab content too heavy ( defeats the purpose of tabs)
- Forgetting to reset filters/state when switching tabs

>HelloStay Usage
Used in `HRPayroll.jsx` (Attendance/Payroll/Payslips tabs), `Restaurant.jsx` (Orders/Menu/Tables tabs), `Reports.jsx` (Overview/Occupancy/Revenue/Expenses tabs), and `Settings.jsx` (Hotel Profile/System/Backup tabs).

---

## Concept 63: Card Grid Layout

>A layout pattern that displays data as a grid of cards instead of table rows. Each card is a self-contained unit with its own visual hierarchy, actions, and metadata.

>Purpose
- Display profiles, items, or records visually
- Better for data that benefits from visual representation (guest profiles, menu items)
- More engaging than table rows for certain data types
- Works well on mobile and responsive layouts

>Syntax Example
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {getInitials(item.name)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.subtitle}</p>
          </div>
        </div>
        {/* Actions visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Card stats/content */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-lg font-bold text-gray-900">{item.stat1}</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase">Label</p>
        </div>
      </div>
    </motion.div>
  ))}
</div>
```

>Industry Practice
- Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive layout
- Use `group` + `group-hover:opacity-100` for hover-reveal actions
- Add `hover:shadow-md transition-all` for interactive feedback
- Use Framer Motion `initial`/`animate` for staggered entrance
- Keep card content concise — use stats grids inside cards

>Common Mistakes
- Making cards too tall (keep content compact)
- Not providing hover feedback on interactive cards
- Using cards for tabular data (tables are better for dense data)
- Missing responsive breakpoints (cards stack on mobile)

>HelloStay Usage
Used in `Guests.jsx` for guest profiles with avatar, stay history, and total spent.

---

## Concept 64: Avatar Initials Pattern

>A visual pattern that generates colored circular avatars from user initials when no profile image is available. Uses the first letters of the name with a background color derived from the name.

>Purpose
- Provide visual identity for users/guests without profile images
- Add color and visual variety to lists and cards
- Quick visual scanning in data tables and card grids

>Syntax Example
```jsx
// Get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate consistent color from name
const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
const avatarColor = colors[name.charCodeAt(0) % colors.length];

// Render avatar
<div className={`w-11 h-11 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
  {getInitials(name)}
</div>
```

>Industry Practice
- Use `charCodeAt(0) % colors.length` for deterministic color assignment
- Limit to 2 characters (first letters of first/last name)
- Use consistent sizing: `w-10 h-10` for tables, `w-14 h-14` for profiles
- White text on colored background for contrast

>Common Mistakes
- Using random colors (causes闪烁 on re-render)
- Showing more than 2 characters (breaks layout)
- Not handling single-word names (show first 2 letters)

>HelloStay Usage
Used in `Guests.jsx`, `Employees.jsx`, and `HRPayroll.jsx` for employee/guest avatars.

---

## Concept 65: Quick Stock Adjustment Pattern

>An inline action pattern that allows users to increment/decrement a value directly in a table row without opening an edit modal. Uses small +/- buttons with immediate visual feedback.

>Purpose
- Speed up common operations (quantity adjustments)
- Reduce modal/form fatigue for simple changes
- Provide immediate visual feedback
- Common in inventory, POS, and quantity-based systems

>Syntax Example
```jsx
const handleQuickAdjust = (itemId, delta) => {
  const updated = items.map(i => {
    if (i.id !== itemId) return i;
    const newQty = Math.max(0, i.quantity + delta);
    return { ...i, quantity: newQty, totalValue: newQty * i.costPerUnit };
  });
  setItems(updated);
  localStorage.setItem('helloStay_inventory', JSON.stringify(updated));
};

// Render in table
<td className="px-4 py-3">
  <div className="flex items-center gap-1">
    <button
      onClick={() => handleQuickAdjust(item.id, -1)}
      className="w-6 h-6 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center justify-center"
    >-</button>
    <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
    <button
      onClick={() => handleQuickAdjust(item.id, 1)}
      className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold flex items-center justify-center"
    >+</button>
  </div>
</td>
```

>Industry Practice
- Use `Math.max(0, ...)` to prevent negative quantities
- Update both React state AND localStorage on every change
- Use small, compact buttons (w-6 h-6) to fit in table cells
- Color-code: red for decrease, green for increase

>Common Mistakes
- Forgetting `Math.max(0, ...)` — allows negative stock
- Not updating localStorage — data lost on refresh
- Making buttons too large — breaks table layout

>HelloStay Usage
Used in `Inventory.jsx` for quick quantity adjustments directly in the inventory table.

---

## Concept 66: Chart Integration with recharts

>The process of integrating the recharts library into React components for data visualization. Uses ResponsiveContainer for responsiveness, and BarChart/PieChart/LineChart for different chart types.

>Purpose
- Visual data representation for dashboards and reports
- Make data insights immediately apparent
- Professional-looking charts without custom SVG coding
- Responsive charts that adapt to container size

>Syntax Example
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Bar Chart
<ResponsiveContainer width="100%" height={200}>
  <BarChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
    <YAxis tick={{ fontSize: 11 }} />
    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
    <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

// Pie Chart
<ResponsiveContainer width="100%" height={200}>
  <PieChart>
    <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
      {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

>Industry Practice
- Always wrap charts in `ResponsiveContainer` for responsiveness
- Use `CartesianGrid` with light stroke for readability
- Customize `Tooltip` with `formatter` for currency/number formatting
- Use `Cell` for color-coded pie/donut segments
- Set `radius` on Bar for rounded corners

>Common Mistakes
- Not wrapping in ResponsiveContainer (chart won't resize)
- Missing `dataKey` prop (chart won't render)
- Using too many colors (keep to 5-6 max)
- Not handling empty data (shows broken chart)

>HelloStay Usage
Used in `Dashboard.jsx` (occupancy bar chart), `Reports.jsx` (revenue, occupancy, expense charts), and `Expenses.jsx` (category breakdown).

---

## Concept 67: Data Export/Import Pattern

>A pattern for backing up and restoring application data by serializing localStorage to JSON and deserializing it back. Provides data portability and disaster recovery.

>Purpose
- Allow users to backup all application data
- Enable data migration between browsers/devices
- Provide disaster recovery capability
- Support data sharing between installations

>Syntax Example
```jsx
// Export data
const handleExport = () => {
  const data = {};
  const keys = ['helloStay_rooms', 'helloStay_bookings', 'helloStay_guests'];
  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) data[key] = JSON.parse(value);
  });
  data.exportDate = new Date().toISOString();

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Import data
const handleImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'exportDate') localStorage.setItem(key, JSON.stringify(value));
      });
      window.location.reload();
    } catch { alert('Invalid backup file'); }
  };
  reader.readAsText(file);
};
```

>Industry Practice
- Use `JSON.stringify(data, null, 2)` for pretty-printed backups
- Use `Blob` + `URL.createObjectURL` for download triggering
- Use `FileReader` for reading imported files
- Include timestamp in export filename
- Validate JSON structure before importing
- Reload page after import to refresh all state

>Common Mistakes
- Not validating JSON before importing (crashes app)
- Missing `URL.revokeObjectURL()` (memory leak)
- Not including metadata (export date, version)
- Importing without clearing old data (data conflicts)

>HelloStay Usage
Used in `Settings.jsx` for complete data backup and restore functionality.

---

## Concept 68: Attendance Marking Pattern

>A pattern for recording daily attendance status per employee. Uses inline buttons for quick status selection with visual feedback showing the current status.

>Purpose
- Track employee attendance daily
- Quick status marking without forms
- Visual summary of monthly attendance
- Foundation for payroll calculation

>Syntax Example
```jsx
const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Half Day', 'Leave', 'Holiday'];

const STATUS_STYLES = {
  'Present': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Absent': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Half Day': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const handleMarkAttendance = (empId, status) => {
  const existing = attendance.find(a => a.employeeId === empId && a.date === date);
  let updated;
  if (existing) {
    updated = attendance.map(a =>
      a.employeeId === empId && a.date === date ? { ...a, status } : a
    );
  } else {
    updated = [...attendance, { id: Date.now(), employeeId: empId, date, status }];
  }
  setAttendance(updated);
  localStorage.setItem('helloStay_attendance', JSON.stringify(updated));
};

// Render inline status buttons
{ATTENDANCE_STATUSES.map(status => {
  const isActive = todayStatus?.status === status;
  return (
    <button
      key={status}
      onClick={() => handleMarkAttendance(emp.id, status)}
      className={`text-[10px] font-semibold px-2 py-1 rounded-full border transition-all ${
        isActive
          ? `${STATUS_STYLES[status].bg} ${STATUS_STYLES[status].text} ${STATUS_STYLES[status].border}`
          : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
      }`}
    >
      {status}
    </button>
  );
})}
```

>Industry Practice
- Use inline buttons (not dropdowns) for quick status marking
- Color-code each status for instant visual recognition
- Check for existing record before creating (upsert pattern)
- Show monthly summary stats per employee

>Common Mistakes
- Creating duplicate records (not checking for existing)
- Not persisting to localStorage
- Missing visual feedback for active status
- Using dropdowns instead of inline buttons (slower UX)

>HelloStay Usage
Used in `HRPayroll.jsx` Attendance tab for daily attendance marking with 5 status options.

---

## Concept 69: Order Workflow Pattern

>A pattern for managing order status progression through a defined workflow. Each status change is triggered by a user action button, and the workflow follows a linear path.

>Purpose
- Track order lifecycle from creation to completion
- Provide clear next-action buttons based on current status
- Visual status indicators for quick scanning
- Common in restaurant, hotel, and service industries

>Syntax Example
```jsx
const ORDER_STATUSES = ['Preparing', 'Ready', 'Served', 'Paid'];

const STATUS_STYLES = {
  'Preparing': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Ready': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Served': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Paid': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
};

const handleStatusChange = (orderId, newStatus) => {
  const updated = orders.map(o =>
    o.id === orderId ? { ...o, status: newStatus } : o
  );
  setOrders(updated);
  localStorage.setItem('helloStay_restaurantOrders', JSON.stringify(updated));
};

// Conditional next-action buttons
{order.status === 'Preparing' && (
  <button onClick={() => handleStatusChange(order.id, 'Ready')}>
    Mark Ready
  </button>
)}
{order.status === 'Ready' && (
  <button onClick={() => handleStatusChange(order.id, 'Served')}>
    Mark Served
  </button>
)}
{order.status === 'Served' && (
  <button onClick={() => handleStatusChange(order.id, 'Paid')}>
    Mark Paid
  </button>
)}
```

>Industry Practice
- Show only the next logical action (not all actions)
- Use color-coded status badges for visual scanning
- Store status history if audit trail is needed
- Filter completed orders out of active view

>Common Mistakes
- Showing all action buttons regardless of status (confusing UX)
- Not updating localStorage on status change
- Allowing backward status changes without confirmation
- Not filtering completed orders from active view

>HelloStay Usage
Used in `Restaurant.jsx` for order status workflow (Preparing → Ready → Served → Paid) and `Bookings.jsx` for booking status management.

---

## Concept 70: Donut Chart (PieChart with Inner Radius)
>Definition
A circular chart with a hollow center, created using recharts `PieChart` + `Pie` with `innerRadius` and `outerRadius` props.

>Purpose
Display proportional data (like room occupancy distribution) in a compact, visually appealing format. The inner radius creates a donut shape that is more modern and readable than a full pie.

>Syntax Example
```jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

<PieChart>
  <Pie
    data={occupancyData}
    cx="50%"
    cy="50%"
    innerRadius={45}
    outerRadius={75}
    paddingAngle={3}
    dataKey="value"
  >
    {occupancyData.map((entry) => (
      <Cell key={entry.name} fill={entry.color} />
    ))}
  </Pie>
</PieChart>
```

>Industry Practice
- Use donut charts for status distribution (available/occupied/cleaning)
- Add percentage labels outside the chart
- Use `paddingAngle` for visual separation between segments
- Always wrap in `ResponsiveContainer` for layout flexibility

>Common Mistakes
- Using pie chart when bar chart is more appropriate (use pie for parts-of-whole)
- Not handling zero-value segments
- Missing color legend for non-labeled charts

>HelloStay Usage
Used in `Dashboard.jsx` for Room Occupancy Overview showing Available/Occupied/Cleaning/Reserved distribution.

---

## Concept 71: Bidirectional Module Sync via localStorage
>Definition
Two modules (e.g., Bookings and Rooms) read and write to the same localStorage key, keeping their states synchronized through a shared data source.

>Purpose
When a change in Module A (Bookings) should automatically update data in Module B (Rooms), both modules write to the same localStorage key to maintain consistency.

>Syntax Example
```jsx
// In Bookings.jsx — sync room status when booking changes
const syncRoomStatus = (roomId, newRoomStatus) => {
  setRooms(prev => {
    const updated = prev.map(r =>
      r.id === roomId ? { ...r, roomStatus: newRoomStatus } : r
    );
    localStorage.setItem('helloStay_rooms', JSON.stringify(updated));
    return updated;
  });
};

// Usage
syncRoomStatus(booking.roomId, 'Occupied');
```

>Industry Practice
- Use a shared helper function for writes to avoid duplication
- Check for conflicting data before overwriting (e.g., other active bookings)
- Always persist to localStorage AND update React state together
- Document which modules share which localStorage keys

>Common Mistakes
- Only updating localStorage without updating React state (stale UI)
- Forgetting to check related data before overwriting
- Multiple modules independently managing the same localStorage key without coordination

>HelloStay Usage
Used in `Bookings.jsx` ↔ `Rooms.jsx` sync. When booking status changes, room status is automatically updated via `syncRoomStatus()`.

---

## Concept 72: Role-Based UI Control
>Definition
UI elements (buttons, dropdowns, badges) are shown, hidden, or restricted based on the user's role stored in localStorage.

>Purpose
Different user roles (Owner, Manager, Employee) should see different levels of interactivity. Owners can edit everything, employees may only view.

>Syntax Example
```jsx
const userRole = localStorage.getItem('helloStay_userRole') || 'owner';
const canOverrideStatus = userRole === 'owner' || userRole === 'manager';

// Conditional rendering
{canOverrideStatus ? (
  <select onChange={(e) => handleStatusChange(room.id, e.target.value)}>
    <option value="Available">Available</option>
    <option value="Maintenance">Maintenance</option>
  </select>
) : (
  <span className="badge">{room.roomStatus}</span>
)}
```

>Industry Practice
- Always check role at the UI level AND at the data/API level (defense in depth)
- Use a single source of truth for role (localStorage in V1, JWT in V2)
- Restrict both visibility AND interactivity — hiding buttons is not enough if the API accepts unauthorized writes

>Common Mistakes
- Only hiding UI elements without server-side validation
- Storing role in multiple places (causes inconsistency)
- Not refreshing role after login/logout

>HelloStay Usage
Used in `Rooms.jsx` to restrict manual status changes to Owner/Manager only. Employee sees a read-only status badge.

---

## Concept 73: Key-Based Component Remount
>Definition
Passing a `key` prop that changes when the component's initial data changes, forcing React to unmount and remount the component (resetting all internal state).

>Purpose
When a modal needs to display different initial data (e.g., Add vs Edit), using a changing `key` forces a clean remount, ensuring no stale state from the previous mode.

>Syntax Example
```jsx
<AddRoomModal
  key={editingRoom ? `edit-${editingRoom.id}` : 'add'}
  isOpen={isModalOpen}
  editingRoom={editingRoom}
/>
```

>Industry Practice
- Use key-based remount for modals, forms, and edit views
- Include the entity ID in the key to prevent same-ID remount skipping
- Prefer this over manual state reset in useEffect (cleaner, no lint issues)

>Common Mistakes
- Using the same key for add and edit modes (stale form data)
- Not including entity ID in key (multiple edits of different entities show same form)
- Overusing key-based remount when useState initializer is sufficient

>HelloStay Usage
Used in `Rooms.jsx` → `AddRoomModal` to cleanly switch between Add and Edit modes without stale form state.

---

## Concept 74: Cross-Highlight Interaction Pattern
>Definition
Two sibling UI elements (e.g., a chart and a data panel) share a single state variable. Hovering one element highlights the matching element in the other, while dimming non-matching elements. This creates a visual link between related data representations.

>Purpose
When the same data is shown in multiple views (chart + table, chart + list), cross-highlighting helps users understand which data point in one view corresponds to which in the other — without requiring tooltips or popups.

>Syntax Example
```jsx
const [hoveredItem, setHoveredItem] = useState(null);

// Chart segment
<Cell
  fillOpacity={hoveredItem === null || hoveredItem === entry.name ? 1 : 0.3}
  onMouseEnter={() => setHoveredItem(entry.name)}
  onMouseLeave={() => setHoveredItem(null)}
/>

// Panel row
<div
  style={{
    opacity: hoveredItem === null || hoveredItem === entry.name ? 1 : 0.4,
    backgroundColor: hoveredItem && isActive ? `${color}0D` : 'transparent',
  }}
  onMouseEnter={() => setHoveredItem(entry.name)}
  onMouseLeave={() => setHoveredItem(null)}
/>
```

>Industry Practice
- Dashboards often pair a chart with a data table; cross-highlighting reduces cognitive load
- `fillOpacity` (SVG) and CSS `opacity` are the standard mechanisms for dimming
- The "null means nothing hovered" convention (`hoveredItem === null || hoveredItem === match`) ensures full brightness when idle
- Single state variable avoids sync bugs between two separate highlight states

>Common Mistakes
- Using two separate state variables for chart and panel (leads to sync issues)
- Not handling the `null` case (elements stay dimmed when nothing is hovered)
- Using `display: none` or `visibility: hidden` instead of opacity (layout shift)
- Applying heavy animation libraries (Framer Motion) for simple hover dimming

>HelloStay Usage
Used in `Dashboard.jsx` — Room Occupancy Overview. `hoveredStatus` state links the donut chart segments with the status breakdown panel rows. Hovering a chart segment highlights the matching panel row, and vice versa. Uses `fillOpacity` on chart `Cell` and CSS `opacity` + tinted background on panel rows.

---

## Concept 75: Empty State Fallback Pattern
>Definition
When a data-driven component has no data to display, instead of showing a blank or broken UI, render a meaningful fallback message or illustration.

>Purpose
Prevents confusing empty screens. Users understand that data is expected but currently unavailable, rather than assuming the app is broken.

>Syntax Example
```jsx
{data.length > 0 ? (
  <DataVisualization data={data} />
) : (
  <div className="h-44 flex items-center justify-center text-sm text-gray-400">
    No data available
  </div>
)}
```

>Industry Practice
- Always provide empty states for data-driven components
- Use neutral, non-alarming language ("No data available" not "Error!")
- Match the empty state height to the data view to prevent layout shift
- Optionally include a call-to-action ("Add your first room" button)

>Common Mistakes
- Showing a blank space when data is empty (looks like a bug)
- Showing raw `undefined` or `null` text in the UI
- Empty state height drastically different from data state (layout jump)

>HelloStay Usage
Used in `Dashboard.jsx` — Room Occupancy Overview. When `occupancyData.length === 0`, a centered "No room data available" message is shown instead of the donut chart and panel.

---

## Concept 76: Try/Catch JSON Parsing Safety Pattern
>Definition
Wrapping `localStorage.getItem()` + `JSON.parse()` in a try/catch block with fallback defaults to prevent app crashes from corrupt data.

>Purpose
localStorage data can become corrupted or be `null` on first use. Without try/catch, `JSON.parse(null)` throws `SyntaxError` and crashes the component. The try/catch gracefully falls back to an empty array or object.

>Syntax Example
```jsx
const [bookings, setBookings] = useState(() => {
  try {
    const saved = localStorage.getItem('helloStay_bookings');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});
```

>Industry Practice
- Always wrap JSON.parse in try/catch when reading from external storage
- Provide meaningful fallback values (empty array, empty object, default config)
- Use the `catch { }` shorthand (without parameter) when the error doesn't need analysis
- Never assume localStorage data is valid JSON

>Common Mistakes
- Using `JSON.parse()` without try/catch — app crashes silently on corrupt data
- Not providing a fallback — component receives `undefined` for state
- Using `||` operator instead of try/catch — doesn't catch JSON parse errors

>HelloStay Usage
Used in every module that reads from localStorage: `Bookings.jsx` (lines 36-39), `Guests.jsx` (lines 25-28), `Dashboard.jsx`, `Rooms.jsx`, etc.

---

## Concept 77: useCallback Hook
>Definition
A React Hook that returns a memoized version of a callback function that only changes if one of its dependencies changes. Prevents unnecessary re-renders of child components.

>Purpose
When a function is passed as a prop to a child component, React creates a new function reference on every render. `useCallback` preserves the reference between renders unless dependencies change, preventing unnecessary re-renders.

>Syntax Example
```jsx
import { useCallback } from 'react';

const saveBookings = useCallback((updated) => {
  setBookings(updated);
  localStorage.setItem('helloStay_bookings', JSON.stringify(updated));
}, []);  // Empty deps = function never recreates
```

>Industry Practice
- Use `useCallback` for functions passed as props to child components
- Use `useCallback` for functions used in `useEffect` dependencies
- Always list all external variables in the dependency array
- Don't use `useCallback` for every function — only when referential stability matters

>Common Mistakes
- Empty dependency array when the function uses external state — causes stale closures
- Using `useCallback` for every handler — adds unnecessary complexity
- Forgetting to list dependencies — function captures stale values

>HelloStay Usage
Used in `Bookings.jsx` for `saveBookings`, `syncRoomStatus`, `handleBookingCreated`, `handleStatusChange`, `handleDelete` — ensuring stable references for state update functions.

---

## Concept 78: Inline IIFE Pattern in JSX
>Definition
An Immediately Invoked Function Expression (IIFE) used inside JSX curly braces to execute complex logic inline without extracting it to a separate variable.

>Purpose
Sometimes you need to run conditional logic, variable assignment, or complex calculations inside JSX. An IIFE `{(() => { ... })()}` lets you write multi-line logic directly in the render output without creating a separate function.

>Syntax Example
```jsx
{(() => {
  const st = BOOKING_STATUS_STYLES[booking.status] || BOOKING_STATUS_STYLES['Reserved'];
  const StatusIcon = booking.status === 'Reserved' ? Clock
    : booking.status === 'Checked In' ? CheckCircle
    : booking.status === 'Checked Out' ? LogOut
    : XCircle;
  return (
    <span className={`...${st.gradient} ${st.text} ${st.border}`}>
      <StatusIcon className={st.iconColor} />
      {booking.status}
    </span>
  );
})()}
```

>Industry Practice
- Use IIFE for inline conditional rendering with complex logic
- Keep IIFEs small — if logic exceeds 10-15 lines, extract to a separate component
- Always wrap in `{(() => { ... })()}` — note the outer parentheses
- Alternative: Extract to a render function inside the component

>Common Mistakes
- Missing the outer parentheses — JSX treats it as a function declaration, not invocation
- Nesting IIFEs inside IIFEs — unreadable. Extract to component instead
- Forgetting the closing `})()` — syntax error

>HelloStay Usage
Used in `Bookings.jsx` line 433 for rendering the booking status badge with conditional icon and gradient styling.

---

## Concept 79: Gradient Header Pattern in Modals
>Definition
A design pattern where modals and detail views use a gradient background section at the top for visual hierarchy and premium appearance.

>Purpose
Creates a clear visual separation between the modal title/actions area and the content area. The gradient adds a premium, modern feel consistent with the HelloStay design language (AD 59).

>Syntax Example
```jsx
<div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-blue-100 text-sm mt-1">{subtitle}</p>
    </div>
    <button onClick={onClose} className="text-white/70 hover:text-white p-1">
      <X className="w-6 h-6" />
    </button>
  </div>
</div>
```

>Industry Practice
- Use `rounded-t-2xl` on the header to match the modal's `rounded-2xl`
- Use white text on dark gradient for contrast
- Include close button with `text-white/70 hover:text-white` for visibility
- Keep subtitle in a lighter tint (`text-blue-100`) for hierarchy

>Common Mistakes
- Using `rounded-2xl` on header and modal — double rounding creates visible overlap
- Text too dark on gradient background — becomes unreadable
- Missing close button — user can't dismiss without clicking backdrop

>HelloStay Usage
Used in `Bookings.jsx` (View Details modal line 560, BillingModal line 710), `Guests.jsx` (View Guest modal), `Employees.jsx`, and `AddRoomModal.jsx`.

---

## Concept 80: Smart Pagination with Sliding Window
>Definition
A pagination algorithm that displays a maximum number of page buttons (e.g., 5) and uses a sliding window that adjusts based on the current page position.

>Purpose
When there are many pages (e.g., 50), showing all 50 buttons is visually overwhelming. Smart pagination shows only 5 buttons at a time, sliding the window as the user navigates.

>Syntax Example
```jsx
{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
  let page;
  if (totalPages <= 5) page = i + 1;                           // All pages visible
  else if (currentPage <= 3) page = i + 1;                     // Start window
  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i; // End window
  else page = currentPage - 2 + i;                              // Middle window
  return (
    <button key={page} onClick={() => setCurrentPage(page)}
      className={currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}>
      {page}
    </button>
  );
})}
```

>Industry Practice
- Always show max 5-7 page buttons for usability
- Use sliding window: start (1-5), middle (current-2 to current+2), end (total-4 to total)
- Highlight active page with contrasting color
- Include Previous/Next buttons with disabled state at boundaries
- Show "Showing X to Y of Z" text for context

>Common Mistakes
- Showing all pages — overwhelming when there are 50+ pages
- Not handling edge cases (first page, last page, under 5 pages)
- Missing disabled state on Previous/Next — user clicks nothing happens
- Off-by-one errors in window calculation — page 1 shows wrong numbers

>HelloStay Usage
Used in `Bookings.jsx` lines 505-520, `Rooms.jsx`, `Guests.jsx`, and all modules with paginated tables.

---

## Concept 81: Static Data Constants Outside Components
>Definition
Defining static data (status options, color maps, configuration arrays, payment types) as module-level constants outside the component function rather than inside it.

>Purpose
- Prevents redefinition on every render
- Keeps JSX clean and focused on logic
- Centralizes configuration for easy updates
- Enables reuse across multiple functions within the file
- Makes the code self-documenting

>Syntax Example
```jsx
// Module-level constants (NOT inside component)
const PAYMENT_STYLES = {
  'Pending': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Paid': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Refunded': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

const BOOKING_STATUS_STYLES = {
  'Reserved': { gradient: 'from-blue-50 to-indigo-50', text: 'text-blue-700' },
  'Checked In': { gradient: 'from-emerald-50 to-green-50', text: 'text-emerald-700' },
};

const ITEMS_PER_PAGE = 8;

export default function Bookings() {
  // Component logic uses PAYMENT_STYLES, BOOKING_STATUS_STYLES directly
}
```

>Industry Practice
- Define all static maps, arrays, and config values outside the component
- Use `const` for values that never change
- Use `UPPER_SNAKE_CASE` or `PascalCase` for constant names to distinguish from state
- Place constants between imports and the component definition

>Common Mistakes
- Defining constants inside the component — recreated on every render, causing unnecessary memory allocation
- Hardcoding values in JSX — scattered, hard to update, error-prone
- Using `let` instead of `const` for truly constant values

>HelloStay Usage
Used in every module file: `Bookings.jsx` (PAYMENT_STYLES, BOOKING_STATUS_STYLES, STATUS_CARDS), `Dashboard.jsx` (OCCUPANCY_COLORS), `Reports.jsx` (REPORT_TYPES, CHART_COLORS), `Guests.jsx` (ID_PROOF_TYPES, INITIAL_GUEST).

---

## Concept 82: Vite Dev Server Proxy
>Definition
A Vite configuration that forwards requests from the frontend dev server to the backend API server, bypassing CORS during development.

>Purpose
When the frontend (localhost:5173) and backend (localhost:8000) run on different ports, browsers block cross-origin requests. The Vite proxy intercepts `/api/*` requests and forwards them to the backend, making them appear same-origin.

>Syntax Example
```jsx
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

>Request Flow:
```
Browser → /api/rooms → Vite Proxy → http://127.0.0.1:8000/rooms
```

>Industry Practice
- Proxy is for development only — production uses a reverse proxy (Nginx) or same-origin deployment
- The `rewrite` option strips the `/api` prefix so the backend receives clean URLs
- `changeOrigin: true` is required for proper host header forwarding

>Common Mistakes
- Forgetting `rewrite` — backend receives `/api/rooms` instead of `/rooms`
- Relying on proxy in production — use CORS middleware on the backend instead
- Not restarting Vite after config changes — proxy changes don't hot-reload

>HelloStay Usage
Configured in `frontend/vite.config.js`. All frontend API calls go through the proxy during development. The backend also has CORSMiddleware as a fallback for production or direct access.

---

## Concept 83: Blob Download Pattern (Data Export)
>Definition
A pattern for triggering file downloads in the browser by creating a Blob from data, generating an object URL, creating a temporary anchor element, and programmatically clicking it.

>Purpose
To allow users to download application data as a JSON file without needing a backend endpoint. This enables offline backups and data portability.

>Syntax Example
```jsx
const handleExport = () => {
  const data = {
    rooms: JSON.parse(localStorage.getItem('helloStay_rooms') || '[]'),
    bookings: JSON.parse(localStorage.getItem('helloStay_bookings') || '[]'),
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);  // Clean up memory
};
```

>Industry Practice
- Always call `URL.revokeObjectURL()` after download to prevent memory leaks
- Use `JSON.stringify(data, null, 2)` for pretty-printed, human-readable output
- Include timestamp and data source in the filename
- Wrap in try/catch for robustness

>Common Mistakes
- Forgetting `URL.revokeObjectURL()` — memory leak in long-running apps
- Not including `null, 2` in stringify — file is one unreadable line
- Setting wrong `type` — browser may not recognize the file as JSON

>HelloStay Usage
Used in `Settings.jsx` for the Export Data feature. Exports all `helloStay_*` localStorage keys as a single timestamped JSON file.

---

## Concept 84: FileReader Import Pattern (Data Import)
>Definition
A pattern for reading uploaded files using the browser's FileReader API, parsing the content, and restoring application state.

>Purpose
To restore previously exported data by reading a JSON file, validating its structure, and writing each key back to localStorage.

>Syntax Example
```jsx
const handleImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'exportDate') {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      window.location.reload();
    } catch {
      alert('Invalid backup file');
    }
  };
  reader.readAsText(file);
};

// Hidden file input triggered by button
<input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
```

>Industry Practice
- Validate JSON structure before importing — catch parse errors with try/catch
- Skip metadata keys (exportDate, version) when restoring data
- Reload the page after import to refresh all component state from localStorage
- Use `accept=".json"` on the file input for UX

>Common Mistakes
- Not validating JSON — app crashes on corrupt files
- Importing without reloading — stale React state still shows old data
- Not resetting the file input value — importing the same file twice doesn't trigger onChange

>HelloStay Usage
Used in `Settings.jsx` for the Import Data feature. Restores all localStorage keys from a previously exported JSON backup file.

---

## Concept 85: Health Check Endpoint Pattern
>Definition
A simple root endpoint (`GET /`) that returns application metadata to verify the backend server is running and accessible.

>Purpose
Provides a quick way to check backend availability, display version info, and serve as a minimal test endpoint for frontend-backend connectivity.

>Syntax Example
```python
@app.get("/", tags=["Health Check"])
def root():
    return {
        "application": "HelloStay",
        "version": "1.0.0",
        "message": "Backend server is running successfully"
    }
```

>Industry Practice
- Keep health check endpoints lightweight and fast (no database queries)
- Include version and application name for CI/CD pipeline verification
- Tag with "Health Check" for Swagger documentation grouping
- Return HTTP 200 when healthy, 503 when degraded

>Common Mistakes
- Making health check too heavy (querying database) — defeats purpose of quick check
- Not tagging in Swagger — mixed with business endpoints
- Returning sensitive information (server paths, environment vars)

>HelloStay Usage
Used in `backend/app/main.py` line 27. Accessed at `http://127.0.0.1:8000/`. Returns app name, version, and status message. Tagged for Swagger documentation.

---

## Array-Based Permissions Control (RBAC)
>Definition
A Role-Based Access Control (RBAC) strategy where a user's access rights are defined by an array of string permissions (e.g., `['Bookings', 'Rooms', 'Settings']`) rather than a single string role (e.g., `'Manager'`).

>Purpose
To allow granular access control for different employee types. A single "Manager" string role is rigid, whereas permission arrays allow custom roles (like a receptionist who can only see Bookings, or an accountant who can only see Expenses and Reports).

>Syntax Example
```jsx
// AppRoutes.jsx - Protecting a route using the permissions array
const ProtectedRoute = ({ children, requiredPermission }) => {
  const sessionData = localStorage.getItem('helloStay_session');
  if (!sessionData) return <Navigate to="/login" replace />;
  
  const session = JSON.parse(sessionData);
  
  // Owners bypass all permission checks
  if (session.role === 'Owner') return children;
  
  // Check if the user's permission array includes the required module
  if (requiredPermission && !session.permissions?.includes(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};
```

>Industry Practice
- Store permissions as an array of strings in the database or JWT payload.
- Always include an implicit bypass for `Admin` or `Owner` roles so they don't explicitly need every string in their array.
- Use the exact same permission strings for both routing guards (`ProtectedRoute`) and UI visibility (hiding Sidebar links).

>Common Mistakes
- Using simple strings instead of arrays for permissions, leading to combinatoric explosions of roles (e.g., `ReceptionistAndAccountant`).
- Forgetting to hide the UI element (Sidebar link) even if the Route itself is protected, leading to a frustrating user experience where they click a visible link and get redirected.

>HelloStay Usage
Implemented during AD 88. Used in `AppRoutes.jsx` to guard modules and `Sidebar.jsx` to dynamically render navigation items based on the active user's `permissions` array stored in `localStorage`.

---

## Targeted Authentication Modal (OwnerAuthModal)
>Definition
A security pattern where destructive or highly privileged actions (like deleting the hotel or modifying another administrator's profile) trigger an inline authentication modal asking for the password, rather than executing immediately.

>Purpose
To prevent unauthorized users from performing critical actions if an administrator walks away from an unlocked terminal. It acts as a "sudo" prompt.

>Syntax Example
```jsx
// OwnerAuthModal.jsx handling specific targeting
let validOwners;
if (targetOwnerId) {
  // Must authenticate as the SPECIFIC owner being modified
  validOwners = accounts.filter(a => a.id === targetOwnerId && a.role === 'Owner');
} else {
  // Can authenticate as ANY owner
  validOwners = accounts.filter(a => a.role === 'Owner');
}
```

>Industry Practice
- Common in financial apps, billing settings, or when deleting workspaces.
- The modal should completely block the UI (`z-50`, `fixed inset-0`).
- Validate the credential immediately without logging the user out.

>HelloStay Usage
Used in `HotelInfo.jsx` (before editing/deleting hotel properties) and `ProfileEditModal.jsx` (before editing/deleting another Owner). When an Owner edits an Employee, the prompt is skipped for UX fluidity, but modifying another Owner enforces the prompt for strict security.

---

## Concept 86: Centralized Data Store Pattern

>Definition
A pattern where all cross-module data operations (read, write, delete) are routed through a single utility module (`dataStore.js`) rather than being performed directly in component files. The data store acts as the single source of truth for localStorage access.

>Purpose
- Prevent data inconsistency when multiple modules operate on the same entity (e.g., Bookings and Rooms both modify room status).
- Provide a clear API surface for data operations — components don't need to know localStorage key names or JSON parse/serialize logic.
- Enable cross-module synchronization via custom events (`triggerSync` / `SYNC_EVENT`).
- Encapsulate business logic (e.g., `createBookingWithGuest` handles both booking creation and guest linking) in one place.

>Syntax Example
```javascript
// dataStore.js — centralized exports
export function getRooms() {
  return JSON.parse(localStorage.getItem('helloStay_rooms') || '[]');
}

export function saveRooms(rooms, silent = false) {
  localStorage.setItem('helloStay_rooms', JSON.stringify(rooms));
  if (!silent) triggerSync();
}

// Components use dataStore, never localStorage directly
import { getRooms, saveRooms, triggerSync, SYNC_EVENT } from '../utils/dataStore';
const [rooms, setRooms] = useState(() => getRooms());
```

>Industry Practice
- Centralize all localStorage key references in one file to avoid key name typos.
- Use a `silent` parameter for bulk operations to avoid excessive sync events.
- Export a `SYNC_EVENT` constant so all modules listen for the same event.
- Always provide `get*()` functions for lazy state initialization (pass to `useState` as initializer).

>Common Mistakes
- Modules still writing directly to localStorage — bypasses sync and causes stale state in other components.
- Forgetting to call `triggerSync()` after write operations — other modules don't refresh.
- Not handling the `silent` parameter — bulk operations cause cascade of sync events.
- Importing dataStore functions but still accessing localStorage directly for some operations.

>HelloStay Usage
Used in `dataStore.js`. All page components (`Rooms.jsx`, `Bookings.jsx`, `Guests.jsx`) import and use dataStore functions exclusively. The `SYNC_EVENT` ensures all open modules refresh when data changes.

---

## Concept 87: GuestId Referential Integrity + Legacy Fallback

>Definition
A data matching strategy where Bookings store a `guestId` field pointing to a Guest profile, and the Guests module uses this direct ID to match bookings. A legacy fallback matches by exact `guestName + guestPhone` for bookings created before the guestId system.

>Purpose
- Eliminate unreliable name-based matching that breaks when guest names are edited or duplicated.
- Guarantee that a guest's stay history, total spent, and activity feed are always correct.
- Support backwards compatibility with pre-migration bookings that lack guestId.

>Syntax Example
```javascript
// Strict guestId matching with legacy fallback
const getGuestStayHistory = (guest) => {
  return bookings.filter(b => {
    if (b.guestId === guest.id) return true;                    // direct match
    if (b.guests?.some(g => g.guestId === guest.id)) return true; // multi-guest booking
    // Legacy fallback: exact name+phone match
    if (!b.guestId && b.guestName === guest.name && b.guestPhone === guest.phone) return true;
    return false;
  });
};
```

>Industry Practice
- Always store a foreign key (guestId) when creating new records — never rely on name matching.
- For legacy data, prefer exact field-by-field matching over fuzzy matching to avoid false positives.
- Run a one-time migration script at startup to backfill guestId on legacy records.
- After migration phase, the fallback can be removed entirely.

>Common Mistakes
- Using `includes()` or case-insensitive matching for legacy fallback — matches wrong guests.
- Not handling multi-guest bookings (guests array) — misses secondary guests' history.
- Forgetting to update the legacy fallback when guest profile is edited — history disappears.
- Only matching on `guestId` without fallback — pre-migration bookings show "No stays".

>HelloStay Usage
Used in `Guests.jsx` for `getGuestStayHistory()`, `stayStats`, and `spentStats` memos. The legacy fallback matches on exact `guestName === guest.name && guestPhone === guest.phone`. `dataStore.js` has `migrateLegacyBookings()` that runs once on startup to backfill guestId.

---

## Concept 88: Guarded State Transitions

>Definition
A pattern where state changes are validated against business rules and current system state before being applied. Invalid transitions are blocked with user-facing messages explaining why.

>Purpose
- Enforce business logic at the UI level (e.g., cannot manually set a room to Available if it has an active booking).
- Prevent data corruption from invalid state combinations.
- Provide clear feedback to users when an action is not allowed.
- Support override mechanisms (e.g., Force Available) for authorized users.

>Syntax Example
```javascript
const handleStatusChange = (roomId, newStatus) => {
  const room = rooms.find(r => r.id === roomId);
  const activeBooking = bookings.find(b =>
    b.roomId === roomId && (b.status === 'Reserved' || b.status === 'Checked In')
  );

  if (activeBooking && (newStatus === 'Occupied' || newStatus === 'Reserved')) {
    setStatusMessage('Room status is managed by active bookings');
    return;
  }

  if (newStatus === 'Available' && activeBooking) {
    if (currentUserRole !== 'Owner') {
      setStatusMessage('Only Owner can override active booking status');
      return;
    }
    setShowForceConfirm(roomId); // Require confirmation
    return;
  }

  // Valid transition — proceed
  const updated = rooms.map(r => r.id === roomId ? { ...r, roomStatus: newStatus } : r);
  saveRooms(updated);
};
```

>Industry Practice
- Define allowed transitions in a state machine (e.g., Reserved→Occupied→Cleaning→Available).
- Check for active business constraints (bookings, check-ins) before allowing manual overrides.
- Use role checks for sensitive operations (e.g., Owner-only force override).
- Show clear status messages instead of silently failing.

>Common Mistakes
- Blocking all manual changes — some transitions (Available→Maintenance) should always be allowed.
- Not differentiating between booking-driven and manual statuses — Occupied should only come from check-in.
- Allowing forced overrides without confirmation — accidental data loss.
- Not checking for future bookings — a room with future reservation should not be set to Maintenance.

>HelloStay Usage
Used in `Rooms.jsx` `handleStatusChange()`. Blocks manual Occupied/Reserved if no active booking. Blocks manual Available if active booking exists (unless Owner uses Force Available with confirmation dialog). Only Available→Maintenance/Cleaning are freely allowed.

---

## Concept 89: Unified Activity Feed with Timeline Visualization

>Definition
A chronological timeline combining events from multiple data sources (booking lifecycle, profile changes) into a single feed. Each event has a type-specific icon, color, description, and timestamp, rendered with a vertical connecting line.

>Purpose
- Provide a complete history of a guest's interactions with the hotel in one view.
- Combine scattered data (booking events from bookings[] + profile events from guest record) into a unified story.
- Enable staff to quickly understand what happened and when without switching between tabs.

>Syntax Example
```javascript
// dataStore.js — getGuestActivity
export function getGuestActivity(guestId) {
  const bookings = getBookings();
  const activities = [];

  // Collect booking events
  bookings.forEach(b => {
    if (b.guestId !== guestId) return;
    activities.push({ type: 'booking_created', description: `Booked Room ${b.roomNumber}`, timestamp: b.createdAt });
    if (b.status === 'Checked In') activities.push({ type: 'check_in', description: `Checked into Room ${b.roomNumber}`, timestamp: b.checkInTime });
    if (b.status === 'Checked Out' || b.status === 'Checked Out') activities.push({ type: 'check_out', description: `Checked out of Room ${b.roomNumber}`, timestamp: b.checkOutTime });
  });

  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
```

>Industry Practice
- Merge events from multiple sources and sort by timestamp descending.
- Use a small, fixed set of event types (6-8 max) for visual consistency.
- Map each type to a specific icon and color for instant recognition.
- Show newest events first (reverse chronological).
- Use a vertical connecting line between items for the timeline look.

>Common Mistakes
- Not deduplicating events from overlapping sources.
- Using too many event types — overwhelms the user.
- Forgetting to sort — events appear in arbitrary order.
- Not using a connecting line — looks like a flat list, not a timeline.
- Not handling empty state — blank tab with no feedback.

>HelloStay Usage
Used in `Guests.jsx` "All Activity" tab. `getGuestActivity(guest.id)` in dataStore merges booking events (created, checked in, checked out, cancelled) with guest profile events (created, updated). Rendered with Lucide icons (BedDouble, LogIn, LogOut, XCircle, Edit3, User) and corresponding colors.
