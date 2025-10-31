<script>
  let { open = $bindable(false) } = $props();
</script>

{#if open}
<div class="map">
  <div class="map__layer-switcher segmented-button">
    <button class="segmented-button__item segmented-button__item--selected">Standard</button>
  </div>
  <div class="map__zoom-controls" id="map__zoom-controls">
    <button class="map__zoom-in">
      <img class="icon--main-color" src="/graphics/svg/add-main-color.svg" alt="Zoom in">
    </button>
    <button class="map__zoom-out">
      <img class="icon--main-color" src="/graphics/svg/remove-main-color.svg" alt="Zoom out">
    </button>
  </div>
  <button class="map__close-button" onclick={() => open = false}>
    <img class="icon--main-color" src="/graphics/svg/close-main-color.svg" alt="Close">
    <span>Close</span>
  </button>
  <div class="map__selected-location">
    <div class="title">Click on the map to select location</div>
    <div class="name"></div>
    <div class="coordinates">
      <div class="lat"></div>
      <div class="lon"></div>
    </div>
    <button class="select-location-btn">Select</button>
  </div>
  <div class="osm" id="osm"></div>
</div>
{/if}
