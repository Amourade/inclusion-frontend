<script setup lang="ts">
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
    name: 'QuiNousSommes',
    title: 'Qui nous sommes - Inclusion Montréal'
});

const colors = useColors();

const {
    data: quiNousSommes,
    pending,
    error,
    refresh,
} = await useAsyncData("qui_sommes_nous", () =>
    getSingletonItem<QuiNousSommes>({
        collection: "qui_nous_sommes",
    })
);

const {
    data: conseilMembres,
    pending: conseilMembresPending,
    error: conseilMembresError,
    refresh: conseilMembresRefresh,
} = await useAsyncData("conseil_membres", () =>
    getItems<ConseilMembre>({
        collection: "membre_conseil",
    })
);

const {
    data: equipeMembres,
    pending: equipeMembresPending,
    error: equipeMembresError,
    refresh: equipeMembresRefresh,
} = await useAsyncData("equipe_membres", () =>
    getItems<EquipeMembre>({
        collection: "equipe_membre",
    })
);

const spanifiedStaggerdMissionTitle = computed(() => {
    if (!quiNousSommes.value?.notre_mission_sous_titre) return '';

    return quiNousSommes.value?.notre_mission_sous_titre.split('\n').map(word => `<span>${word}</span>`).join('')
})

const spanifiedStaggerdEquipeTitle = computed(() => {
    if (!quiNousSommes.value?.equipe_sous_titre) return '';

    return quiNousSommes.value?.equipe_sous_titre.split('\n').map(word => `<span>${word}</span>`).join('')
})

const spanifiedStaggerdConseilTitle = computed(() => {
    if (!quiNousSommes.value?.conseil_sous_titre) return '';

    return quiNousSommes.value?.conseil_sous_titre.split('\n').map(word => `<span>${word}</span>`).join('')
})
</script>
<template>
    <GlobalSection id="notre-mission" :small-title="quiNousSommes?.notre_mission_titre">
        <h3 class="big-title staggered-title" v-html="spanifiedStaggerdMissionTitle" />
        <div id="notre-mission-boites">
            <p>{{ quiNousSommes?.notre_mission_boite_1 }}</p>
            <p>{{ quiNousSommes?.notre_mission_boite_2 }}</p>
            <p>{{ quiNousSommes?.notre_mission_boite_3 }}</p>
        </div>
        <div class="centered-container">
            <NuxtLink class="round-content-button" :to="{ name: '' }">
                <span>{{ quiNousSommes?.notre_mission_lien_titre }}</span>
                <SvgShortDiagArrow :color="colors.white" />
            </NuxtLink>
        </div>
    </GlobalSection>
    <GlobalSection id="equipe" :small-title="quiNousSommes?.equipe_titre">
        <h3 class="big-title staggered-title" v-html="spanifiedStaggerdEquipeTitle" />
        <div class="text centered">
            <p>{{ quiNousSommes?.equipe_texte }}</p>
        </div>
        <div id="equipe-membres">
            <QuiNousSommesEquipeCard v-for="membre in equipeMembres" :membre="membre" :key="membre.id" />
        </div>
    </GlobalSection>
    <GlobalSection id="conseil" :small-title="quiNousSommes?.conseil_titre">
        <div class="offset-wrapper">
            <div class="offset">
                <h3 class="big-title staggered-title" v-html="spanifiedStaggerdConseilTitle" />
                <div class="text">
                    <p>{{ quiNousSommes?.conseil_texte }}</p>
                </div>
            </div>
        </div>
        <div id="conseil-objectifs">
            <h3>{{ quiNousSommes?.conseil_objectifs_titre }}</h3>
            <div class="boxes">
                <div>
                    <p>{{ quiNousSommes?.conseil_objectifs_1 }}</p>
                </div>
                <div>
                    <p>{{ quiNousSommes?.conseil_objectifs_2 }}</p>
                </div>
                <div>
                    <p>{{ quiNousSommes?.conseil_objectifs_3 }}</p>
                </div>
                <div>
                    <p>{{ quiNousSommes?.conseil_objectifs_4 }}</p>
                </div>
            </div>
        </div>
        <div id="conseil-membres">
            <h3>{{ quiNousSommes?.conseil_membres_titre }}</h3>
            <div class="boxes">
                <div v-for="membre in conseilMembres">
                    <h4>{{ membre.nom }}</h4>
                    <p>{{ membre.titre }}</p>
                    <p>{{ membre.origine }}</p>
                </div>
            </div>
        </div>
    </GlobalSection>
