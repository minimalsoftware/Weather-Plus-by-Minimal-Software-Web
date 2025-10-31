<script>
  import { onMount } from 'svelte';
  
  // Import components
  import Sidebar from './lib/components/Sidebar.svelte';
  import MainContent from './lib/components/MainContent.svelte';
  import MapView from './lib/components/MapView.svelte';
  import SettingsModal from './lib/components/modals/SettingsModal.svelte';
  import WelcomeModal from './lib/components/modals/WelcomeModal.svelte';
  import PrecipitationModal from './lib/components/modals/PrecipitationModal.svelte';
  import AirQualityModal from './lib/components/modals/AirQualityModal.svelte';
  import WindModal from './lib/components/modals/WindModal.svelte';
  import UVIndexModal from './lib/components/modals/UVIndexModal.svelte';
  import AstronomyModal from './lib/components/modals/AstronomyModal.svelte';
  
  // Import stores
  import { settings } from './lib/stores/settings.js';
  import { theme } from './lib/stores/theme.js';
  import { modals } from './lib/stores/modals.js';
  
  // State variables
  let showOverlay = $state(false);
  let sidebarOpen = $state(true);
  
  let currentSettings = $state({});
  let modalStates = $state({});
  
  settings.subscribe(s => {
    currentSettings = s;
  });
  
  modals.subscribe(m => {
    modalStates = m;
    showOverlay = Object.values(m).some(v => v);
  });
  
  onMount(() => {
    // Initialize the app
    console.log('Weather+ by Minimal Software - Svelte 5');
    
    // Initialize theme
    theme.toggle(currentSettings.theme || 'auto');
    
    // Show welcome page if first time
    if (!currentSettings.firstConfigurationShown) {
      modals.open('welcome');
    }
  });
</script>

<div class="page no-user-select">
  {#if showOverlay}
    <div class="overlay overlay--active" onclick={() => {
      Object.keys(modalStates).forEach(key => modals.close(key));
    }}></div>
  {/if}
  
  <MapView open={modalStates.map} />
  <SettingsModal open={modalStates.settings} />
  <WelcomeModal open={modalStates.welcome} />
  <PrecipitationModal open={modalStates.precipitation} />
  <AirQualityModal open={modalStates.airQuality} />
  <WindModal open={modalStates.wind} />
  <UVIndexModal open={modalStates.uvIndex} />
  <AstronomyModal open={modalStates.astronomy} />
  
  <Sidebar bind:open={sidebarOpen} />
  <MainContent bind:sidebarOpen />
</div>
