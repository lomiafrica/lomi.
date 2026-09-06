/* @proprietary license */

import type { Language } from './config';

type LocaleStringTable = { [key: string]: string };
type TranslationsByLanguage = { [L in Language]: LocaleStringTable };

const STRINGS: TranslationsByLanguage = {
  en: {
    'search.all': 'All',
    'search.core': 'Core',
    'search.fundamentalsDescription': 'Introduction and fundamentals',
    'search.apiReference': 'API',
    'search.apiReferenceDescription': 'API guides and resources',
    'search.filter': 'Filter',
    'search.search': 'Search',
    'search.resources': 'Resources',
    'search.resourcesDescription':
      'Support, pricing, policies, and contributing',
    'search.allDescription': 'Every docs page',
    'ui.searchNoResult': 'No results found',
    'ui.toc': 'On this page',
    'ui.tocNoHeadings': 'No headings',
    'ui.lastUpdate': 'Last updated on',
    'ui.chooseLanguage': 'Choose a language',
    'ui.nextPage': 'Next page',
    'ui.previousPage': 'Previous page',
    'ui.chooseTheme': 'Theme',
    'ui.editOnGithub': 'Edit on GitHub',
    'ui.notFound': 'This page could not be found',
    'ui.notFoundTitle': 'This page could not be found',
    'ui.notFoundDescription':
      'The link may be wrong, or what you were looking for may have been removed.',
    'ui.notFoundHome': 'Home',
    'ui.errorTitle': 'Something went wrong',
    'ui.errorDescription':
      'An unexpected error occurred while loading this page. Please try again.',
    'ui.errorHome': 'Home',
    'ui.errorRetry': 'Try again',
    'section.start': 'Start',
    'section.build': 'Build',
    'section.resources': 'Resources',
    'section.firstSteps': 'First steps',
    'section.apiReference': 'API reference',
    'section.restApi': 'API',
    'surface.api': 'API',
    'surface.sdk': 'SDK',
    'surface.cli': 'CLI',
    'surface.mcp': 'MCP',
    'surface.groupAria': 'How to use lomi.',
    'section.basics': 'Basics',
    'section.implementation': 'Implementation',
    'section.community': 'Community',
    'section.management': 'Management',
    'sectionDescription.start':
      'Understand lomi., create your account, get API keys, make a test payment, and go live.',
    'sectionDescription.build':
      'Choose an integration path and build checkout, payment links, subscriptions, webhooks, and tools.',
    'sectionDescription.resources':
      'Support, merchant policies, open-source material, and contributor documentation.',
    'sectionDescription.firstSteps':
      'Developers use lomi. to reliably accept payments in West Africa.',
    'sectionDescription.apiReference':
      'Complete reference to building with lomi. API.',
    'sectionDescription.restApi': 'Payment and commerce endpoints.',
    'footer.company_disclaimer':
      '<p>This documentation describes the lomi. merchant API and related products.</p>\n\n<p>Integration behavior can change; use the generated OpenAPI reference and your dashboard for authoritative details.</p>',
    'components.business_outreach.message':
      'Building payments for West Africa? Book a short call with the team.',
    'components.business_outreach.reach_out': 'Schedule a call',
    'components.business_outreach.dismiss': 'Dismiss',
    'docs.shell.openNav': 'Open navigation',
    'docs.shell.closeNav': 'Close navigation',
    'docs.shell.sectionNav': 'Documentation section',
    'mcpConnect.addCursor': 'Add to Cursor',
    'mcpConnect.addGrok': 'Add to Grok Bot',
    'mcpConnect.addClaude': 'Add to Claude',
    'mcpConnect.addOpenCode': 'Add to OpenCode',
    'mcpConnect.addCodex': 'Add to Codex',
    'mcpConnect.commandCopied': 'Command copied',
    'mcpConnect.urlCopied': 'MCP URL copied',
    'mcpConnect.grokUrlCopied':
      'MCP URL copied. Paste it as a custom connector in Grok Bot.',
    'mcpConnect.copyFailed': 'Could not copy. Use the CLI commands below.',
    'twins.mcp': 'Same operation in MCP',
    'twins.rest': 'Same operation in the API',
    'twins.action': 'action',
    'mcpIndex.action': 'Action',
    'mcpIndex.rest': 'API',
    'mcpIndex.noRestPage': 'No public API page',
    'tryit.loading': 'Loading Try-it preferences…',
    'tryit.connect': 'Connect from the dashboard',
    'tryit.connectHint': 'to try the API with a least-privilege docs session.',
    'tryit.noTestKey':
      'No active test secret key found for your account. Create one in the dashboard Developers section, then refresh this page.',
    'tryit.organization': 'Organization',
    'tryit.selectOrganization': 'Select organization…',
    'tryit.chooseOrganization': 'Choose…',
    'tryit.attachKey': 'Attach my test secret key automatically',
    'tryit.proxyHint':
      'When the playground does not send X-API-Key, the proxy adds your test secret for this organization. You can still override by entering a key manually.',
    'tryit.summary': 'Try this request in the sandbox',
    'tryit.send': 'Send to sandbox',
    'tryit.sending': 'Sending…',
    'tryit.body': 'Request body',
    'tryit.pathParams': 'Path parameters',
    'support.intro':
      'Send a product or integration question. We reply by email.',
    'support.securityIntro':
      'Describe the issue, impact, and how to reproduce. Do not include live customer data.',
    'support.name': 'Name',
    'support.email': 'Email',
    'support.topic': 'Topic',
    'support.topic.general': 'General',
    'support.topic.billing': 'Billing',
    'support.topic.integration': 'Integration',
    'support.topic.abuse': 'Abuse',
    'support.affectedUrl': 'Affected URL (optional)',
    'support.message': 'Message',
    'support.submit': 'Send',
    'support.submitting': 'Sending…',
    'support.successTitle': 'Message sent',
    'support.successBody':
      'Thanks. Quote {reference} if you follow up by email.',
    'support.noReference': 'your request',
    'support.error':
      'Could not send. Check the fields and try again, or email hello@lomi.africa.',
    'support.errorVerification':
      'Complete the verification check and try again.',
    'tier.signedIn': 'Your plan',
    'tier.starter': 'Starter (volume-tiered)',
    'tier.growth': 'Growth (volume-tiered)',
    'tier.professional': 'Professional (volume-tiered)',
    'tier.enterprise': 'Enterprise (volume-tiered)',
    'tier.fixed': 'Fixed pricing',
    'tier.unknown': 'Signed in. Open Billing in the dashboard for live rates.',
    'tier.custom':
      'Custom pricing. Dashboard Billing shows your negotiated schedule.',
    'tier.dashboard': 'Confirm live rates in Billing → Pricing.',
    'tier.mobileMoney': 'Mobile Money',
    'tier.cards': 'Cards',
  },
  fr: {
    'search.all': 'Tout',
    'search.core': 'Socle',
    'search.fundamentalsDescription': 'Introduction et fondamentaux',
    'search.apiReference': 'API',
    'search.apiReferenceDescription': 'Guides et ressources API',
    'search.filter': 'Filtrer',
    'search.search': 'Rechercher',
    'search.resources': 'Ressources',
    'search.resourcesDescription':
      'Support, tarifs, politiques et contribution',
    'search.allDescription': 'Toutes les pages',
    'ui.searchNoResult': 'Aucun résultat',
    'ui.toc': 'Sur cette page',
    'ui.tocNoHeadings': 'Aucun titre',
    'ui.lastUpdate': 'Dernière mise à jour le',
    'ui.chooseLanguage': 'Choisir la langue',
    'ui.nextPage': 'Page suivante',
    'ui.previousPage': 'Page précédente',
    'ui.chooseTheme': 'Thème',
    'ui.editOnGithub': 'Modifier sur GitHub',
    'ui.notFound': 'Cette page est introuvable',
    'ui.notFoundTitle': 'Cette page est introuvable',
    'ui.notFoundDescription':
      'Le lien est peut-être incorrect, ou la page a été déplacée.',
    'ui.notFoundHome': 'Accueil',
    'ui.errorTitle': "Une erreur s'est produite",
    'ui.errorDescription':
      "Une erreur inattendue s'est produite au chargement de cette page. Veuillez réessayer.",
    'ui.errorHome': 'Accueil',
    'ui.errorRetry': 'Réessayer',
    'section.start': 'Démarrer',
    'section.build': 'Construire',
    'section.resources': 'Ressources',
    'section.firstSteps': 'Premiers pas',
    'section.apiReference': 'Référence API',
    'section.restApi': 'API',
    'surface.api': 'API',
    'surface.sdk': 'SDK',
    'surface.cli': 'CLI',
    'surface.mcp': 'MCP',
    'surface.groupAria': 'Comment utiliser lomi.',
    'section.basics': 'Bases',
    'section.implementation': 'Mise en œuvre',
    'section.community': 'Communauté',
    'section.management': 'Gestion',
    'sectionDescription.start':
      'Comprendre lomi., créer un compte, obtenir des clés API, faire un paiement de test et passer en production.',
    'sectionDescription.build':
      'Choisir une intégration, puis mettre en place le checkout, les liens de paiement, les abonnements, les webhooks et les outils.',
    'sectionDescription.resources':
      'Support, règles marchandes, open source et documentation contributeur.',
    'sectionDescription.firstSteps':
      "Les développeurs utilisent lomi. pour encaisser des paiements en toute fiabilité en Afrique de l'Ouest.",
    'sectionDescription.apiReference':
      "Référence complète pour intégrer l'API lomi.",
    'sectionDescription.restApi': 'Endpoints de paiement et de commerce.',
    'footer.company_disclaimer':
      "<p>Cette documentation décrit l'API marchande lomi. et les produits associés.</p>\n\n<p>Le comportement d'intégration peut évoluer ; consultez l'OpenAPI générée et votre tableau de bord pour les détails de référence.</p>",
    'components.business_outreach.message':
      'Vous construisez des paiements en Afrique de l’Ouest ? Prenez un court rendez-vous avec l’équipe.',
    'components.business_outreach.reach_out': 'Planifier un appel',
    'components.business_outreach.dismiss': 'Fermer',
    'docs.shell.openNav': 'Ouvrir la navigation',
    'docs.shell.closeNav': 'Fermer la navigation',
    'docs.shell.sectionNav': 'Section de la documentation',
    'mcpConnect.addCursor': 'Ajouter à Cursor',
    'mcpConnect.addGrok': 'Ajouter à Grok Bot',
    'mcpConnect.addClaude': 'Ajouter à Claude',
    'mcpConnect.addOpenCode': 'Ajouter à OpenCode',
    'mcpConnect.addCodex': 'Ajouter à Codex',
    'mcpConnect.commandCopied': 'Commande copiée',
    'mcpConnect.urlCopied': 'URL MCP copiée',
    'mcpConnect.grokUrlCopied':
      'URL MCP copiée. Collez-la comme connecteur personnalisé dans Grok Bot.',
    'mcpConnect.copyFailed':
      'Impossible de copier. Utilisez les commandes CLI ci-dessous.',
    'twins.mcp': 'Même opération en MCP',
    'twins.rest': 'Même opération dans l’API',
    'twins.action': 'action',
    'mcpIndex.action': 'Action',
    'mcpIndex.rest': 'API',
    'mcpIndex.noRestPage': 'Pas de page API publique',
    'tryit.loading': 'Chargement des préférences Try-it…',
    'tryit.connect': 'Connectez-vous depuis le tableau de bord',
    'tryit.connectHint':
      'pour essayer l’API avec une session docs à privilèges minimaux.',
    'tryit.noTestKey':
      'Aucune clé secrète de test active pour votre compte. Créez-en une dans la section Développeurs du tableau de bord, puis actualisez cette page.',
    'tryit.organization': 'Organisation',
    'tryit.selectOrganization': 'Choisir une organisation…',
    'tryit.chooseOrganization': 'Choisir…',
    'tryit.attachKey': 'Joindre automatiquement ma clé secrète de test',
    'tryit.proxyHint':
      'Si le playground n’envoie pas X-API-Key, le proxy ajoute votre secret de test pour cette organisation. Vous pouvez toujours saisir une clé manuellement.',
    'tryit.summary': 'Essayer cette requête dans le sandbox',
    'tryit.send': 'Envoyer au sandbox',
    'tryit.sending': 'Envoi…',
    'tryit.body': 'Corps de la requête',
    'tryit.pathParams': 'Paramètres de chemin',
    'support.intro':
      'Envoyez une question produit ou d’intégration. Réponse par e-mail.',
    'support.securityIntro':
      'Décrivez le problème, l’impact et la reproduction. N’incluez pas de données clients live.',
    'support.name': 'Nom',
    'support.email': 'E-mail',
    'support.topic': 'Sujet',
    'support.topic.general': 'Général',
    'support.topic.billing': 'Facturation',
    'support.topic.integration': 'Intégration',
    'support.topic.abuse': 'Abus',
    'support.affectedUrl': 'URL concernée (optionnel)',
    'support.message': 'Message',
    'support.submit': 'Envoyer',
    'support.submitting': 'Envoi…',
    'support.successTitle': 'Message envoyé',
    'support.successBody':
      'Merci. Indiquez {reference} si vous relancez par e-mail.',
    'support.noReference': 'votre demande',
    'support.error':
      'Envoi impossible. Vérifiez les champs ou écrivez à hello@lomi.africa.',
    'support.errorVerification': 'Terminez la vérification, puis réessayez.',
    'tier.signedIn': 'Votre offre',
    'tier.starter': 'Starter (par volume)',
    'tier.growth': 'Growth (par volume)',
    'tier.professional': 'Professional (par volume)',
    'tier.enterprise': 'Enterprise (par volume)',
    'tier.fixed': 'Tarification fixe',
    'tier.unknown':
      'Connecté. Ouvrez Facturation dans le tableau de bord pour les tarifs live.',
    'tier.custom':
      'Tarification sur mesure. La page Facturation du tableau de bord affiche votre grille.',
    'tier.dashboard':
      'Confirmez les tarifs live dans Facturation → Tarification.',
    'tier.mobileMoney': 'Mobile Money',
    'tier.cards': 'Cartes',
  },
};

function interpolate(
  template: string,
  values?: Record<string, string | number | undefined>,
): string {
  if (!values) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    values[key] !== undefined && values[key] !== null
      ? String(values[key])
      : '',
  );
}

export function translate(
  key: string,
  lang: Language,
  values?: Record<string, string | number | undefined>,
): string {
  const primary = STRINGS[lang]?.[key];
  const fallback = STRINGS.en[key];
  const raw = primary ?? fallback ?? key;
  return interpolate(raw, values);
}

/** @deprecated Prefer `translate`; kept for call sites that pass `(key, lang)`. */
export function t(
  key: string,
  lang: Language,
  values?: Record<string, string | number | undefined>,
): string {
  return translate(key, lang, values);
}
