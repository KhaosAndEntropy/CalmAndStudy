/** Contrato editorial para artigos pesquisados, documentados e revisados. */
export type EvidenceRelation = 'supports' | 'qualifies' | 'contradicts';
export type ClaimKind = 'established' | 'interpretation' | 'hypothesis' | 'debate';
export type PublicationStatus =
  'draft' | 'researching' | 'needs-review' | 'approved' | 'published' | 'needs-update';
export type SourceKind =
  'primary' | 'peer-reviewed' | 'institutional' | 'textbook' | 'reference' | 'journalism' | 'other';

/** Meta inicial de produção editorial; não é um limite técnico de publicação. */
export const editorialCadence = { monthlyPublicationTarget: 20, weeklyTarget: 5 } as const;

export interface EvidenceReference {
  sourceId: string;
  relation: EvidenceRelation;
  /** Trecho curto que sustenta ou qualifica a afirmação, no idioma da fonte. */
  excerpt: string;
  locator?: string;
  accessedAt: string;
}

export interface ResearchClaim {
  id: string;
  text: string;
  kind: ClaimKind;
  evidence: EvidenceReference[];
  uncertainty?: string;
}

export interface ResearchSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: SourceKind;
  authors?: string[];
  publishedAt?: string;
  accessedAt: string;
  doi?: string;
  license?: string;
  /** Relações de dependência conhecidas; ajuda a não contar republicações como fontes independentes. */
  dependsOn?: string[];
  /** Grupo editorial independente: instituições irmãs ou republicações devem compartilhar o grupo. */
  independenceGroup?: string;
  /** Evidência de consulta manual recente ao texto integral e às condições de acesso. */
  accessCheck?: {
    checkedAt: string;
    httpStatus: number;
    fullTextOpenAccess: boolean;
    paywall: boolean;
  };
}

export interface ConfidenceAssessment {
  method: 'calmandstudy-confidence-v1';
  score: number;
  assessedAt: string;
  assessedBy: string;
  dimensions: {
    claimCoverage: number;
    evidenceQuality: number;
    sourceIndependence: number;
    sourceAgreement: number;
    timeliness: number;
    uncertaintyDisclosure: number;
  };
  rationale: string;
  limitations: string[];
}

export type ConfidenceDimensions = ConfidenceAssessment['dimensions'];

export function calculateConfidenceScore(dimensions: ConfidenceDimensions): number {
  const weighted = Object.entries(confidenceMethod.weights).reduce((total, [key, weight]) => {
    return total + dimensions[key as keyof ConfidenceDimensions] * weight;
  }, 0);
  return Math.round(weighted / 100);
}