</template>
<style lang="scss" scoped>
#notre-mission {
    background-color: $blue;
    color: $brown;

    flex-grow: 1;

    p {
        font-size: 1.375rem;
        line-height: 120%;
        font-weight: 400;

        @media screen and (max-width: $small-breakpoint) {
            font-size: 1.125rem;
        }
    }

    .staggered-title {
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 4rem;

        :deep(span) {
            position: relative;
        }

        :nth-child(1) {
            left: 0%;
        }

        :nth-child(2) {
            left: 38%;

            @media screen and (max-width: $small-breakpoint) {
                left: 18%;
            }
        }

        :nth-child(3) {
            left: 17%;

            @media screen and (max-width: $medium-breakpoint) {
                left: 12%;
            }

            @media screen and (max-width: $small-breakpoint) {
                left: 0%;
            }
        }

        :nth-child(4) {
            left: 0%;

            @media screen and (max-width: $medium-breakpoint) {
                left: 0%;
            }

            @media screen and (max-width: $small-breakpoint) {
                left: 10%;
            }
        }
    }

    #notre-mission-boites {
        margin-bottom: 4rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3rem;

        @media screen and (max-width: $medium-breakpoint) {
            gap: 2rem;
            grid-template-columns: repeat(2, 1fr);
        }

        @media screen and (max-width: $small-breakpoint) {
            gap: 1.5rem;
            grid-template-columns: 1fr;
        }
    }

    .round-content-button {
        color: $white;
        background-color: $brown;

        font-size: 1.125rem;
        font-weight: 400;

        margin-bottom: 2rem;
    }
}

#equipe {
    background-color: $white;
    color: $brown;

    .staggered-title {
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 4rem;

        :deep(span) {
            position: relative;
        }

        :nth-child(1) {
            left: 0%;
        }

        :nth-child(2) {
            left: 40%;

            @media screen and (max-width: $small-breakpoint) {
                left: 18%;
            }
        }

        :nth-child(3) {
            left: 18%;

            @media screen and (max-width: $small-breakpoint) {
                left: 10%;
            }
        }
    }

    .text {
        font-size: 1.375rem;
        line-height: 120%;
        font-weight: 400;

        max-width: 800px;
        margin: 0 auto;

        margin-bottom: 5rem;

        @media screen and (max-width: $small-breakpoint) {
            font-size: 1.125rem;
        }
    }

    #equipe-membres {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.56rem;

        @media screen and (max-width: $medium-breakpoint) {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
        }

        @media screen and (max-width: $small-breakpoint) {
            grid-template-columns: repeat(1, 1fr);
            gap: 1.25rem;
        }
    }
}

#conseil {
    background-color: $blue;
    color: $brown;

    .offset-wrapper {
        display: flex;
        justify-content: flex-end;

        position: relative;
        top: -3rem;

        margin-bottom: 3rem;

        @media screen and (max-width: $medium-breakpoint) {
            top: 0rem;
            margin-bottom: 4rem;
        }
    }

    .offset {
        max-width: min(830px, 100%);
        position: relative;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .text {
        font-size: 2rem;
        line-height: 120%;
        font-weight: 400;

        @media screen and (max-width: $medium-breakpoint) {
            font-size: 1.5rem;
        }

        @media screen and (max-width: $small-breakpoint) {
            font-size: 1.25rem;
        }
    }

    #conseil-objectifs {
        margin-bottom: 3rem;

        h3 {
            font-size: 2rem;
            line-height: 120%;
            font-weight: 600;

            margin-bottom: 3rem;

            @media screen and (max-width: $medium-breakpoint) {
                font-size: 1.75rem;
            }

            @media screen and (max-width: $small-breakpoint) {
                font-size: 1.5rem;
            }
        }

        .boxes {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem 2rem;

            @media screen and (max-width: $medium-breakpoint) {
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem 1.5rem;
            }

            @media screen and (max-width: $small-breakpoint) {
                grid-template-columns: repeat(1, 1fr);
                gap: 2rem 1.25rem;
            }

            div {
                p {
                    font-size: 1.25rem;
                    line-height: 160%;
                    letter-spacing: -3%;
                    font-weight: 600;

                    @media screen and (max-width: $medium-breakpoint) {
                        font-size: 1.15rem;
                    }

                    @media screen and (max-width: $small-breakpoint) {
                        font-size: 1.1rem;
                    }
                }
            }
        }
    }

    #conseil-membres {
        margin-bottom: 3rem;

        h3 {
            font-size: .75rem;
            text-transform: uppercase;
            font-weight: 500;
            line-height: 150%;
            letter-spacing: -2%;

            margin-bottom: 2rem;

            @media screen and (max-width: $medium-breakpoint) {
                font-size: 1rem;
            }

            @media screen and (max-width: $small-breakpoint) {
                font-size: 1rem;
            }
        }

        .boxes {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem 2rem;

            * {
                font-size: .875rem;
                line-height: 160%;
                letter-spacing: -3%;
                font-weight: 400;

                @media screen and (max-width: $medium-breakpoint) {
                    font-size: 1rem;
                }

                @media screen and (max-width: $small-breakpoint) {
                    font-size: 1rem;
                }
            }

            @media screen and (max-width: $medium-breakpoint) {
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem 1.5rem;
            }

            @media screen and (max-width: $small-breakpoint) {
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem 1.25rem;
            }
        }
    }

    .staggered-title {
        margin-bottom: 3rem;
        width: 100%;

        :deep(span) {
            position: relative;
        }

        :nth-child(1) {
            left: 20%;

            @media screen and (max-width: $small-breakpoint) {
                left: 10%;
            }
        }

        :nth-child(2) {
            left: 0%;

            @media screen and (max-width: $small-breakpoint) {
                left: 0%;
            }
        }

        :nth-child(3) {
            left: 10%;

            @media screen and (max-width: $small-breakpoint) {
                left: 10%;
            }
        }
    }
}
</style>