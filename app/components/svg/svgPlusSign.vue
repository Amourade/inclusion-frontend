<script setup lang="ts">
defineProps({
    color: {
        type: String,
        default: '#F5F5F5'
    }
})
</script>
<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.5 13.5" :stroke="color" fill="none" stroke-width="1.5px">
        <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_2-2" data-name="Layer 2">
                <g id="Layer_3" data-name="Layer 3">
                    <line class="cls-1" x1="6.75" y1="0.75" x2="6.75" y2="12.75" />
                    <line class="cls-1" x1="12.75" y1="6.75" x2="0.75" y2="6.75" />
                </g>
            </g>
        </g>
    </svg>
</template>