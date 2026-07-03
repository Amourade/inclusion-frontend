<script setup lang="ts">
const { getThumbnail } = useDirectusFiles();

const props = defineProps<{
    membre: EquipeMembre;
}>();

const showBio = ref(false);
</script>
<template>
    <div class="member-card">
        <h4><span>{{ membre.nom }}</span> <span>{{ membre.pronom }}</span></h4>
        <div class="infos">
            <p>{{ membre.titre }}</p>
            <p>Tel: <a :href="`tel:${membre.telephone}`">{{ membre.telephone }}</a> <span v-if="membre.poste">poste {{
                    membre.poste }}</span></p>
            <p><a :href="`mailto:${membre.email}`">{{ membre.email }}</a></p>

            <div class="extra-infos" v-if="membre.texte_extra">
                <p>{{ membre.texte_extra }}</p>
            </div>
        </div>
        <template v-if="membre.bio">
            <GlobalLien lien="#" class="lien-bio" @click.prevent="showBio = true" :animation="'plus'">
                <template #icon><SvgPlusSign class="plus-sign" /></template>
                <template #text>{{ membre.a_propos_libelle ? membre.a_propos_libelle : 'En savoir plus' }}</template>
            </GlobalLien>
            <Transition name="team-card-fade">
                <div v-if="showBio" class="bio">
                    <GlobalVHtml class="text" :html="membre.bio"></GlobalVHtml>
                    <GlobalLien lien="#" class="lien-bio no-text" @click.prevent="showBio = false" :animation="'plus'">
                        <template #icon><SvgPlusSign class="plus-sign" /></template>
                    </GlobalLien>
                </div>
            </Transition>
        </template>
        <div class="photo" v-if="membre.photo">
            <img :src="getThumbnail(membre.photo, {width: 140, height: 140, format: 'webp'})" :alt="membre.nom" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.member-card {
    background-color: #F6F5F1;
    color: $black;
    padding: $cards-padding;
    padding-top: 6.25rem;
    padding-bottom: 6.25rem;
    border-radius: $cards-radius;
    border-bottom-right-radius: 70px;
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    overflow: hidden;

    min-height: 526px;

    @media screen and (max-width: $medium-breakpoint) {
      min-height: 450px;
        padding-top: 5rem;
        padding-bottom: 5rem;
    }

    @media screen and (max-width: $small-breakpoint) {
      min-height: 400px;
        padding-top: 4rem;
        padding-bottom: 4rem;
    }
}

.bio{
    padding: $cards-padding;

    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: $dark-grey;
    white-space: pre-line;

    font-size: 1rem;
    line-height: 130%;

    z-index: 5;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;

    .lien-bio{
        flex-shrink: 0;
    }

    .text{
        max-height: 100%;
        overflow: auto;

        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
    }

    .plus-sign{
        transform: rotate(45deg);
        width: 1rem!important;
        height: 1rem!important;
    }
}

h4{
    font-size: 1.25rem;
    line-height: 112%;
    font-weight: 400;

    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.infos{
    font-size: 1rem;
    line-height: 130%;
    font-weight: 400;
    
    max-width: 100%;

    a{
        text-decoration: underline;
    }
}

.lien-bio{
    max-width: calc(100% - 140px);
}

.extra-infos{
    margin-top: 1.5rem;
}

.plus-sign{
    width: .8rem!important;
    height: .8rem!important;
}

.photo{
    border-radius: 90px;
    width: 140px;
    height: 140px;

    position: absolute;
    bottom: 0px;
    right: 0px;
}
</style>