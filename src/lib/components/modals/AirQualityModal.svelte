<script>
  let { open = $bindable(false) } = $props();
</script>

{#if open}
<div class="modal" id="modal--air-quality">
  <div class="modal__header">
    <div class="title">Air Quality</div>
    <button class="close-button" onclick={() => open = false}>
      <img class="icon--main-color" src="/graphics/svg/close-main-color.svg" alt="Close">
    </button>
  </div>
  <div class="modal__content">
    <div class="modal__chart aqi__chart">
      <canvas id="aqi-chart">Your browser does not support the canvas element.</canvas>
    </div>
  </div>
</div>
{/if}
