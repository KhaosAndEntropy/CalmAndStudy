import type { Topic } from '@calmandstudy/content';

export function ArticleExercises({ topic }: { topic: Topic }) {
  return (
    <section className="article-exercises" aria-labelledby="article-exercises-title">
      <span className="eyebrow muted">FIXE O APRENDIZADO</span>
      <h2 id="article-exercises-title">Uma pausa para praticar</h2>
      <ol>
        <li>
          Sem olhar o texto, explique com suas palavras: <strong>{topic.fact}</strong>
        </li>
        <li>
          Abra uma das fontes listadas. O que ela confirma sobre essa ideia — e o que não permite
          concluir?
        </li>
        <li>
          Que ressalva do artigo você acrescentaria para evitar uma explicação simplificada demais?
        </li>
      </ol>
    </section>
  );
}
