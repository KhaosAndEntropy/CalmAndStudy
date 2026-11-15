export type SubmissionKind = 'topic' | 'review' | 'sources';

export interface SubmissionRequest {
  id: string;
  kind: SubmissionKind;
  payload: Record<string, unknown>;
}

export interface SubmissionReceipt {
  ok: true;
  id: string;
  status?: 'pending';
  duplicate?: boolean;
  remainingToday?: number;
}

export class SubmissionError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    readonly retryAt?: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'SubmissionError';
  }
}

export async function postSubmission(
  endpoint: string,
  submission: SubmissionRequest,
): Promise<SubmissionReceipt> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(submission),
    });
  } catch {
    throw new SubmissionError(
      'Não foi possível conectar à Calm & Study. A sugestão continua guardada neste dispositivo.',
      'network_error',
    );
  }

  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = await response.json();
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed))
      body = parsed as Record<string, unknown>;
  } catch {
    /* Some proxies may return a non-JSON error response. */
  }

  if (!response.ok) {
    throw new SubmissionError(
      typeof body.error === 'string'
        ? body.error
        : 'Não foi possível registrar agora. A sugestão continua guardada neste dispositivo.',
      typeof body.code === 'string' ? body.code : undefined,
      typeof body.retryAt === 'string' ? body.retryAt : undefined,
      response.status,
    );
  }
  return {
    ok: true,
    id: submission.id,
    status: body.status === 'pending' ? 'pending' : undefined,
    duplicate: body.duplicate === true,
    remainingToday: typeof body.remainingToday === 'number' ? body.remainingToday : undefined,
  };
}
