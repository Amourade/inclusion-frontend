<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core';

const { getSingletonItem, getItems } = useDirectusItems();
const locale = useI18n();
const colors = useColors();
const breakPointsValues = useBreakpointsValues()
const breakpoints = useBreakpoints(breakPointsValues.value);

const activeBreakpoint = breakpoints.active();
const newsletterResult = ref('');

let jsonpCounter = 0;

function jsonpSubmit(form: HTMLFormElement): Promise<any> {
    return new Promise((resolve, reject) => {
        const callbackName = `mailchimpCallback_${++jsonpCounter}`;

        // Build the JSONP URL: /post -> /post-json, carry the form fields, add the callback param.
        const url = new URL(form.action);
        url.pathname = url.pathname.replace(/\/post$/, '/post-json');
        new FormData(form).forEach((value, key) => {
            url.searchParams.set(key, value as string);
        });
        url.searchParams.set('c', callbackName);

        const script = document.createElement('script');

        let settled = false;
        const cleanup = () => {
            delete (window as any)[callbackName];
            script.remove();
        };

        // Guard against a loaded-but-unparseable response: onerror does NOT fire when a
        // script loads with HTTP 200 but contains invalid JS, so the callback would never
        // run and this Promise would hang. Time it out instead.
        const timeout = setTimeout(() => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(new Error('JSONP request timed out'));
        }, 10000);

        (window as any)[callbackName] = (data: unknown) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            cleanup();
            resolve(data);
        };

        script.onerror = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            cleanup();
            reject(new Error('JSONP request failed'));
        };

        // Assign src last, once the callback is registered, then insert to start the load.
        script.src = url.toString();
        document.body.appendChild(script);
    });
}

let resultTimeout: number;

async function onNewsletterSubmit(event: Event) {
    const form = event.target as HTMLFormElement;
    
    try {
        const data = await jsonpSubmit(form);
        
        newsletterResult.value = data.result;
    } catch (error) {
        newsletterResult.value = 'error';

        console.error(error);
    }

    clearTimeout(resultTimeout)

    resultTimeout = setTimeout(()=>{
        newsletterResult.value = ''
    }, 5000)
}

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
                        <form action="https://pceim.us6.list-manage.com/subscribe/post?u=6b60032306b69e686d263b94e&id=58ee0f5891&f_id=003517e2f0" method="post" @submit.prevent="onNewsletterSubmit">
                            <label for="newsletter-email">{{ footer?.infolettre_texte }}</label>
                            <div>
                                <input id="newsletter-email" name="EMAIL" type="email" autocomplete="on" :placeholder="footer?.infolettre_courriel_placeholder" required />
                                <input type="text" name="b_6b60032306b69e686d263b94e_58ee0f5891" tabindex="-1" value="" style="position:absolute;left:-5000px;">
                                <GlobalRoundButton>
                                    <button class="round-content-button" type="submit"><span>{{ footer?.infolettre_envoyer }}</span> <SvgShortDiagArrow :color="colors.brown" /></button>
                                </GlobalRoundButton>
                            </div>
                            <Transition name="fade">
                                <p v-if="newsletterResult">
                                    {{ 
                                        newsletterResult == 'error' ? 
                                        locale == 'en' ? 'There was an error, try again later' : 'Il y a eu une erreur, réessayez plus tard' :
                                        locale == 'en' ? 'Successfully subscribed to the newsletter' : 'Inscription à l\'infolettre réussi' 
                                    }}
                                </p>
                            </Transition>
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
                    <FooterLink :link="footer?.politique_confidentialite_lien">{{ footer?.politique_confidentialie_libelle }}</FooterLink>
                </p>
                <p>
                    <FooterLink :link="footer?.conditions_generales_lien">{{ footer?.conditions_generales_libelle }}</FooterLink>
                </p>
                <div class="realise-par" v-if="footer?.realise_par" v-html="footer.realise_par" />
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
    }

    @media screen and (max-width: $small-breakpoint) {
        padding: $content-block-padding-small;
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
        
        &:autofill,
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
            /* Paint over the yellow with a 1000px inset shadow in your brown */
            -webkit-box-shadow: 0 0 0 1000px $brown inset !important;
            box-shadow: 0 0 0 1000px $brown inset !important;

            /* White text (color is ignored on autofill; this isn't) */
            -webkit-text-fill-color: #ffffff !important;

            /* Keep the caret visible against the brown */
            caret-color: #ffffff;

            /* Match the input's own typography */
            font-family: Montserrat, sans-serif!important;
            font-size: 1rem !important;
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

    padding-right: 2rem;

    .realise-par{
        flex-grow: 1;
        text-align-last: end;
    }

    @media screen and (max-width: $medium-breakpoint){
        padding-right: 3rem;
    }

    :deep(a){

        display: inline-block;
        position: relative;
    
        &:before{
            content: "";
            position: absolute;
            bottom: 1px;
            left: 1px;
            height: 1px;
            width: 0%;
            background-color: $white;

            transition: width .5s ease-in-out;
        }

        @media screen and (hover: hover){
            &:hover:before{
                width: 100%;
            }
        }
    }

}
</style>