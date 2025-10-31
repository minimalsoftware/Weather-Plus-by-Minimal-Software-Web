<script>
  let { open = false } = $props();
  import { modals } from '../../stores/modals.js';
</script>

{#if open}
<div class="modal modal--active" id="modal--precipitation">
  <div class="modal__header">
    <div class="title">Precipitation</div>
    <button class="close-button" onclick={() => modals.close('precipitation')}>
      <img class="icon--main-color" src="/graphics/svg/close-main-color.svg" alt="Close">
    </button>
  </div>
  <div class="modal__content">
    <div class="modal__chart precipitation__chart">
      <canvas id="precipitation-chart">Your browser does not support the canvas element.</canvas>
    </div>
  </div>
</div>
{/if}
