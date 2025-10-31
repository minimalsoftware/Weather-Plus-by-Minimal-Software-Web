<script>
  let { open = $bindable(false) } = $props();
</script>

{#if open}
<div class="modal" id="modal--astronomy">
  <div class="modal__header">
    <div class="title">Moon phases calendar</div>
    <button class="close-button" onclick={() => open = false}>
      <img class="icon--main-color" src="/graphics/svg/close-main-color.svg" alt="Close">
    </button>
  </div>
  <div class="modal__content modal__content--astronomy">
    <div class="moon-phases-calendar">
      <!-- Moon phase calendar content -->
    </div>
  </div>
</div>
{/if}
