# lomi. API Reference (Generated)

Auto-generated from OpenAPI. Do not edit manually.

Base URLs:
- Production: `https://api.lomi.africa`
- Sandbox: `https://sandbox.api.lomi.africa`

- `GET /accounts`: Lister les comptes
- `GET /accounts/balance`: Solde du compte
- `GET /accounts/balance/breakdown`: Détail du solde
- `GET /accounts/balance/{currency}`: Vérifier le solde disponible
- `GET /accounts/{id}`: Obtenir un compte par ID
- `GET /agent/capabilities`: Négociation des capacités de l'agent (surface de découverte non authentifiée)
- `GET /agent/events`: Flux Server-Sent Events (limité à l'organisation, signaux de maintien de connexion)
- `POST /agent/handoff`: Transfert inter-services / inter-agents (contexte + enveloppe de tâche)
- `GET /agent/handoff/{id}`: Récupérer un enregistrement de transfert
- `GET /agent/subscriptions`: Lister les abonnements de l'agent
- `POST /agent/subscriptions`: S'inscrire aux notifications adaptées à l'agent (MVP : registre en mémoire + ping de test SSE)
- `DELETE /agent/subscriptions/{id}`: Supprimer un abonnement
- `POST /agent/workflows`: Démarrer un workflow multi-étapes (MVP, idempotence sur idempotency_key)
- `GET /agent/workflows/{runId}`: Obtenir l'état d'une exécution de workflow
- `PATCH /agent/workflows/{runId}/steps/{stepId}`: Faire avancer une étape du workflow (primitive d'orchestration)
- `POST /payouts`: Créer un virement (self ou beneficiary)
- `GET /payouts`: Lister les virements
- `GET /payouts/{id}`: Obtenir un virement
- `POST /charge/mtn`: Lancer un encaissement direct MTN
- `POST /charge/wave`: Lancer un encaissement direct Wave
- `GET /checkout-sessions`: Lister les sessions de paiement
- `POST /checkout-sessions`: Créer une session de paiement
- `GET /checkout-sessions/{id}`: Obtenir une session de paiement par ID
- `GET /customers`: Lister les clients
- `POST /customers`: Créer un client
- `DELETE /customers/{id}`: Supprimer un client
- `GET /customers/{id}`: Obtenir un client par ID
- `PATCH /customers/{id}`: Mettre à jour un client
- `GET /customers/{id}/portal-audit`: Hosted customer portal audit
- `POST /customers/{id}/portal`: Créer une session de lancement du portail client
- `GET /customers/{id}/transactions`: Transactions du client
- `GET /coupons`: Lister les coupons
- `POST /coupons`: Créer un coupon
- `GET /coupons/{id}`: Obtenir un coupon par ID
- `GET /coupons/{id}/performance`: Indicateurs de performance du coupon
- `GET /merchants/{id}`: Get merchant details
- `GET /merchants/{id}/arr`: Get merchant ARR
- `GET /merchants/{id}/balance`: Get merchant account balance for a currency
- `GET /merchants/{id}/mrr`: Get merchant MRR
- `GET /organizations`: Détails de l'organisation
- `GET /organizations/metrics`: Indicateurs de l'organisation
- `GET /organizations/radar-settings`: Paramètres Radar
- `GET /organizations/{id}`: Organisation par ID
- `POST /charge/card`: Encaissement carte embarqué (client_secret)
- `GET /charge/card/{id}`: Récupérer un encaissement carte
- `POST /charge/card/{id}/cancel`: Annuler un encaissement carte
- `POST /charge/card/{id}/capture`: Capturer un blocage carte
- `POST /charge/card/{id}/increment`: Augmenter un blocage carte
- `GET /payment-links`: Lister les liens de paiement
- `POST /payment-links`: Créer un lien de paiement
- `GET /payment-links/{id}`: Obtenir un lien de paiement par ID
- `GET /payment-requests`: Lister les demandes de paiement
- `POST /payment-requests`: Créer une demande de paiement
- `GET /payment-requests/{id}`: Obtenir une demande de paiement par ID
- `POST /payouts`: Créer un virement (self ou beneficiary)
- `GET /payouts`: Lister les virements
- `GET /products`: Lister les produits
- `POST /products`: Créer un produit
- `GET /products/{id}`: Obtenir un produit par ID
- `POST /products/{id}/prices`: Ajouter un prix à un produit
- `POST /products/{id}/prices/{priceId}/default`: Définir le prix par défaut
- `GET /providers`: List payment providers
- `POST /refunds`: Créer un remboursement
- `GET /refunds`: Lister les remboursements
- `GET /refunds/{id}`: Obtenir un remboursement
- `GET /subscriptions`: Lister les abonnements
- `GET /customers/{id}/subscriptions`: Abonnements d’un client
- `GET /subscriptions/{id}`: Obtenir un abonnement par ID
- `PATCH /subscriptions/{id}`: Mettre à jour un abonnement
- `POST /subscriptions/{id}/cancel`: Résilier un abonnement
- `POST /subscriptions/{id}/resume`: Annuler une résiliation planifiée
- `GET /subscriptions/{id}/usage`: Usage d’un abonnement
- `GET /transactions`: Lister les transactions
- `GET /transactions/{id}`: Obtenir une transaction par ID
- `GET /webhooks/deliveries`: Lister les journaux de livraison
- `GET /webhooks/deliveries/{id}`: Obtenir un journal de livraison par ID
- `GET /webhooks`: Lister les webhooks
- `POST /webhooks`: Créer un webhook
- `DELETE /webhooks/{id}`: Supprimer un webhook
- `GET /webhooks/{id}`: Obtenir un webhook par ID
- `PATCH /webhooks/{id}`: Mettre à jour un webhook
- `POST /webhooks/{id}/test`: Envoyer un événement test au webhook
- `POST /webhooks/{id}/deliveries/{deliveryId}/retry`: Relancer une livraison webhook

Full docs: https://docs.lomi.africa/api

## CLI examples

```bash
# Headless checkout
lomi checkout create --amount 10000 --currency XOF \
  --success-url https://example.com/success \
  --cancel-url https://example.com/cancel --json

# Card deposit
lomi charges hold --amount 100000 --currency XOF --email client@example.com --name "Awa Ndiaye" --json
lomi charges raise pi_123 --amount 150000 --json
lomi charges capture pi_123 --amount 25000 --json
lomi charges release pi_123 --json

# Refund
lomi refunds create --transaction-id <uuid> --amount 5000 --json

# List transactions
lomi transactions list --limit 10 --json
```
