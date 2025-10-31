<script>
  import { onMount } from 'svelte';
  
  // Import components (to be created)
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
  
  // State variables
  let showOverlay = $state(false);
  let sidebarOpen = $state(false);
  let mapOpen = $state(false);
  
  onMount(() => {
    // Initialize the app
    console.log('Weather+ by Minimal Software - Svelte 5');
  });
</script>

<div class="page no-user-select">
  {#if showOverlay}
    <div class="overlay"></div>
  {/if}
  
  <MapView bind:open={mapOpen} />
  <SettingsModal />
  <WelcomeModal />
  <PrecipitationModal />
  <AirQualityModal />
  <WindModal />
  <UVIndexModal />
  <AstronomyModal />
  
  <Sidebar bind:open={sidebarOpen} />
  <MainContent bind:sidebarOpen />
</div>
