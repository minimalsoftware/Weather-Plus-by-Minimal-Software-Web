<script>
  let { open = false } = $props();
  import { modals } from '../../stores/modals.js';
</script>

{#if open}
<div class="modal modal--active" id="modal--wind">
  <div class="modal__header">
    <div class="title">Wind</div>
    <button class="close-button" onclick={() => modals.close('wind')}>
      <img class="icon--main-color" src="/graphics/svg/close-main-color.svg" alt="Close">
    </button>
  </div>
  <div class="modal__content">
    <div class="modal__chart wind__chart">
      <canvas id="wind-chart">Your browser does not support the canvas element.</canvas>
    </div>
  </div>
</div>
{/if}
