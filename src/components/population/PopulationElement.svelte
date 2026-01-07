<script lang="ts">
    let props = $props();
</script>

<div class="populationelement_container ${props.rtl && "righttoleft"}">
    <div class="populationelement_item"></div>
    {props.other}
</div>

<style>
    .righttoleft {
        flex-direction: column-reverse;
    }

    .populationelement_container {
        display: flex;
        flex-direction: column;
    }

    .populationelement_item {
        content: " ";
        background-color: var(--bg2);
    }
</style>