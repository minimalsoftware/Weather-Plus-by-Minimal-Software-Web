<script>
  let { open = $bindable(false) } = $props();
</script>

{#if open}
<div class="modal" id="modal--precipitation">
  <div class="modal__header">
    <div class="title">Precipitation</div>
    <button class="close-button" onclick={() => open = false}>
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
