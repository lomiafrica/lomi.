import spec from '../../openapi.json';

export const revalidate = 3600;

export async function GET() {
  return Response.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
