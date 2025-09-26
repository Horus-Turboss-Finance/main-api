export enum BankAccountType {
  // Comptes courants
  CURRENT = "current",
  COMPTE_JEUNE = "compte_jeune",
  COMPTE_JOINT = "compte_joint",

  // Épargne
  SAVINGS = "savings",
  LIVRET_A = "livret_a",
  LIVRET_JEUNE = "livret_jeune",
  LIVRET_LDD = "livret_developpement_durable",
  CEP = "compte_epargne_populaire",
  PEL = "plan_epargne_logement",
  CEL = "compte_epargne_logement",

  // Comptes cartes
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  PREPAID_CARD = "prepaid_card",

  // Investissement
  INVESTMENT = "investment",
  PEA = "plan_epargne_action",
  PLAN_RETRAITE = "plan_retraite",

  // Crypto
  CRYPTO_WALLET = "crypto_wallet",
  BITCOIN_WALLET = "bitcoin_wallet",
  ETHEREUM_WALLET = "ethereum_wallet",

  // Crédit
  LOAN = "loan",
  STUDENT_LOAN = "student_loan",
  AUTO_LOAN = "auto_loan",
  PERSONAL_LOAN = "personal_loan",
  REVOLVING_CREDIT = "revolving_credit",
  OVERDRAFT_ACCOUNT = "overdraft_account",

  // Autres
  CHILD_ACCOUNT = "child_account",
  CASH = "cash",
  OTHER = "other"
}

export enum NegativeBankType {
  CREDIT_CARD = "credit_card",
  LOAN = "loan",
  STUDENT_LOAN = "student_loan",
  AUTO_LOAN = "auto_loan",
  PERSONAL_LOAN = "personal_loan",
  REVOLVING_CREDIT = "revolving_credit",
  OVERDRAFT_ACCOUNT = "overdraft_account"
}

export enum BankLiquidityType {
  CURRENT = "current",
  COMPTE_JEUNE = "compte_jeune",
  COMPTE_JOINT = "compte_joint",
  PREPAID_CARD = "prepaid_card",
  DEBIT_CARD = "debit_card",
  VIRTUAL_CARD = "virtual_card",
  CASH = "cash",
  OTHER = "other"
}

export const LIQUIITY_ACCOUNT_TYPES = Object.values(BankLiquidityType);
export const NEGATIVE_ACCOUNT_TYPES = Object.values(NegativeBankType);
export const ALLOWED_BANK_ACCOUNT_TYPES = Object.values(BankAccountType);