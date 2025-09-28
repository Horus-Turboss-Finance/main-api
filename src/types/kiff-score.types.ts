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
  nb_personne_foyer: number;
  BVM: number;
  budget_mensuel_restant: number;
  kiff_brut_mensuel: number;
  budget_annuel: number;
  kiff_brut_annuel: number;
  kiff_brut: number;
  reserve_liquide: number;
  coussin: number;
  kiff_ajuste: number;
  mois_survie: number;
  score_stabilite: number;
  mood: 'relax' | 'serré' | 'alerte';
  details: {
    charge_annuelle: number;
    projet_pondere: number;
    revenu_annuel: number;
    moyenne_depenses_journalier: number;
  };
};