<script setup lang="ts">
const { getThumbnail } = useDirectusFiles();
import { onKeyStroke } from '@vueuse/core';

const props = defineProps<{
    galerie: Galerie
}>()
const locale = useI18n();

const hovered = ref(false)

const lightboxIndex = ref<number | null>(null)
const isOpen = computed(() => lightboxIndex.value !== null)

const fileId = (image: any) => image.directus_files_id

const fullImage = (image: any) => getThumbnail(fileId(image), {
    width: 2000,
    height: 2000,
    fit: 'inside',
    format: 'webp',
    quality: 90
})

const open = (index: number) => {
    lightboxIndex.value = index
}
const close = () => {
    lightboxIndex.value = null
}
const next = () => {
    if (lightboxIndex.value === null) return
    lightboxIndex.value = (lightboxIndex.value + 1) % props.galerie.images.length
}
const prev = () => {
    if (lightboxIndex.value === null) return
    lightboxIndex.value = (lightboxIndex.value - 1 + props.galerie.images.length) % props.galerie.images.length
}

onKeyStroke('Escape', () => { if (isOpen.value) close() })
onKeyStroke('ArrowRight', () => { if (isOpen.value) next() })
onKeyStroke('ArrowLeft', () => { if (isOpen.value) prev() })
</script>
<template>
    <div class="listing" :class="{ hovered }">
        <h2 class="listing-title">
            {{ galerie.titre }}
        </h2>
        <div class="listing-text html-texte" v-if="galerie.texte" v-html="galerie.texte" />
        <div class="listing-galerie">
            <div class="listing-galerie-image" v-for="(image, index) in galerie.images" :key="fileId(image)"
                @click="open(index)">
                <GlobalImage :image="getThumbnail(fileId(image), {
                    width: 500,
                    height: 500,
                    fit: 'inside',
                    format: 'webp',
                    quality: 90
                })" />
            </div>
        </div>

        <Teleport to="body">
            <Transition name="fade">
                <div v-if="isOpen" class="galerie-lightbox" @click.self="close">
                    <GlobalLien lien="#" class="galerie-lightbox-button close no-text" @click.prevent="close"
                        :aria-label="locale == 'fr' ? 'Fermer' : 'Close'" animation="plus">
                        <template #icon><SvgPlusSign /></template>
                    </GlobalLien>
                    <GlobalLien v-if="galerie.images.length > 1" lien="#" class="galerie-lightbox-button prev no-text"
                        @click.prevent="prev"
                        :aria-label="locale == 'fr' ? 'Image précédente' : 'Previous image'" animation="plus">
                        <template #icon><SvgSideArrow /></template>
                    </GlobalLien>
                    <div class="galerie-lightbox-image">
                        <GlobalImage :cover="false" :image="fullImage(galerie.images[lightboxIndex!])" :alt="galerie.titre" />
                    </div>
                    <GlobalLien v-if="galerie.images.length > 1" lien="#" class="galerie-lightbox-button next no-text"
                        @click.prevent="next"
                        :aria-label="locale == 'fr' ? 'Image suivante' : 'Next image'" animation="plus">
                        <template #icon><SvgSideArrow /></template>
                    </GlobalLien>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>
<style lang="scss" scoped>
/**
Styles for the global lists are in main.scss
 */
.listing-galerie-image {
    cursor: pointer;
}

.galerie-lightbox {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;

    background: rgba($light-grey, 0.9);
}

.galerie-lightbox-image {
    width: 90vw;
    height: 90dvh;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
    }
}

.galerie-lightbox-button {
    position: absolute;
    z-index: 1001;

    &.close {
        top: 1.5rem;
        right: 1.5rem;

        :deep(.icon svg) {
            transform: rotate(45deg);
        }
    }

    &.prev,
    &.next {
        top: 50%;
        transform: translateY(-50%);

        :deep(svg){
            width: 1rem;
            height: 1rem;
        }
    }

    &.prev {
        left: .5rem;

        :deep(.icon svg) {
            transform: scaleX(-1);
        }
    }

    &.next {
        right: .5rem;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
