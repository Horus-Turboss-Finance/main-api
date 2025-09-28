export type Projet = {
  montant: number;
  flexibilite: number;
};

export type KiffOptions = {
  baseBVM?: number;
  nb_personne_foyer?: number;
  projets_annuel?: Projet[];
  objectif_epargne_annuel?: number;
  revenu_annuel_override?: number;
  considerDaysForDailyAverage?: number;
  transactionLimit?: number;
};

export type KiffResult = {
  mode: string,
  kiff_brut: number;
  kiff_ajuste: number;
  mois_survie: number;
  score_stabilite: number;
  mood: 'relax' | 'serré' | 'alerte';
};