export interface EditorialRecord {
  schemaVersion: 1;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt?: string;
  modelAssistance?: {
    provider: string;
    model: string;
    promptVersion?: string;
    generatedAt: string;
  };
  claims: ResearchClaim[];
  sources: ResearchSource[];
  assessment?: ConfidenceAssessment;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export const confidenceMethod = {
  id: 'calmandstudy-confidence-v1' as const,
  label: 'Índice editorial Estude com Calma v1',
  weights: {
    claimCoverage: 25,
    evidenceQuality: 25,
    sourceIndependence: 20,
    sourceAgreement: 15,
    timeliness: 5,
    uncertaintyDisclosure: 10,
  },
  explanation:
    'Cada dimensão recebe uma nota de 0 a 100 e contribui com o peso indicado. O resultado é um indicador editorial de qualidade da documentação, não uma probabilidade matemática de que o artigo esteja correto.',
};

/** Portas mínimas de publicação; o índice não substitui estas verificações. */
export const editorialPublishingPolicy = {
  minimumIndependentSourcesPerClaim: 3,
  minimumConfidenceScore: 80,
  maximumAccessCheckAgeDays: 90,
  explanation:
    'Cada afirmação principal precisa de pelo menos três fontes que a apoiem, com grupos editoriais independentes. Cada texto integral deve estar aberto, sem paywall, e ter sido conferido nos últimos 90 dias. A publicação também exige nota editorial mínima de 80/100 e revisão humana registrada.',
} as const;

function normalizedGroup(source: ResearchSource): string {
  return (source.independenceGroup || source.publisher)
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('pt-BR');
}

function isRecentIsoDate(value: string, maximumAgeDays: number, now = Date.now()): boolean {
  const timestamp = Date.parse(value);
  return (
    Number.isFinite(timestamp) && timestamp <= now && now - timestamp <= maximumAgeDays * 86_400_000
  );
}

/** Validação estrutural leve para barrar registros incompletos no fluxo de publicação. */
export function validateEditorialRecord(record: EditorialRecord): string[] {
  const errors: string[] = [];
  const sourceIds = new Set(record.sources.map(source => source.id));
  if (!record.claims.length) errors.push('Inclua ao menos uma afirmação verificável.');
  if (!record.sources.length) errors.push('Inclua ao menos uma fonte.');
  for (const source of record.sources) {
    try {
      const parsed = new URL(source.url);
      if (parsed.protocol !== 'https:') errors.push(`A fonte ${source.id} precisa usar HTTPS.`);
    } catch {
      errors.push(`URL inválida na fonte ${source.id}.`);
    }
    if (!source.accessedAt) errors.push(`Registre a data de consulta da fonte ${source.id}.`);
    if (source.dependsOn?.length)
      errors.push(
        `A fonte ${source.id} depende de outra publicação e não conta como independente.`,
      );
  }
  for (const claim of record.claims) {
    if (!claim.text.trim()) errors.push(`A afirmação ${claim.id} está vazia.`);
    if (!claim.evidence.length)
      errors.push(`A afirmação ${claim.id} ainda não tem evidências vinculadas.`);
    for (const evidence of claim.evidence) {
      if (!sourceIds.has(evidence.sourceId))
        errors.push(`A afirmação ${claim.id} cita uma fonte inexistente (${evidence.sourceId}).`);
      if (!evidence.excerpt.trim())
        errors.push(`A evidência de ${claim.id} não tem trecho comprobatório.`);
    }
    if (record.status === 'published') {
      const supporting = claim.evidence
        .filter(evidence => evidence.relation === 'supports')
        .map(evidence => record.sources.find(source => source.id === evidence.sourceId))
        .filter((source): source is ResearchSource => Boolean(source));
      const independentGroups = new Set(supporting.map(normalizedGroup));
      if (independentGroups.size < editorialPublishingPolicy.minimumIndependentSourcesPerClaim)
        errors.push(
          `A afirmação ${claim.id} precisa de três fontes confirmatórias de grupos editoriais independentes.`,
        );
    }
  }
  if (record.status === 'published') {
    if (!record.assessment) errors.push('Artigo publicado precisa de avaliação de confiabilidade.');
    if (!record.reviewedBy || !record.reviewedAt)
      errors.push('Artigo publicado precisa registrar revisão humana.');
    if (
      !record.lastVerifiedAt ||
      !isRecentIsoDate(record.lastVerifiedAt, editorialPublishingPolicy.maximumAccessCheckAgeDays)
    )
      errors.push(
        'Artigo publicado precisa ter verificação editorial atualizada nos últimos 90 dias.',
      );
    for (const source of record.sources) {
      if (!source.accessCheck) {
        errors.push(`A fonte ${source.id} ainda não teve acesso aberto conferido.`);
        continue;
      }
      if (
        source.accessCheck.httpStatus < 200 ||
        source.accessCheck.httpStatus >= 400 ||
        !source.accessCheck.fullTextOpenAccess ||
        source.accessCheck.paywall ||
        !isRecentIsoDate(
          source.accessCheck.checkedAt,
          editorialPublishingPolicy.maximumAccessCheckAgeDays,
        )
      )
        errors.push(
          `A fonte ${source.id} não passou pela conferência recente de acesso integral aberto.`,
        );
    }
  }
  if (
    record.status === 'published' &&
    record.assessment &&
    record.assessment.score < editorialPublishingPolicy.minimumConfidenceScore
  )
    errors.push('A nota editorial precisa ser de pelo menos 80/100 para publicação.');
  if (record.assessment && (record.assessment.score < 0 || record.assessment.score > 100))
    errors.push('A nota precisa estar entre 0 e 100.');
  if (record.assessment) {
    for (const [dimension, value] of Object.entries(record.assessment.dimensions)) {
      if (!Number.isFinite(value) || value < 0 || value > 100)
        errors.push(`A dimensão ${dimension} precisa estar entre 0 e 100.`);
    }
    if (record.assessment.method !== confidenceMethod.id)
      errors.push(`Método não suportado: ${record.assessment.method}.`);
    if (calculateConfidenceScore(record.assessment.dimensions) !== record.assessment.score)
      errors.push('A nota final não corresponde às dimensões e aos pesos do método.');
  }
  return errors;
}
