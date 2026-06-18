<script setup lang="ts">
import { useBreakpoints, useDateFormat, useNow } from '@vueuse/core';

const props = defineProps<{
    event: Evenement,
    categories?: Array<EvenementCategorie>,
    compact: boolean
}>()
const emits = defineEmits<{
    (e: 'goToEvent', id: number): void
}>()

const colors = useColors();
const locale = useI18n();

const catNamesArray = computed(() => {
    return props.event.categories.map(catId => props.categories?.find(cat => cat.id === catId.evenement_categorie_id)?.libelle).filter(Boolean)
})

const date = computed(() => {
    if(locale.value === 'fr') {
        return useDateFormat(props.event.date, 'dddd DD MMMM', { locales: 'fr-CA' })
    }else{
        return useDateFormat(props.event.date, 'MMMM DD dddd', { locales: 'en-CA' })
    }
})

const goToEvent = () => {
    if(!props.compact) return;

    emits('goToEvent', props.event.id as number)
}

const highlight = (ids: number[]) => {
    if(ids.includes(props.event.id as number)){

    }
}

defineExpose({highlight})

const startTimeArray = props.event.heure_debut ? props.event.heure_debut.split(':') : []
const endTimeArray = props.event.heure_fin ? props.event.heure_fin.split(':') : []
</script>
<template>
    <GlobalCard :id="event.id" class="event" :class="{compact: compact}" :tabindex="compact ? 1 : 0" @click="goToEvent">
        <div class="categories">
            <span v-if="catNamesArray.length > 0" class="categorie-list">{{ catNamesArray.join(', ') }}<span class="registration"> - {{ locale == 'fr' ? event.inscription_requise ? "Inscription requise" : "Sans Inscription" : event.inscription_requise ? "Registration required" : "No registration" }}</span></span>
        </div>
        <div class="infos">
            <h3 v-if="event.titre" class="title large-body-text">{{ event.titre }}</h3>
            <p class="date-time">
                <span class="date">{{ date }}</span>
                <span class="time" v-if="startTimeArray || endTimeArray">
                     - {{ `${startTimeArray[0]}h${startTimeArray[1]}` }}
                    <template v-if="endTimeArray">
                        {{ ` ${locale == 'fr' ? "à" : "to"} ${endTimeArray[0]}h${endTimeArray[1]}` }}
                    </template>
                </span>
            </p>
            <p class="price">{{ event.prix && parseInt(event.prix) !== 0 ? `${locale == 'fr' ? "Prix:" : "Price:"} ${event.prix}` : locale == 'fr' ? 'Entrée gratuite' : 'Free entry'}}</p>
            <p class="address" v-if="event.location">{{ event.location }}</p>
        </div>
        <GlobalVHtml v-if="event.description && !compact" class="description" :html="event.description" />
        <template v-if="event.inscription_requise && event.lien_dinscription && !compact">
            <template v-if="!event.complet">
                <GlobalRoundButton>
                    <NuxtLink class="round-content-button" :href="event.lien_dinscription">
                        <span>{{ event.lien_inscription_libelle }}</span>
                        <SvgShortDiagArrow :color="colors['light-grey']" />
                    </NuxtLink>
                </GlobalRoundButton>
            </template>
            <template v-else>
                <p class="event-full">{{ locale === 'fr' ? 'Évènement complet' : 'Event full' }}</p>
            </template>
        </template>
    </GlobalCard>
</template>
<style lang="scss" scoped>
.event {
    background-color: $orange!important;
    color: $light-black!important;

    border-bottom-right-radius: 50px!important;

    gap: .5rem!important;

    transition: border-bottom-right-radius .5s ease-in-out, opacity .5s ease-in-out, max-height .5s ease-in-out, padding .5s ease-in-out;

    h3{
        font-weight: 500;
        line-height: 110%;
        letter-spacing: -3%;
        font-size: 1.5rem;

        margin-bottom: .5rem;
    }

    &.compact{
        padding: 1.5rem;
        justify-content: flex-start;
        cursor: pointer;

        flex-shrink: 0;

        width: calc(100%/3 - (1rem - 1rem/3));
        margin-right: 1rem;

        &:last-child{
            margin-right: 0px;
        }

        h3{
            font-size: 1.5rem;
        }

        @media screen and (hover: hover){
            &:hover{
                border-bottom-right-radius: $cards-radius!important;    
            }
        }
    }
}

.infos{
    font-weight: 500;
    font-size: .875rem;
    line-height: 160%;
    letter-spacing: -3%;

    &:not(:last-child) {
        margin-bottom: .5rem;
    }

    @media screen and (max-width: $medium-breakpoint) {
        font-size: .95rem;
    }
}

.description{
    &:not(:last-child) {
        margin-bottom: 1rem;
    }
}

.round-content-button{
    background-color: $brown;
    color: $light-grey;
    font-size: .875rem;
    padding: .5rem .9rem;

    @media screen and (max-width: $medium-breakpoint) {
        font-size: .95rem;
    }
}

.categories{
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    font-size: 0.85rem;
    line-height: 150%;
    letter-spacing: -2%;

    .registration{
        font-weight: 500;
    }
}

.date {
    text-transform: capitalize;
    font-weight: 600;
}

.event-full{
    font-weight: 500;
}
</style>