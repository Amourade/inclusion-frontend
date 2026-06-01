<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core';

const { getSingletonItem, getItems } = useDirectusItems();
const { locale } = useI18n();
const colors = useColors();
const breakPointsValues = useBreakpointsValues()
const breakpoints = useBreakpoints(breakPointsValues.value);

const activeBreakpoint = breakpoints.active();

const {
    data: footerData,
    pending: footerPending,
    error: footerError,
    refresh: footerRefresh,
} = await useAsyncData("footer", () =>
    getSingletonItem<Footer>({
        collection: "footer",
        params: {
            fields: ["*", "translations.*"]
        }
    })
);
const footer = useTranslatedItem(footerData, locale);

const {
  data: footerGroupeLienData,
  pending: footerGroupeLienPending,
  error: footerGroupeLienError,
  refresh: footerGroupeLienRefresh,
} = await useAsyncData("footer_groupe_liens", () =>
  getItems<FooterGroupeDeLiens>({
    collection: "footer_groupe_de_liens",
    params: {
      fields: ["*", "translations.*"]
    }
  })
);
const footerGroupeLiens = useTranslatedItems(footerGroupeLienData, locale);
</script>
<template>
    <footer>
        <div class="inner">
            <section class="top">
                <div class="left">
                    <SvgMainLogo :color="'#F25D7A'" />
                    <SvgFooter v-if="activeBreakpoint !== 'small'" id="svg-footer" :color="'#F5F5F5'" />
                    <GlobalVHtml v-if="activeBreakpoint !== 'small'" class="infos" :html="footer?.adresse" />
                </div>
                <div class="right">
                    <nav class="footer-menu">
                        <div v-for="groupe in footerGroupeLiens" :key="groupe.id">
                            <h2>{{ groupe.titre }}</h2>
                            <ul>
                                <li v-for="(lien, index) in groupe.liens" :key="index">
                                    <FooterLink :link="lien.lien" :color="colors['white']">
                                        {{ lien.libelle }}
                                    </FooterLink>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div class="newsletter">
                        <h2>{{ footer?.infolettre_titre }}</h2>
                        <form>
                            <label for="newsletter-email">{{ footer?.infolettre_texte }}</label>
                            <div>
                                <input id="newsletter-email" type="email" :placeholder="footer?.infolettre_courriel_placeholder" required />
                                <button class="round-content-button" type="submit"><span>{{ footer?.infolettre_envoyer }}</span> <SvgShortDiagArrow :color="colors.brown" /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <section v-if="activeBreakpoint === 'small'">
                <GlobalVHtml class="infos" :html="footer?.adresse" />
            </section>
            <section class="bottom">
                <p>{{ footer?.copyright }}</p>
                <p>
                    <FooterLink :link="footer?.politique_confidentialite_lien" @click.prevent="">{{ footer?.politique_confidentialie_libelle }}</FooterLink>
                </p>
                <p>
                    <FooterLink :link="footer?.politique_confidentialite_lien" @click.prevent="">{{ footer?.conditions_generales_libelle }}</FooterLink>
                </p>
            </section>
        </div>
    </footer>
</template>
<style lang="scss" scoped>
footer {
    background-color: $brown;
    width: 100%;
    color: $white;
}

.inner {
    max-width: $large-breakpoint;
    margin: 0 auto;

    padding: $content-block-padding-large;
    padding-bottom: 1.5rem;

    @media screen and (max-width: $medium-breakpoint) {
        padding: $content-block-padding-medium;
        //padding-bottom: 30px;
    }

    @media screen and (max-width: $small-breakpoint) {
        padding: $content-block-padding-small;
        //padding-bottom: 20px;
    }
}

.infos {
    font-size: 1rem;

    margin-top: 3rem;

    line-height: 160%;
}

.top {
    display: flex;
    flex-direction: row;
    gap: 3rem;
    justify-content: space-between;

    @media screen and (max-width: $small-breakpoint) {
        flex-direction: column;
    }
}

.left{
    width: 42%;

    @media screen and (max-width: $small-breakpoint) {
        width: 100%;
    }
}

.right{
    //flex-grow: 1;
    width: 50%;

    @media screen and (max-width: $small-breakpoint) {
        width: 100%;
    }
}

#svg-footer{
    margin: 3rem auto 0 auto;
}

.footer-menu {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem 1rem;

    h2 {
        font-size: .75rem;
        text-transform: uppercase;
        font-weight: 500;
        margin-bottom: 1rem;
    }

    ul {
        display: flex;
        flex-direction: column;
    }

    li {
        font-size: .875rem;
        font-weight: 600;
    }

    @media screen and (max-width: $medium-breakpoint) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.newsletter{
    margin-top: 3rem;
    h2{
        font-size: 1.375rem;
        font-weight: 400;
        line-height: 120%;
        margin-bottom: .5rem;
    }

    label{
        display: block;
        max-width: 280px;
        line-height: 120%;
        font-size: 1rem;
    }

    form>div{
        display: flex;
        flex-wrap: nowrap;
        gap: 1rem;

        margin-top: 1rem;

        align-items: flex-end;
    }

    input[type="email"]{
        margin-top: 1rem;
        padding: .75rem 1rem;
        border-radius: 4px;
        border: none;
        width: 100%;
        max-width: 300px;
        color: $white;
        background: transparent;
        border: none;
        outline: none;
        padding-left: 0px;

        &::placeholder {
            color: $white;
            opacity: 1; /* Firefox */
        }

        &::-ms-input-placeholder { /* Edge 12 -18 */
            color: $white;
        }
    }
}

.bottom{
    margin-top: 3rem;

    font-size: .875rem;
    font-weight: 400;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem 3rem;
}
</style>