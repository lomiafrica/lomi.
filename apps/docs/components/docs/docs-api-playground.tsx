/* @proprietary license */

'use client';

import { useMemo, useState } from 'react';
import { t as translate } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/utils/translation-context';
import { useDocsWorkspace } from '@/lib/docs/workspace-context';
import {
  resolvePathTemplate,
  type TryItOperation,
} from '@/lib/openapi/operation-tryit';

type DocsApiPlaygroundClientProps = {
  operation: TryItOperation;
};

export function DocsApiPlaygroundClient({
  operation,
}: DocsApiPlaygroundClientProps) {
  const { currentLanguage } = useTranslation();
  const t = (key: string) => translate(key, currentLanguage);
  const workspace = useDocsWorkspace();
  const [paramValues, setParamValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(operation.pathParams.map((name) => [name, ''])),
  );
  const [body, setBody] = useState(operation.exampleBody ?? '{\n  \n}');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const missingParams = useMemo(
    () => operation.pathParams.filter((name) => !paramValues[name]?.trim()),
    [operation.pathParams, paramValues],
  );

  const canSend =
    workspace.ready && workspace.canSendSandbox && missingParams.length === 0;

  const send = async () => {
    if (!canSend) return;
    setPending(true);
    setResult(null);
    setStatus(null);
    try {
      const resolvedPath = resolvePathTemplate(operation.path, paramValues);
      const target = `${operation.sandboxOrigin}${resolvedPath}`;
      const init: {
        method: string;
        credentials: 'include';
        cache: 'no-store';
        headers?: { 'Content-Type': string };
        body?: string;
      } = {
        method: operation.method.toUpperCase(),
        credentials: 'include',
        cache: 'no-store',
      };
      if (operation.hasBody) {
        init.headers = { 'Content-Type': 'application/json' };
        init.body = body;
      }
      const response = await fetch(
        `/api/proxy?url=${encodeURIComponent(target)}`,
        init,
      );
      const text = await response.text();
      setStatus(`${response.status} ${response.statusText}`);
      setResult(text);
    } catch (error) {
      setStatus('error');
      setResult(error instanceof Error ? error.message : String(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="docs-api-playground">
      <p className="docs-api-playground-endpoint">
        <span className="docs-api-playground-method">
          {operation.method.toUpperCase()}
        </span>
        <code>
          {operation.sandboxOrigin}
          {operation.path}
        </code>
      </p>
      {operation.pathParams.length > 0 ? (
        <div className="docs-api-playground-fields">
          <p className="docs-api-playground-label">{t('tryit.pathParams')}</p>
          {operation.pathParams.map((name) => (
            <label key={name} className="docs-api-playground-param">
              <span>{name}</span>
              <input
                value={paramValues[name] ?? ''}
                onChange={(event) =>
                  setParamValues((current) => ({
                    ...current,
                    [name]: event.target.value,
                  }))
                }
                autoComplete="off"
              />
            </label>
          ))}
        </div>
      ) : null}
      {operation.hasBody ? (
        <label className="docs-api-playground-body">
          <span className="docs-api-playground-label">{t('tryit.body')}</span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={10}
            spellCheck={false}
          />
        </label>
      ) : null}
      {canSend ? (
        <button
          type="button"
          className="docs-api-playground-send"
          onClick={() => void send()}
          disabled={pending}
        >
          {pending ? t('tryit.sending') : t('tryit.send')}
        </button>
      ) : null}
      {status ? (
        <pre className="docs-api-playground-result">
          <strong>{status}</strong>
          {'\n'}
          {result}
        </pre>
      ) : null}
    </div>
  );
}
