<script setup lang="ts">
defineProps({
    color: {
        type: String,
        default: '#F5F5F5'
    }
})
</script>
<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" :fill="color">
        <path
            d="M14.0082 0.749983C14.0082 0.33577 13.6724 -1.6418e-05 13.2582 -1.69448e-05L6.5082 -1.66919e-05C6.09398 -1.66919e-05 5.7582 0.33577 5.7582 0.749983C5.7582 1.1642 6.09398 1.49998 6.5082 1.49998L12.5082 1.49998L12.5082 7.49998C12.5082 7.9142 12.844 8.24998 13.2582 8.24998C13.6724 8.24998 14.0082 7.9142 14.0082 7.49998L14.0082 0.749983ZM0.530273 13.4779L1.0606 14.0082L13.7885 1.28031L13.2582 0.749983L12.7279 0.219653L-5.66393e-05 12.9476L0.530273 13.4779Z" />
    </svg>
</template>
<style lang="scss" scoped>
svg{
    transition: fill .5s ease-in-out;
    rotate: -45deg;
}
</style>