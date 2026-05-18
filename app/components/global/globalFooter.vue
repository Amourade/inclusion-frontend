<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core';

const colors = useColors();
const breakPointsValues = useBreakpointsValues()
const breakpoints = useBreakpoints(breakPointsValues.value);

const activeBreakpoint = breakpoints.active();
</script>
<template>
    <footer>
        <div class="inner">
            <section class="top">
                <div class="left">
                    <SvgMainLogo :color="'#F25D7A'" />
                    <SvgFooter v-if="activeBreakpoint !== 'small'" id="svg-footer" :color="'#F5F5F5'" />
                    <div v-if="activeBreakpoint !== 'small'" class="infos">
                        <p>5350, rue Lafond</p>
                        <p>Montréal, Québec – H1X 2X2</p>
                        <p>Téléphone: <a href="tel:5142551054">514-255-1054</a></p>
                    </div>
                </div>
                <div class="right">
                    <nav class="footer-menu">
                        <div>
                            <h2>Découvrez</h2>
                            <ul>
                                <li>
                                    <NuxtLink href="#">Qui sommes-nous</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Approche</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Nos partenaires</NuxtLink>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2>Partagez</h2>
                            <ul>
                                <li>
                                    <NuxtLink href="#">Libre Espace</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Épicerie Solidaire</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">La Pélicantine</NuxtLink>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2>activités</h2>
                            <ul>
                                <li>
                                    <NuxtLink href="#">Activités du mois</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Création</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Socio-culturel</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Discussions</NuxtLink>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2>agissez</h2>
                            <ul>
                                <li>
                                    <NuxtLink href="#">Implication</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Discussion</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Sensibilisation</NuxtLink>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2>Connectez-vous</h2>
                            <ul>
                                <li>
                                    <NuxtLink href="#">LinkedIn</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Facebook</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Youtube</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="#">Instagram</NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div class="newsletter">
                        <h2>Envie de participer?</h2>
                        <form>
                            <label for="newsletter-email">Abonnez-vous à notre infolettre et ne manquez pas nos activités.</label>
                            <div>
                                <input id="newsletter-email" type="email" placeholder="Votre courriel..." required />
                                <button class="round-content-button" type="submit"><span>Envoyer</span> <SvgShortDiagArrow :color="colors.brown" /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <section v-if="activeBreakpoint === 'small'">
                <div class="infos">
                    <p>5350, rue Lafond</p>
                    <p>Montréal, Québec – H1X 2X2</p>
                    <p>Téléphone: <a href="tel:5142551054">514-255-1054</a></p>
                </div>
            </section>
            <section class="bottom">
                <p>©2026 Projet inclusion. Tous droits réservés</p>
                <p>
                    <NuxtLink href="#" @click.prevent="">Politique de confidentialité</NuxtLink>
                </p>
                <p>
                    <NuxtLink href="#" @click.prevent="">Conditions générales</NuxtLink>
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