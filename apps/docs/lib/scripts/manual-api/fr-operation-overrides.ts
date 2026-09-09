/* @proprietary license */

/**
 * French guidance blocks for REST `.fr.mdx` pages (whenToUse, caveats, related).
 * Keeps EN/FR heading structure aligned for doctool `sync-i18n --check`.
 */
export type FrOperationGuidance = {
  whenToUse?: string;
  caveats?: string;
  related?: string;
};

export const FR_OPERATION_COPY = {
  AccountsController_checkAvailableBalance: {
    whenToUse:
      'Appelez avant un retrait, un paiement bénéficiaire ou tout flux nécessitant un solde disponible garanti.',
    related:
      '[Soldes de compte](/api/balances/AccountsController_getBalance) · [Retraits](/api/payouts/PayoutsUnifiedController_create)',
  },
  ChargesController_cancelCardCharge: {
    whenToUse: "Utilisez lorsque l'acheteur abandonne le paiement.",
    related:
      '[Créer un encaissement carte](/api/charge/ChargesController_createCardCharge)',
  },
  ChargesController_createCardCharge: {
    whenToUse:
      'Utilisez pour la saisie carte dans votre application lorsque vous gérez l’UI produit et la tokenisation.',
    caveats:
      'Ne journalisez ni n’exposez `client_secret` publiquement ; traitez-le comme une capacité courte durée pour le SDK client.',
    related:
      '[Créer une session checkout](/api/checkout-sessions/CheckoutSessionsController_create) si vous préférez l’encaissement hébergé.',
  },
  ChargesController_createSwitchCharge: {
    whenToUse:
      'Utilisez lorsque votre intégration est conforme PCI-DSS et soumet les informations de carte côté serveur, plutôt que de collecter les cartes via le checkout hébergé ou Payment Elements.',
    caveats:
      'La soumission des informations de carte brutes nécessite une intégration conforme PCI-DSS. Suivez `next_action` pour la 3DS et `retry_other_rail` en cas de refus du rail principal.',
    related:
      '[Créer un encaissement carte](/api/charge/ChargesController_createCardCharge) · [Encaissements directs](/build/accept/direct-charges)',
  },
  ChargesController_createWaveCharge: {
    whenToUse:
      'Utilisez pour un encaissement mobile money initié serveur lorsque vous n’utilisez **pas** une session checkout hébergée.',
    caveats:
      'Suivez les instructions du fournisseur dans la réponse ; l’UX dépend du rail (USSD, redirection app, etc.).',
    related:
      '[Mobile money](/build/mobile-money) · [Encaissements directs](/build/accept/direct-charges) · [Créer une session checkout](/api/checkout-sessions/CheckoutSessionsController_create) · [Transactions](/api/transactions/TransactionsController_findAll)',
  },
  ChargesController_getCardCharge: {
    whenToUse: 'Utilisez après confirmation client pour interroger le statut.',
    related:
      '[Créer un encaissement carte](/api/charge/ChargesController_createCardCharge)',
  },
  CheckoutSessionsController_create: {
    whenToUse:
      'Utilisez pour l’e-commerce, les factures ou tout flux où lomi. héberge l’encaissement et renvoie l’acheteur sur votre site.',
    caveats:
      'Préférez les sessions checkout aux encaissements ad hoc pour une expérience acheteur cohérente. Pour les produits pay_what_you_want, le montant doit respecter minimum_amount et maximum_amount du prix lié (unité × quantité).',
    related:
      '[Liens de paiement](/api/payment-links/PaymentLinksController_create) · [Récupérer une session checkout](/api/checkout-sessions/CheckoutSessionsController_findOne)',
  },
  CheckoutSessionsController_findAll: {
    whenToUse:
      'Utilisez pour la réconciliation, le support ou l’export des tentatives checkout récentes.',
    related:
      '[Récupérer une session checkout](/api/checkout-sessions/CheckoutSessionsController_findOne)',
  },
  CheckoutSessionsController_findOne: {
    whenToUse:
      'Interrogez ou affichez après redirection checkout, ou lors de notifications asynchrones indexées par ID de session.',
    related:
      '[Lister les transactions](/api/transactions/TransactionsController_findAll)',
  },
  CustomersController_create: {
    whenToUse:
      'Utilisez lorsque vous avez une identité client stable et souhaitez carte enregistrée, abonnements ou un historique de transactions propre.',
    related:
      '[Lister les clients](/api/customers/CustomersController_findAll) · [Mettre à jour un client](/api/customers/CustomersController_update)',
  },
  CustomersController_findOne: {
    whenToUse:
      'Utilisez pour afficher un profil client ou valider un ID avant checkout ou abonnement.',
    related:
      '[Lister les clients](/api/customers/CustomersController_findAll) · [Transactions client](/api/customers/CustomersController_getTransactions)',
  },
  CustomersController_getTransactions: {
    whenToUse:
      'Utilisez pour l’historique d’achats d’un client dans le support ou le portail marchand.',
    related:
      '[Récupérer un client](/api/customers/CustomersController_findOne) · [Lister les transactions](/api/transactions/TransactionsController_findAll)',
  },
  CustomersController_remove: {
    whenToUse:
      'Utilisez pour retirer un client du répertoire lorsque la conformité ou le support l’exige.',
    caveats:
      'La suppression peut être soumise à des contraintes de données liées ; vérifiez les réponses d’erreur métier.',
    related:
      '[Récupérer un client](/api/customers/CustomersController_findOne) · [Lister les clients](/api/customers/CustomersController_findAll)',
  },
  DiscountCouponsController_create: {
    whenToUse:
      'Utilisez pour lancer des promotions ou des remises ciblées par segment.',
    related:
      '[Récupérer un coupon](/api/coupons/DiscountCouponsController_findOne)',
  },
  DiscountCouponsController_getPerformance: {
    whenToUse:
      'Utilisez dans les tableaux de bord marketing pour mesurer l’efficacité d’une campagne.',
    related:
      '[Récupérer un coupon](/api/coupons/DiscountCouponsController_findOne)',
  },
  PaymentLinksController_create: {
    whenToUse:
      'Utilisez pour factures, vente sociale ou pages de paiement légères sans checkout complet.',
    related:
      '[Lister les liens de paiement](/api/payment-links/PaymentLinksController_findAll) · [Sessions checkout](/api/checkout-sessions/CheckoutSessionsController_create)',
  },
  PaymentRequestsController_create: {
    whenToUse:
      'Utilisez pour des demandes « payez cette facture » ou POS où le payeur confirme sur son appareil.',
    related:
      '[Récupérer une demande de paiement](/api/payment-requests/PaymentRequestsController_findOne) · [Transactions](/api/transactions/TransactionsController_findAll)',
  },
  PayoutsUnifiedController_create: {
    whenToUse:
      'Utilisez pour les mouvements de trésorerie depuis votre solde lomi.',
    caveats:
      'Les retraits self exigent payout_method_id ; les bénéficiaires Wave exigent recipient.name et recipient.phone (pas payout_method_id). Les rails Wave renvoient 400 avec une clé test, clés live uniquement. MTN renvoie 400 tant que non pris en charge.',
    related:
      '[Lister les retraits](/api/payouts/PayoutsUnifiedController_findAll) · [Vérifier le solde disponible](/api/balances/AccountsController_checkAvailableBalance)',
  },
  PayoutsUnifiedController_findAll: {
    whenToUse: 'Utilisez pour la réconciliation et le support.',
    related:
      '[Récupérer un retrait](/api/payouts/PayoutsUnifiedController_findOne)',
  },
  PayoutsUnifiedController_findOne: {
    whenToUse: 'Utilisez après création ou depuis les webhooks.',
    related: '[Créer un retrait](/api/payouts/PayoutsUnifiedController_create)',
  },
  ProductsController_addPrice: {
    whenToUse:
      'Utilisez pour un nouveau marché ou une deuxième option de facturation sur le même produit.',
    related: '[Récupérer un produit](/api/products/ProductsController_findOne)',
  },
  ProductsController_create: {
    whenToUse:
      'Utilisez lors de l’onboarding catalogue pour checkout, abonnements ou liens de paiement liés à des SKU.',
    related:
      '[Lister les produits](/api/products/ProductsController_findAll) · [Liens de paiement](/api/payment-links/PaymentLinksController_create)',
  },
  ProductsController_setDefaultPrice: {
    whenToUse:
      'Utilisez après avoir ajouté plusieurs prix pour définir le repli checkout et liens.',
    related:
      '[Ajouter un prix produit](/api/products/ProductsController_addPrice)',
  },
  RefundsController_create: {
    whenToUse:
      'Pour annuler tout ou partie d’un paiement éligible déjà terminé (remboursement total ou partiel).',
    caveats:
      '**Carte :** le crédit client sur le réseau carte est finalisé séparément par nos équipes. **Wave partiel :** nécessite un numéro de téléphone client enregistré (paiement bénéficiaire). **MTN (live) :** le paiement d’origine doit avoir une référence prestataire (UUID RequestToPay, `provider_checkout_id`) ; lomi. appelle l’API Disbursement MTN et interroge le statut jusqu’à complétion. **MTN (test) :** uniquement comptable; pas d’appel API MTN. Les remboursements partiels MTN exigent aussi un téléphone client. Pour les paiements liés à un abonnement, utilisez `subscription_action` (optionnel) : `default`, `cancel`, `pause` ou `none`. Un remboursement partiel ne modifie l’abonnement que si le cumul atteint le montant total de la transaction.',
    related:
      '[Lister les remboursements](/api/refunds/RefundsController_findAll) · [Récupérer une transaction](/api/transactions/TransactionsController_findOne) · [Remboursements](/build/money/refunds)',
  },
  RefundsController_findAll: {
    whenToUse: 'Utilisez pour réconciliation, support et tableaux de bord.',
    related:
      '[Récupérer un remboursement](/api/refunds/RefundsController_findOne)',
  },
  RefundsController_findOne: {
    whenToUse:
      'Utilisez après création ou depuis des flux webhook pour confirmer les détails.',
    related: '[Créer un remboursement](/api/refunds/RefundsController_create)',
  },
  SettlementsController_createInstant: {
    whenToUse:
      'Utilisez après un retrait Wave ou SPI (rail) ou pour débloquer un solde carte retenu (avance) lorsque Nitro est activé pour l’organisation.',
    caveats:
      'Le rail exige `payout_id`. L’avance est live uniquement, exclut les transactions en litige et échoue si le plafond d’organisation est dépassé. Ce n’est ni un prêt ni une assurance.',
    related:
      '[Récupérer un règlement instantané](/api/settlements/SettlementsController_getInstant) · [Créer un retrait](/api/payouts/PayoutsUnifiedController_create)',
  },
  SettlementsController_getInstant: {
    whenToUse:
      'Utilisez après `POST /settlements/instant` ou depuis un webhook pour confirmer le statut, les frais et le montant net.',
    related:
      '[Demander un règlement instantané](/api/settlements/SettlementsController_createInstant) · [Lister les périodes de règlement](/api/settlements/SettlementsController_findAll)',
  },
  SubscriptionsController_cancel: {
    whenToUse:
      'Utilisez pour arrêter la facturation récurrente à la fin de période ou immédiatement selon votre flux.',
    related:
      '[Récupérer un abonnement](/api/subscriptions/SubscriptionsController_findOne) · [Abonnements](/build/billing/subscriptions)',
  },
  CustomersController_getSubscriptions: {
    whenToUse:
      'Utilisez pour afficher les abonnements actifs d’un client dans le support ou le portail.',
    related:
      '[Récupérer un client](/api/customers/CustomersController_findOne) · [Abonnements](/build/billing/subscriptions)',
  },
  TransactionsController_findAll: {
    whenToUse:
      'Utilisez pour réconciliation, exports et corrélation avec les webhooks de paiement.',
    related:
      '[Récupérer une transaction](/api/transactions/TransactionsController_findOne) · [Transactions](/build/money/transactions)',
  },
  WebhookDeliveryLogsController_findAll: {
    whenToUse:
      'Utilisez pour diagnostiquer les échecs de livraison webhook et les retries.',
    related:
      '[Lister les webhooks](/api/webhooks/WebhooksController_findAll) · [Webhooks](/build/reliability)',
  },
  WebhooksController_update: {
    whenToUse:
      'Utilisez pour changer l’URL de destination, les événements écoutés ou la rotation de secret.',
    caveats:
      'Après rotation du secret, mettez à jour la vérification de signature côté serveur avant de désactiver l’ancien secret.',
    related:
      '[Créer un webhook](/api/webhooks/WebhooksController_create) · [Webhooks](/build/reliability)',
  },
  TransfersController_create: {
    whenToUse:
      'Utilisez pour les paiements séparés de lomi. Network : encaissez d’abord sur votre propre compte, puis payez le membre plus tard (après livraison, en fin de journée ou par lot).',
    caveats:
      'Clé secrète Opérateur **sans** `Lomi-Account`. `Idempotency-Key` obligatoire. Le premier appel renvoie `requires_confirmation: true` et un `confirmation_token` ; renvoyez la même requête avec ce jeton pour exécuter. La destination doit être une adhésion active avec `transfer.receive` pour l’environnement de la clé. Les soldes bougent en XOF.',
    related:
      '[Lister les transferts](/api/transfers/TransfersController_findAll) · [Annuler un transfert](/api/transfers/TransfersController_reverse) · [Guide lomi. Network](/build/platform/network#transferts)',
  },
  TransfersController_findAll: {
    whenToUse:
      'Utilisez pour la réconciliation par `transfer_group` ou `destination`, ou pour construire un relevé par membre. Filtrez par `transfer_type` pour isoler les frais ou les annulations.',
    related:
      '[Récupérer un transfert](/api/transfers/TransfersController_findOne) · [Créer un transfert](/api/transfers/TransfersController_create)',
  },
  TransfersController_findOne: {
    whenToUse:
      'Utilisez après création ou depuis un webhook `NETWORK_TRANSFER_CREATED` pour confirmer que le transfert a bien crédité le solde du membre.',
    related:
      '[Lister les transferts](/api/transfers/TransfersController_findAll) · [Annuler un transfert](/api/transfers/TransfersController_reverse)',
  },
  TransfersController_reverse: {
    whenToUse:
      'Utilisez quand un transfert séparé était trop élevé ou qu’une commande a été annulée après avoir payé le membre. Les remboursements sur paiements destination ou séparés annulent les transferts automatiquement (`reverse_transfer`).',
    caveats:
      'Le membre doit avoir assez de solde disponible pour couvrir l’annulation. `Idempotency-Key` obligatoire. Même confirmation en deux étapes (`confirmation_token`) que la création. Émet `NETWORK_TRANSFER_REVERSED`.',
    related:
      '[Créer un transfert](/api/transfers/TransfersController_create) · [Créer un remboursement](/api/refunds/RefundsController_create) · [Guide lomi. Network](/build/platform/network#remboursements-et-responsabilité)',
  },
  NetworkAccountsController_createLoginLink: {
    whenToUse:
      'Utilisez quand un membre clique sur « Ouvrir le tableau de bord lomi. » dans votre produit et que vous voulez l’amener directement sur son solde, ses versements ou ses exigences en attente, sans connexion séparée.',
    caveats:
      'Clé secrète Opérateur **sans** `Lomi-Account`. Nécessite la capacité `account.login_link` pour l’environnement de la clé et une adhésion active. Le lien est à usage unique et expire après 5 minutes : créez-le côté serveur au moment du clic puis redirigez ; ne l’envoyez jamais par e-mail, ne le journalisez pas et ne l’intégrez pas dans une page publique.',
    related:
      '[Créer une session de compte](/api/network/NetworkAccountsController_createAccountSession) · [Guide lomi. Network](/build/platform/network#tableau-de-bord-membre-et-liens-de-connexion)',
  },
  NetworkAccountsController_createAccountSession: {
    whenToUse:
      'Utilisez pour afficher les surfaces membre dans vos propres pages plutôt que d’envoyer les membres sur le tableau de bord lomi. Créez une nouvelle session à chaque chargement de page.',
    caveats:
      'Clé secrète Opérateur **sans** `Lomi-Account`. Nécessite `account.read` pour l’environnement de la clé et `member_dashboard` réglé sur `full` ou `member_mode` sur votre profil opérateur. `components` est un objet indexé par composant (`payments`, `payouts`, `balance`, `onboarding`, `notification_banner`) avec un indicateur `enabled` ; les composants omis sont activés. Le `client_secret` (`nas_...`) expire après 60 minutes ; n’exposez jamais votre clé Opérateur au navigateur.',
    related:
      '[Créer un lien de connexion](/api/network/NetworkAccountsController_createLoginLink) · [Guide lomi. Network](/build/platform/network#composants-intégrés)',
  },
};
