import { ShieldCheck } from 'lucide-react';
import { confidenceMethod, editorialPublishingPolicy, type Topic } from '@calmandstudy/content';

/** Explains the editorial review status and how its documentation score is calculated. */
export function EditorialConfidencePanel({ topic }: { topic: Topic }) {
  const assessment = topic.editorial?.status === 'published' ? topic.editorial.assessment : null;

  return (
    <section className="confidence" aria-label="Verificação editorial">
      <div className="confidence-top">
        <span>
          <ShieldCheck size={17} />{' '}
          {assessment ? 'Revisão editorial publicada' : 'Verificação editorial pendente'}
        </span>
        <b>{assessment ? `${assessment.score}%` : 'Ainda sem nota'}</b>
      </div>
      {assessment ? (
        <progress
          className="meter"
          max={100}
          value={assessment.score}
          aria-label="Pontuação da revisão editorial"
        />
      ) : null}
      <p>
        {assessment
          ? assessment.rationale
          : 'Este artigo ainda não passou pelo padrão editorial de publicação da Sala de Calma e Estudo. As fontes listadas no catálogo antigo não foram auditadas uma a uma; por isso, não mostramos uma porcentagem como se fosse verificada.'}
      </p>
      <div className="signals">
        <span>
          • Para publicação, cada afirmação precisa de pelo menos três fontes confirmatórias de
          grupos editoriais independentes
        </span>
        <span>
          {assessment
            ? '• As afirmações e os trechos de evidência estão apresentados abaixo'
            : '• Também conferimos texto integral aberto, ausência de paywall e acesso recente'}
        </span>
        <span>• Confira as fontes originais e considere o contexto e as ressalvas do texto</span>
        <span>• Situação editorial: {topic.confidenceLabel}</span>
      </div>
      {assessment ? (
        <details className="confidence-method">
          <summary>Metodologia e limitações</summary>
          <p>
            {assessment.method}: cobertura {assessment.dimensions.claimCoverage}/100; qualidade da
            evidência {assessment.dimensions.evidenceQuality}/100; independência{' '}
            {assessment.dimensions.sourceIndependence}/100; concordância{' '}
            {assessment.dimensions.sourceAgreement}/100; atualidade{' '}
            {assessment.dimensions.timeliness}/100; transparência das incertezas{' '}
            {assessment.dimensions.uncertaintyDisclosure}/100.
          </p>
          <p>{assessment.limitations.join(' ')}</p>
          <p>
            Revisado por {topic.editorial?.reviewedBy} em {topic.editorial?.reviewedAt}.
          </p>
        </details>
      ) : (
        <details className="confidence-method">
          <summary>Regra de publicação e cálculo</summary>
          <p>
            {editorialPublishingPolicy.explanation} A nota é um indicador da qualidade da
            documentação, não a probabilidade matemática de o artigo estar correto. Só exibimos o
            índice após a revisão humana registrada.
          </p>
          <ul>
            {Object.entries(confidenceMethod.weights).map(([dimension, weight]) => (
              <li key={dimension}>
                {dimension === 'claimCoverage'
                  ? 'Cobertura das afirmações'
                  : dimension === 'evidenceQuality'
                    ? 'Qualidade da evidência'
                    : dimension === 'sourceIndependence'
                      ? 'Independência das fontes'
                      : dimension === 'sourceAgreement'
                        ? 'Concordância entre fontes'
                        : dimension === 'timeliness'
                          ? 'Atualidade'
                          : 'Transparência das incertezas'}{' '}
                · {weight}%
              </li>
            ))}
          </ul>
          <p>
            Cada dimensão recebe nota de 0 a 100. Somamos cada nota multiplicada pelo peso e
            dividimos por 100; o resultado é arredondado para o inteiro mais próximo. A publicação
            exige pelo menos 80/100, as três fontes por afirmação e revisão humana.
          </p>
        </details>
      )}
    </section>
  );
}
