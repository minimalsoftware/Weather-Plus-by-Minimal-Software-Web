<script>
  let { open = $bindable(false) } = $props();
  
  import { settings } from '../stores/settings.js';
  import { modals } from '../stores/modals.js';
  import { onMount } from 'svelte';
  
  let locationsData = $state([]);
  
  onMount(() => {
    settings.subscribe(s => {
      locationsData = s.locations || [];
    });
  });
  
  function toggleSidebar() {
    open = !open;
  }
</script>

<div class="sidebar" class:sidebar--open={open}>
  <div class="sidebar__container">
    <div class="sidebar__header">
      <div class="logo">
        <span class="logo__title">Weather+</span>
        <br>
        <span class="logo__company">by Minimal Software</span>
      </div>
      <button class="sidebar__toggle-button" onclick={toggleSidebar}>
        <img class="icon--main-color" src="/graphics/svg/menu-open-main-color.svg" alt="Close">
      </button>
    </div>
    
    <div class="autocomplete">
      <div class="location-search-bar-container">
        <div class="location-search-bar">
          <img class="search-bar__icon icon--gray" src="/graphics/svg/search--gray.svg" alt="Search">
          <label>
            <input type="text" class="location-search" placeholder="Search for location">
          </label>
          <img class="search-bar__cancel-icon icon--gray" src="/graphics/svg/cancel-black.svg" alt="Clear">
        </div>
      </div>
      <div class="autocomplete-results"></div>
    </div>
    
    <div class="sidebar-buttons">
      <button class="sidebar-buttons__item" onclick={() => modals.open('map')}>
        <img class="icon--main-color" src="/graphics/svg/map-main-color.svg" alt="Map">
        <span>Find on a map</span>
      </button>
      <button class="sidebar-buttons__item" onclick={() => modals.open('settings')}>
        <img class="icon--main-color" src="/graphics/svg/settings-main-color.svg" alt="Settings">
        <span>Settings</span>
      </button>
      <button class="sidebar-buttons__item edit-locations-btn">
        <img class="icon--main-color" src="/graphics/svg/edit-main-color.svg" alt="Edit">
        <span>Edit locations</span>
      </button>
    </div>
    
    <div class="locations-container"></div>
  </div>
</div>
