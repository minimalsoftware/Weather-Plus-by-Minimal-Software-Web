<script>
  let { sidebarOpen = $bindable(false) } = $props();
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="main-content">
  <div class="notification"></div>
  <div class="top-bar">
    <button class="top-bar__button" title="Toggle sidebar" onclick={toggleSidebar}>
      <img class="icon--main-color" src="/graphics/svg/menu-open-main-color.svg" alt="Toggle sidebar">
    </button>
    <div class="top-bar__section">
      <button class="top-bar__button" id="top-bar__button--share" title="Share link to current location">
        <img class="icon--main-color" src="/graphics/svg/link-main-color.svg" alt="Share link">
      </button>
      <button class="top-bar__button" title="Refresh weather data for current location">
        <img class="icon--main-color" src="/graphics/svg/refresh-main-color.svg" alt="Refresh">
        <span>Refresh</span>
      </button>
    </div>
  </div>
  
  <div class="no-locations">
    <img class="icon--main-color" src="/graphics/svg/location-off-main-color.svg" alt="No locations">
    <p>Add an initial location to see the weather</p>
  </div>
  
  <div class="weather-page">
    <div class="current-weather">
      <div class="current-weather__location"></div>
      <div class="current-weather__temperature"></div>
      <div class="current-weather__weather-condition"></div>
      <div class="current-weather__max-min-temperature">
        <img class="icon--gray" src="/graphics/svg/north-gray.svg" alt="Max">
        <span class="max-temperature"></span>
        <img class="icon--gray" src="/graphics/svg/south-gray.svg" alt="Min">
        <span class="min-temperature"></span>
      </div>
    </div>
    <div class="weather-data-fetch-time">Weather data last updated at: <span></span>.</div>
    <div class="weather-page__container">
      <!-- Weather components will go here -->
    </div>
    <div class="weather-data-provider">
      <p>Forecast data provided by&nbsp;<a href="https://open-meteo.com/">Open-Meteo</a>&nbsp;•&nbsp;<a href="https://1drv.ms/w/c/98907bf91a84c77f/Ea0BVJJnH8FEjnEWHYb-CQMB4BzUgBW2XT3-gF4cHExNGQ?e=J2OYml">Privacy policy</a>&nbsp;•&nbsp;Version 2025.1&nbsp;•&nbsp;<a href="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAABAtYydUMjlFUUxaU0VVMUVGRDFKSEdTWTgwOThTTi4u">Report an issue</a></p>
    </div>
  </div>
</div>
