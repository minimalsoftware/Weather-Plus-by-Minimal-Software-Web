# Weather+ by Minimal Software - Svelte 5 Edition

This is a refactored version of Weather+ using **Svelte 5** instead of pure HTML and vanilla JavaScript.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000` (or another port if 3000 is occupied).

### Build for Production

```bash
# Create production build
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## 📁 Project Structure

```
src/
├── App.svelte                 # Main application component
├── main.js                    # Application entry point
├── lib/
│   ├── components/           # Svelte components
│   │   ├── Sidebar.svelte
│   │   ├── MainContent.svelte
│   │   ├── MapView.svelte
│   │   └── modals/          # Modal components
│   │       ├── SettingsModal.svelte
│   │       ├── WelcomeModal.svelte
│   │       ├── PrecipitationModal.svelte
│   │       ├── AirQualityModal.svelte
│   │       ├── WindModal.svelte
│   │       ├── UVIndexModal.svelte
│   │       └── AstronomyModal.svelte
│   ├── stores/              # Svelte stores for state management
│   │   ├── settings.js      # User settings (theme, units, etc.)
│   │   ├── theme.js         # Theme management
│   │   └── modals.js        # Modal visibility state
│   ├── scripts/             # Business logic (migrated from original)
│   ├── assets/              # Static assets
│   └── libraries/           # Third-party libraries
└── styles/                  # Global CSS styles
```

## 🔧 Key Features

### Svelte 5 Runes
This project uses Svelte 5's new runes syntax:
- `$state` - For reactive state
- `$derived` - For computed values
- `$props` - For component props
- `$bindable` - For two-way binding

### State Management
The application uses Svelte stores for global state:
- **Settings Store**: Manages user preferences (temperature units, wind units, theme, etc.)
- **Theme Store**: Handles light/dark/auto theme switching
- **Modal Store**: Controls visibility of all modal dialogs

### Reactive Architecture
All UI updates are handled reactively using Svelte's built-in reactivity system, eliminating the need for manual DOM manipulation.

## 🎨 Styling

The application maintains the original minimalist design with all CSS preserved in the `src/styles/` directory:
- `main.css` - Core styles and CSS variables
- `sidebar.css` - Sidebar component styles
- `modal.css` - Modal dialog styles
- `weather-page.css` - Weather display styles
- `map.css` - Map component styles
- `settings.css` - Settings modal styles
- `locations.css` - Location list styles
- `rwd/mobile.css` - Responsive design for mobile devices

## 🌐 Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📦 Dependencies

### Production
- `chart.js` - Weather charts
- `leaflet` - Interactive maps
- `sortablejs` - Drag-and-drop location sorting
- `tippy.js` - Tooltips

### Development
- `svelte` (v5.x) - UI framework
- `vite` - Build tool and dev server
- `@sveltejs/vite-plugin-svelte` - Svelte plugin for Vite

## 🔄 Migration from HTML Version

The key changes from the original HTML version:

1. **Component-based architecture**: UI is split into reusable Svelte components
2. **Reactive state management**: Global state is managed with Svelte stores
3. **Modern JavaScript**: Uses ES modules and modern syntax
4. **Build system**: Vite provides fast HMR and optimized production builds
5. **Type safety**: Better IDE support and autocomplete
6. **Improved maintainability**: Cleaner separation of concerns

## 🛠️ Development

### Adding New Components

```svelte
<script>
  import { settings } from '../stores/settings.js';
  
  let count = $state(0);
  
  function increment() {
    count++;
  }
</script>

<button onclick={increment}>
  Count: {count}
</button>
```

### Using Stores

```javascript
import { settings } from './stores/settings.js';

// Subscribe to store
settings.subscribe(value => {
  console.log('Settings changed:', value);
});

// Update store
settings.updateTemperatureUnit(temperatureUnits.CELSIUS);
```

## 📝 License

Same as the original Weather+ by Minimal Software project.

## 🙏 Credits

- Original Weather+ application by Minimal Software
- Refactored to Svelte 5 architecture
- Weather data: Open-Meteo
- Maps: OpenStreetMap
