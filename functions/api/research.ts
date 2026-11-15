import { handleResearchRequest } from '../../packages/research/src/index';

export async function onRequest({
  request,
  env,
}: {
  request: Request;
  env: { OPENALEX_API_KEY?: string };
}): Promise<Response> {
  return handleResearchRequest(request, { openAlexApiKey: env.OPENALEX_API_KEY });
}
