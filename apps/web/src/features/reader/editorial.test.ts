import { describe, expect, it } from 'vitest';
import {
  calculateConfidenceScore,
  validateEditorialRecord,
  type EditorialRecord,
} from '@calmandstudy/content';

const checkedAt = new Date().toISOString();

function makePublishedRecord(): EditorialRecord {
  const sources = ['museum-a', 'university-b', 'journal-c'].map((id, index) => ({
    id,
    title: `Referência ${index + 1}`,
    publisher: `Instituição ${index + 1}`,
    independenceGroup: `grupo-${index + 1}`,
    url: `https://example-${index + 1}.org/source`,
    kind: 'institutional' as const,
    accessedAt: checkedAt,
    accessCheck: {
      checkedAt,
      httpStatus: 200,
      fullTextOpenAccess: true,
      paywall: false,
    },
  }));

  return {
    schemaVersion: 1,
    status: 'published',
    createdAt: checkedAt,
    updatedAt: checkedAt,
    lastVerifiedAt: checkedAt,
    claims: [
      {
        id: 'claim-1',
        text: 'Afirmação de exemplo a conferir.',
        kind: 'established',
        evidence: sources.map(source => ({
          sourceId: source.id,
          relation: 'supports',
          excerpt: 'Trecho documental curto.',
          accessedAt: checkedAt,
        })),
      },
    ],
    sources,
    assessment: {
      method: 'calmandstudy-confidence-v1',
      score: 80,
      assessedAt: checkedAt,
      assessedBy: 'revisora',
      dimensions: {
        claimCoverage: 80,
        evidenceQuality: 80,
        sourceIndependence: 80,
        sourceAgreement: 80,
        timeliness: 80,
        uncertaintyDisclosure: 80,
      },
      rationale: 'Avaliação de exemplo.',
      limitations: ['Exemplo didático.'],
    },
    reviewedBy: 'revisora',
    reviewedAt: checkedAt,
  };
}

describe('metodologia editorial', () => {
  it('calcula o índice com pesos versionados', () => {
    expect(
      calculateConfidenceScore({
        claimCoverage: 100,
        evidenceQuality: 80,
        sourceIndependence: 60,
        sourceAgreement: 80,
        timeliness: 100,
        uncertaintyDisclosure: 100,
      }),
    ).toBe(84);
  });

  it('aceita publicação apenas com três grupos independentes e revisão humana recente', () => {
    expect(validateEditorialRecord(makePublishedRecord())).toEqual([]);
  });

  it('rejeita três links que pertencem ao mesmo grupo editorial', () => {
    const record = makePublishedRecord();
    record.sources.forEach(source => {
      source.independenceGroup = 'mesmo-grupo';
    });

    expect(validateEditorialRecord(record)).toContain(
      'A afirmação claim-1 precisa de três fontes confirmatórias de grupos editoriais independentes.',
    );
  });

  it('rejeita acesso fechado e nota inferior ao mínimo editorial', () => {
    const record = makePublishedRecord();
    record.sources[0].accessCheck!.paywall = true;
    record.assessment!.score = 79;

    expect(validateEditorialRecord(record)).toContain(
      'A nota editorial precisa ser de pelo menos 80/100 para publicação.',
    );
    expect(validateEditorialRecord(record)).toContain(
      'A fonte museum-a não passou pela conferência recente de acesso integral aberto.',
    );
  });
});
