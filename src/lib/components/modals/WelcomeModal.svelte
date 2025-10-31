<script>
  let { open = false } = $props();
  import { modals } from '../../stores/modals.js';
  import { settings } from '../../stores/settings.js';
  
  let currentSettings = $state({});
  
  settings.subscribe(s => {
    currentSettings = s;
  });
  
  function hideWelcome() {
    settings.update(s => {
      s.firstConfigurationShown = true;
      localStorage.setItem("settings", JSON.stringify(s));
      return s;
    });
    modals.close('welcome');
  }
</script>

{#if open}
<div class="welcome modal modal--with-subpages welcome--active" id="modal--welcome">
  <div class="modal-subpage modal-subpage--active">
    <div class="welcome__header">
      <h1>Welcome to</h1>
      <h1 class="main-color">Weather+</h1>
      <h5>by Minimal Software</h5>
      <p>Weather app, wrapped in a minimalist design, with constantly updated weather data.</p>
    </div>
    <div class="welcome__content">
      <div class="welcome-points">
        <div class="welcome-point">
          <div class="welcome-point__icon">
            <img class="icon--gray" src="/graphics/svg/weather-mix-black.svg" alt="Welcome point nr. 1">
          </div>
          <div class="welcome-point__section">
            <div class="welcome-point__title">Weather forecast for 14 days.</div>
            <div class="welcome-point__description">See weather conditions and all the most necessary weather data.</div>
          </div>
        </div>
        <div class="welcome-point">
          <div class="welcome-point__icon">
            <img class="icon--gray" src="/graphics/svg/routine-black.svg" alt="Welcome point nr. 2">
          </div>
          <div class="welcome-point__section">
            <div class="welcome-point__title">Sunrise and sunset</div>
            <div class="welcome-point__description">Sunrise and sunset times, graphic designation.</div>
          </div>
        </div>
        <div class="welcome-point">
          <div class="welcome-point__icon">
            <img class="icon--gray" src="/graphics/svg/air-black.svg" alt="Welcome point nr. 3">
          </div>
          <div class="welcome-point__section">
            <div class="welcome-point__title">Air quality</div>
            <div class="welcome-point__description">AQI air quality index based on measurements of air pollution indicators.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="welcome__footer">
      <button class="welcome__button" onclick={hideWelcome}>Select initial location</button>
    </div>
  </div>
</div>
{/if}
