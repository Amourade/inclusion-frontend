<script setup lang="ts">
defineProps({
    color: {
        type: String,
        default: '#F5F5F5'
    }
})
</script>
<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.19 11.7" :fill="color">
        <title>Asset 1</title>
        <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
                <path class="cls-1" d="M5.72,0V9.34l3.59-3.6.88.87L5.09,11.7,0,6.61l.86-.87,3.61,3.6V0Z" />
            </g>
        </g>
    </svg>
</template>