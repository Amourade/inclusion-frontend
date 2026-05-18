interface AccueilBoite {
  id?: string | number;
  titre: string;
  texte: string;
  lien: string;
  titre_du_lien: string;
}

interface Accueil {
    id?: string | number;
    intro_titre: string;
    intro_texte: string;
    calendrier_titre: string;
    calendrier_sous_titre: string;
    contactez_nous_titre: string;
    contactez_nous_sous_titre: string;
}

interface ConseilMembre{
    nom: string;
    titre: string;
    origine: string;
}

interface EquipeMembre{
    id?: string;
    nom: string;
    pronom: string;
    titre: string;
    telephone: string;
    poste: string;
    email: string;
    texte_extra?: string;
    photo?: string;
    bio?: string; 
    a_propos_libelle?: string;
}

interface QuiNousSommes {
    id?: string | number;
    notre_mission_titre: string;
    notre_mission_sous_titre: string;
    notre_mission_boite_1: string;
    notre_mission_boite_2: string;
    notre_mission_boite_3: string;
    notre_mission_lien_titre: string;
    notre_mission_lien_destination: string;
    equipe_titre: string;
    equipe_sous_titre: string;
    equipe_texte: string;
    conseil_titre: string;
    conseil_sous_titre: string;
    conseil_texte: string;
    conseil_objectifs_titre: string;
    conseil_objectifs_1: string;
    conseil_objectifs_2: string;
    conseil_objectifs_3: string;
    conseil_objectifs_4: string;
    conseil_membres_titre: string;
}

interface ProjetsConcertes {
    id?: string | number;
    titre: string;
    sous_titre: string;
    texte_intro: string;
    texte_projets: string;
}

interface Projet {
    id?: string | number;
    titre: string;
    texte: string;
    lien: string;
    lien_libelle: string;
    boite_orange_pale: boolean;
}

interface NosEspaces{
    id?: string | number;
    titre: string;
    sous_titre: string;
    texte: string;
}

interface Simpliquer{
    id?: string | number;
    titre: string;
    sous_titre: string;
    texte: string;
    facons_de_simpliquer_titre: string;
}

interface FaconDeSimpliquer{
    id?: string | number;
    titre: string;
    sous_titre: texte;
    texte: lien;
    facons_de_simpliquer_titre: lien_libelle;
}

interface Espace{
    id?: string | number;
    titre: string;
    texte: string;
    lien: string;
    lien_libelle: string;
    boite_orange_pale: boolean;
}

interface NotreApprocheEtImplications {
    id?: string | number;
    approche_et_implications_titre: string;
    approche_et_implications_sous_titre: string;
    approche_et_implications_texte: string;
    niveaux_daction_titre: string;
    implications_titre: string;
    implications_texte: string;
}

interface ApprocheEtImplicationsButs {
    id?: string | number;
    texte: string;
}

interface NiveauxDactions {
    id?: string | number;
    titre: string;
    texte: string;
}

interface ImplicationsListe {
    id?: string | number;
    texte: string;
}

interface SoutienAuxOrganisations {
    id?: string | number;
    titre: string;
    sous_titre: string;
    texte_intro: string;
    texte_description: string;
    texte_bas: string;
}

interface LieuxPartenairesListe {
    id?: string | number;
    titre: string;
    texte: string;
    lien: string;
    lien_libelle: string;
}

interface Contact {
    id?: string | number;
    titre: string;
    sous_titre: string;
    texte: string;
    nos_bureaux_titre: string;
    nos_bureaux_texte: string;
    lieux_partenaires_titre: string;
    lieux_partenaires_sous_titre: string;
}

interface IdeesThemesListe {
    id?: string | number;
    texte: string;
}

interface SiteColors {
    'black': string;
    'light-black': string;
    'very-light-pink': string;
    'light-pink': string;
    'pink': string;
    'very-light-orange': string;
    'light-orange': string;
    'orange': string;
    'brown': string;
    'light-grey': string;
    'dark-grey': string;
    'blue': string;
    'green': string;
    'white': string;
    'neon-pink': string;
    'yellow': string;
}

interface Link {
    label: string;
    link: string;
}

interface MainMenuLink extends Link{
    submenu?: Link[];
}