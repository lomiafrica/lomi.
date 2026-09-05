/* @proprietary license */

'use client';

import {
  StatusPage,
  StatusPageActionLink,
} from '@lomi./ui/status-page';

type NotFoundPageProps = {
  title: string;
  description: string;
  homeLabel: string;
};

export function NotFoundPage({
  title,
  description,
  homeLabel,
}: NotFoundPageProps) {
  return (
    <StatusPage
      code="404"
      title={title}
      description={description}
      actions={
        <StatusPageActionLink href="/start/overview">{homeLabel}</StatusPageActionLink>
      }
    />
  );
}
