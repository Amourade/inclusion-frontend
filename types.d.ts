interface AccueilBoite {
  id?: string | number;
  languages_code?: string;
  titre: string;
  texte: string;
  lien: string;
  titre_du_lien: string;
  translations?: AccueilBoite[];
}

interface Accueil {
  id?: string | number;
  languages_code?: string;
  intro_titre: string;
  intro_texte: string;
  calendrier_titre: string;
  calendrier_sous_titre: string;
  contactez_nous_titre: string;
  contactez_nous_sous_titre: string;
  translations?: Accueil[];
}

interface Menu {
  id?: string | number;
  languages_code?: string;
  montrer_choix_langues: boolean;
  translations?: Menu[];
}

interface MenuItem {
  id?: string | number;
  languages_code?: string;
  libelle: string;
  lien: string;
  sous_menu?: MenuItem[];
  translations?: MenuItem[];
}

interface ConseilMembre {
  id?: string | number;
  languages_code?: string;
  nom: string;
  titre: string;
  origine: string;
  translations?: ConseilMembre[];
}

interface EquipeMembre {
  id?: string;
  languages_code?: string;
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
  translations?: EquipeMembre[];
}

interface QuiNousSommes {
  id?: string | number;
  languages_code?: string;
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
  translations?: QuiNousSommes[];
}

interface ProjetsConcertes {
  id?: string | number;
  languages_code?: string;
  titre: string;
  sous_titre: string;
  texte_intro: string;
  texte_projets: string;
  translations?: ProjetsConcertes[];
}

interface Projet {
  id?: string | number;
  languages_code?: string;
  titre: string;
  texte: string;
  lien: string;
  lien_libelle: string;
  boite_orange_pale: boolean;
  translations?: Projet[];
}

interface NosEspaces {
  id?: string | number;
  languages_code?: string;
  titre: string;
  sous_titre: string;
  texte: string;
  translations?: NosEspaces[];
}

interface Simpliquer {
  id?: string | number;
  languages_code?: string;
  titre: string;
  sous_titre: string;
  texte: string;
  facons_de_simpliquer_titre: string;
  translations?: Simpliquer[];
}

interface FaconDeSimpliquer {
  id?: string | number;
  languages_code?: string;
  titre: string;
  texte: texte;
  lien: string;
  lien_libelle: string;
  translations?: FaconDeSimpliquer[];
}

interface Espace {
  id?: string | number;
  languages_code?: string;
  titre: string;
  texte: string;
  lien: string;
  lien_libelle: string;
  boite_orange_pale: boolean;
  translations?: Espace[];
}

interface NotreApprocheEtImplications {
  id?: string | number;
  languages_code?: string;
  approche_et_implications_titre: string;
  approche_et_implications_sous_titre: string;
  approche_et_implications_texte: string;
  niveaux_daction_titre: string;
  implications_titre: string;
  implications_texte: string;
  translations?: NotreApprocheEtImplications[];
}

interface ApprocheEtImplicationsButs {
  id?: string | number;
  languages_code?: string;
  texte: string;
  translations?: ApprocheEtImplicationsButs[];
}

interface NiveauxDactions {
  id?: string | number;
  languages_code?: string;
  titre: string;
  texte: string;
  texte: string;
  translations?: NiveauxDactions[];
}

interface ImplicationsListe {
  id?: string | number;
  languages_code?: string;
  texte: string;
  translations?: ImplicationsListe[];
}

interface SoutienAuxOrganisations {
  id?: string | number;
  languages_code?: string;
  titre: string;
  sous_titre: string;
  texte_intro: string;
  texte_description: string;
  texte_bas: string;
  translations?: SoutienAuxOrganisations[];
}

interface LieuxPartenairesListe {
  id?: string | number;
  languages_code?: string;
  titre: string;
  texte: string;
  lien: string;
  lien_libelle: string;
  translations?: LieuxPartenairesListe[];
}

