'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@lomi./ui/button';
import { cn } from '@lomi./ui/cn';
import { useTranslation } from '@/lib/utils/translation-context';
import { t as translate } from '@/lib/i18n/translations';
import { useDocsTurnstile } from '@/components/docs/use-docs-turnstile';

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitState = 'idle' | 'pending' | 'success' | 'error';

export type DocsSupportFormKind = 'contact' | 'security';

const CONTACT_TOPICS = ['general', 'billing', 'integration', 'abuse'] as const;

type ContactTopic = (typeof CONTACT_TOPICS)[number];

const CARD_CLASS =
  'docs-support-form not-prose my-6 w-full rounded-[11px] border border-[color:var(--docs-hairline)] bg-[var(--docs-well)] p-6 shadow-none sm:p-8';

const FIELD_CLASS =
  'h-10 w-full rounded-[9px] px-3 text-[13px] outline-none disabled:cursor-not-allowed disabled:opacity-50';

export function DocsContactForm() {
  return <DocsSupportForm kind="contact" />;
}

export function DocsSecurityForm() {
  return <DocsSupportForm kind="security" />;
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn('block min-w-0', className)}>
      <span className="mb-1.5 block text-[13px] text-fd-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function DocsSupportForm({ kind }: { kind: DocsSupportFormKind }) {
  const { currentLanguage } = useTranslation();
  const t = (key: string) => translate(key, currentLanguage);
  const honeypotId = useId();
  const action = kind === 'security' ? 'security_contact' : 'support_contact';
  const { siteKey, turnstileRef, turnstileToken, resetTurnstile } =
    useDocsTurnstile(action);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<ContactTopic>('general');
  const [affectedUrl, setAffectedUrl] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [reference, setReference] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<
    'support.error' | 'support.errorVerification'
  >('support.error');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (
      !trimmedName ||
      !EMAIL_OK.test(trimmedEmail) ||
      trimmedMessage.length < 10
    ) {
      setErrorKey('support.error');
      setSubmitState('error');
      return;
    }

    if (siteKey && !turnstileToken) {
      setErrorKey('support.errorVerification');
      setSubmitState('error');
      return;
    }

    setSubmitState('pending');

    try {
      const res = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          topic: kind === 'security' ? 'security' : topic,
          message: trimmedMessage,
          fileReference: affectedUrl.trim() || undefined,
          locale: currentLanguage,
          turnstileToken: turnstileToken || undefined,
          website: honeypot,
        }),
      });

      const body = (await res.json().catch(() => null)) as {
        reference?: string;
        error?: string;
      } | null;

      if (!res.ok) {
        setErrorKey(
          body?.error === 'Verification failed'
            ? 'support.errorVerification'
            : 'support.error',
        );
        setSubmitState('error');
        resetTurnstile();
        return;
      }

      setReference(body?.reference ?? null);
      setSubmitState('success');
      setName('');
      setEmail('');
      setTopic('general');
      setAffectedUrl('');
      setMessage('');
      resetTurnstile();
    } catch {
      setErrorKey('support.error');
      setSubmitState('error');
      resetTurnstile();
    }
  }

  if (submitState === 'success') {
    return (
      <div className={CARD_CLASS}>
        <p className="text-[15px] font-medium text-fd-foreground">
          {t('support.successTitle')}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-fd-muted-foreground">
          {t('support.successBody').replace(
            '{reference}',
            reference ?? t('support.noReference'),
          )}
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setSubmitState('idle');
            setReference(null);
          }}
        >
          {t('support.submit')}
        </Button>
      </div>
    );
  }

  const pending = submitState === 'pending';

  return (
    <form onSubmit={onSubmit} className={CARD_CLASS}>
      <p className="text-[13px] leading-relaxed text-fd-muted-foreground">
        {kind === 'security' ? t('support.securityIntro') : t('support.intro')}
      </p>
      {submitState === 'error' ? (
        <p className="mt-3 text-[13px] text-red-600 dark:text-red-400">
          {t(errorKey)}
        </p>
      ) : null}

      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <label htmlFor={honeypotId}>Website</label>
        <input
          id={honeypotId}
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label={t('support.name')}>
          <input
            className={FIELD_CLASS}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
            disabled={pending}
          />
        </Field>
        <Field label={t('support.email')}>
          <input
            type="email"
            className={FIELD_CLASS}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={pending}
          />
        </Field>
        {kind === 'contact' ? (
          <Field label={t('support.topic')} className="sm:col-span-2">
            <span className="docs-support-select relative block overflow-hidden">
              <select
                className={`${FIELD_CLASS} cursor-pointer appearance-none bg-transparent pe-12`}
                value={topic}
                disabled={pending}
                onChange={(event) =>
                  setTopic(event.target.value as ContactTopic)
                }
              >
                {CONTACT_TOPICS.map((value) => (
                  <option key={value} value={value}>
                    {t(`support.topic.${value}`)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 end-5 size-4 -translate-y-1/2 text-stone-400 dark:text-stone-500"
                aria-hidden
              />
            </span>
          </Field>
        ) : (
          <Field label={t('support.affectedUrl')} className="sm:col-span-2">
            <input
              type="url"
              className={FIELD_CLASS}
              value={affectedUrl}
              onChange={(event) => setAffectedUrl(event.target.value)}
              autoComplete="url"
              disabled={pending}
            />
          </Field>
        )}
        <Field label={t('support.message')} className="sm:col-span-2">
          <textarea
            required
            minLength={10}
            maxLength={8000}
            rows={6}
            value={message}
            disabled={pending}
            onChange={(event) => setMessage(event.target.value)}
            className={`${FIELD_CLASS} h-auto min-h-[9rem] resize-y py-2.5`}
          />
        </Field>
      </div>

      {siteKey ? (
        <div className="mt-5 flex w-full justify-end">
          <div
            ref={turnstileRef}
            className="docs-turnstile-mount min-h-[65px] w-fit max-w-full"
          />
        </div>
      ) : null}

      <div className={siteKey ? 'mt-4' : 'mt-6'}>
        <Button type="submit" disabled={pending}>
          {pending ? t('support.submitting') : t('support.submit')}
        </Button>
      </div>
    </form>
  );
}
