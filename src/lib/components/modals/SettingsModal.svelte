<script>
  import { settings, temperatureUnits, windUnits, pressureUnits } from '../../stores/settings.js';
  import { theme, themes } from '../../stores/theme.js';
  import { modals } from '../../stores/modals.js';
  
  let { open = false } = $props();
  let currentSettings = $state({});
  
  settings.subscribe(s => {
    currentSettings = s;
  });
</script>

{#if open}
<div class="settings modal modal--active" id="modal--settings">
  <div class="modal__header">
    <div class="title">Settings</div>
    <button class="close-button" onclick={() => modals.close('settings')}>
      <img class="icon--main-color" src="/graphics/svg/close-main-color.svg" alt="Close">
    </button>
  </div>
  <div class="modal__content">
    <div class="settings__label">General</div>
    <div class="settings-item">
      <div class="settings-item__title">Appearance</div>
      <div class="settings-item__content">
        <div class="segmented-button" id="segmented-button--theme">
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.theme === themes.LIGHT}
            onclick={() => theme.toggle(themes.LIGHT)}
          >Light</button>
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.theme === themes.DARK}
            onclick={() => theme.toggle(themes.DARK)}
          >Dark</button>
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.theme === themes.AUTO}
            onclick={() => theme.toggle(themes.AUTO)}
          >Follow system</button>
        </div>
      </div>
    </div>
    <div class="settings-item" id="settings-item--lock-weather-page-layout">
      <div class="settings-item__title">Lock weather page layout</div>
      <div class="settings-item__content">
        <label class="switch">
          <input 
            type="checkbox" 
            id="switch-weather-page-layout-lock" 
            checked={currentSettings.weatherPageLayoutLocked}
            onchange={() => settings.toggleLayoutLock()}
          >
          <span class="slider"></span>
        </label>
      </div>
    </div>
    <div class="settings__label">Units</div>
    <div class="settings-item">
      <div class="settings-item__title">Temperature unit</div>
      <div class="settings-item__content">
        <div class="segmented-button" id="segmented-button--temperature">
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.temperatureUnit?.value === temperatureUnits.CELSIUS.value}
            onclick={() => settings.updateTemperatureUnit(temperatureUnits.CELSIUS)}
          >°C</button>
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.temperatureUnit?.value === temperatureUnits.FAHRENHEIT.value}
            onclick={() => settings.updateTemperatureUnit(temperatureUnits.FAHRENHEIT)}
          >°F</button>
        </div>
      </div>
    </div>
    <div class="settings-item">
      <div class="settings-item__title">Wind speed unit</div>
      <div class="settings-item__content">
        <div class="segmented-button" id="segmented-button--wind">
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.windUnit?.value === windUnits.KPH.value}
            onclick={() => settings.updateWindUnit(windUnits.KPH)}
          >km/h</button>
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.windUnit?.value === windUnits.MPH.value}
            onclick={() => settings.updateWindUnit(windUnits.MPH)}
          >mph</button>
        </div>
      </div>
    </div>
    <div class="settings-item">
      <div class="settings-item__title">Pressure unit</div>
      <div class="settings-item__content">
        <div class="segmented-button" id="segmented-button--pressure">
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.pressureUnit?.value === pressureUnits.HPA.value}
            onclick={() => settings.updatePressureUnit(pressureUnits.HPA)}
          >hPa</button>
          <button 
            class="segmented-button__item" 
            class:segmented-button__item--selected={currentSettings.pressureUnit?.value === pressureUnits.MBAR.value}
            onclick={() => settings.updatePressureUnit(pressureUnits.MBAR)}
          >mbar</button>
        </div>
      </div>
    </div>
  </div>
</div>
{/if}