interface Contact {
  id?: string | number;
  languages_code?: string;
  titre: string;
  sous_titre: string;
  texte: string;
  nos_bureaux_titre: string;
  nos_bureaux_texte: string;
  lieux_partenaires_titre: string;
  lieux_partenaires_sous_titre: string;
  translations?: Contact[];
}

interface IdeesThemesListe {
  id?: string | number;
  languages_code?: string;
  texte: string;
  translations?: IdeesThemesListe[];
}

interface Footer {
  infolettre_titre: string;
  infolettre_texte: string;
  infolettre_courriel_placeholder: string;
  infolettre_envoyer: string;
  adresse: string;
  copyright: string;
  politique_confidentialie_libelle: string;
  politique_confidentialite_lien: string;
  conditions_generales_libelle: string;
  conditions_generales_lien: string;
  translations?: Footer[];
}

interface Calendrier {
  id?: string | number;
  languages_code?: string;
  titre: string;
  sous_titre: string;
  pas_devenements_message: string;
  translations?: Calendrier[];
}

interface GenericListingPage{
  id?: string | number;
  languages_code?: string;
  titre: string;
  texte: string;
  translations?: GenericListingPage[];
}

interface Calendrier {
  id?: string | number;
  languages_code?: string;
  titre: string;
  sous_titre: string;
  pas_devenements_message: string;
  libelle_categorie_sans_inscription: string;
  libelle_categorie_avec_inscription: string;
  translations?: Calendrier[];
}

type PostStatus = 'draft' | 'published' | 'archived';

interface Evenement {
  id?: string | number;
  languages_code?: string;
  status: PostStatus;
  titre: string;
  location: string;
  description: string;
  complet: boolean;
  inscription_requise: boolean;
  categories: EvenementCategorieAssociation[];
  lien_dinscription: string;
  prix: string;
  lien_inscription_libelle: string;
  date: string;
  photo: string;
  heure_debut: string;
  heure_fin: string;
  translations?: Evenement[];
}

interface Article{
  id?: string | number;
  languages_code?: string;
  status: PostStatus;
  slug: string,
  user_created: any;
  date_created: string;
  titre: string;
  intro: string;
  image: string;
  texte: string;
  translations?: Article[];
}

interface Galerie{
  id?: string | number;
  languages_code?: string;
  date_created: string;
  titre: string;
  texte: string;
  images: any[];
  translations?: Galerie[];
}

interface Rapport{
  id?: string | number;
  languages_code?: string;
  date_created: string;
  fichier: string;
  titre: string;
  image: string;
  translations?: Rapport[];
}

interface Publication{
  id?: string | number;
  languages_code?: string;
  sort: int;
  titre: string;
  description: string;
  lien_libelle?: string;
  lien?: string;
  lien_fichier?: string;
  html?: string;
  translations?: Publication[];
}

interface EvenementCategorieAssociation {
  id: number,
  evenement_id: number,
  evenement_categorie_id: number,
}

interface EvenementCategorie{
  id?: string | number;
  languages_code?: string;
  libelle: string;
  translations?: EvenementCategorie[];
}

interface FooterGroupeDeLiens {
  id?: string | number;
  languages_code?: string;
  titre: string;
  liens: Lien[];
  translations?: FooterGroupeDeLiens[];
}

interface SiteColors {
  black: string;
  "light-black": string;
  "very-light-pink": string;
  "light-pink": string;
  pink: string;
  "very-light-orange": string;
  "light-orange": string;
  orange: string;
  brown: string;
  "light-grey": string;
  "dark-grey": string;
  blue: string;
  green: string;
  white: string;
  "neon-pink": string;
  yellow: string;
}

interface Link {
  label: string;
  link: string;
}

interface Lien {
  libelle: string;
  lien: string;
}

interface MainMenuLink extends Link {
  submenu?: Link[];
}

interface Translatable<T = unknown> {
  id?: string | number;
  languages_code?: string;
  translations?: T[];
}

type TranslatableItem = Translatable<unknown>;