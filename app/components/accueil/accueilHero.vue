<script setup lang="ts">
const colors = useColors();
</script>
<template>
    <GlobalSection id="accueil-hero">
        <div>
            <SvgAccueilHeroText1 class="accueil-hero-svg-text-1" :color="colors.brown" />
            <SvgAccueilHero class="accueil-hero-svg" :color="colors.yellow" />
            <SvgAccueilHeroText2 class="accueil-hero-svg-text-2" :color="colors.brown" />
        </div>
    </GlobalSection>
</template>
<style lang="scss" scoped>
div{
    position: relative;
}

#accueil-hero{
    :deep(.inner-section){
        padding-top: 0px;
    }
}

.accueil-hero-svg-text-1{
    position: relative;
    top: 0;
    left: 33%;
    transform: translate(-50%);
    width: 12.5%;
    min-width: 150px;
    height: auto;

    @media screen and (max-width: $small-breakpoint) {
        //left: calc(5% + 75px);
    }
}

.accueil-hero-svg{
    position: relative;
    top: 0;
    left: 50%;
    transform: translate(-50%);

    width: 30%;
    min-width: 250px;
    height: auto;
}

.accueil-hero-svg-text-2{
    position: relative;
    top: 0;
    left: 66%;
    transform: translate(-50%);
    width: 12.5%;
    min-width: 150px;
    height: auto;

    @media screen and (max-width: $small-breakpoint) {
        //left: calc(50% + 75px);
    }
}
</style>