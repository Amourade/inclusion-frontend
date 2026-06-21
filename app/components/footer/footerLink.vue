<script setup lang="ts">
const props = defineProps<{
    link?: string
}>()

const parsedLink = useParseLink(props.link)
</script>
<template>
    <NuxtLink :to="parsedLink" :external="parsedLink.target === '_blank'" :target="parsedLink.target">
        <slot />
    </NuxtLink>
</template>
<style lang="scss" scoped>
a{
    position: relative;
    display: inline-block;

    &::before{
        content: "";
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 0%;
        height: 1px;
        background-color: $light-grey;

        transition: width .5s ease-in-out;
    }
    
    @media screen and (hover: hover){
        &:hover::before{
            width: 100%;
        }
        
    }
}
</style>