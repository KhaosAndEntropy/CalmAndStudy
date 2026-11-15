import { handleResearchRequest } from '../../../packages/research/src/index';

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  return handleResearchRequest(request);
}
