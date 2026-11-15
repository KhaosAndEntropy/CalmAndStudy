import { BookOpen, ExternalLink, Image, Scale, ShieldCheck } from 'lucide-react';

const references = [
  {
    label: 'Lei brasileira de direitos autorais',
    href: 'https://www.planalto.gov.br/ccivil_03/leis/l9610.htm',
  },
  {
    label: 'Licenças Creative Commons',
    href: 'https://creativecommons.org/share-your-work/cclicenses/',
  },
  {
    label: 'Estudo do INPI sobre IA e direitos autorais',
    href: 'https://www.gov.br/inpi/pt-br/servicos/programas-de-computador/Direitosautoraiseobrasgeradas.pdf',
  },
];

export function ContentPolicyPage() {
  return (
    <section className="content-policy-page" aria-labelledby="content-policy-title">
      <header className="content-policy-intro">
        <span className="eyebrow">
          <Scale size={14} aria-hidden="true" /> DIREITOS E TRANSPARÊNCIA
        </span>
        <h1 id="content-policy-title">Conhecimento aberto. Direitos respeitados.</h1>
        <p>
          A Sala de Calma e Estudo resume ideias para facilitar o aprendizado e aponta caminhos para
          consultar as fontes originais. Uma fonte aberta para leitura não significa que todo texto,
          foto ou ilustração possa ser copiado ou republicado.
        </p>
      </header>

      <div className="content-policy-grid">
        <article className="content-policy-card">
          <BookOpen size={20} aria-hidden="true" />
          <h2>Artigos e fontes</h2>
          <p>
            Os artigos são sínteses editoriais da Sala de Calma e Estudo, escritos para explicar
            conceitos com palavras próprias. As referências servem para consulta e conferência; elas
            não transferem à Sala de Calma e Estudo direitos sobre os textos, dados, marcas ou
            imagens das fontes.
          </p>
          <p>
            Antes de reutilizar um material externo, confira a licença indicada pelo titular. A Calm
            & Study não republica textos integrais de terceiros como se fossem seus.
          </p>
        </article>

        <article className="content-policy-card">
          <Image size={20} aria-hidden="true" />
          <h2>Imagens e inteligência artificial</h2>
          <p>
            As imagens criadas por IA são ilustrações para ambientar a leitura. Mesmo quando têm
            aparência realista, não são fotografias documentais, provas de uma afirmação ou
            registros históricos.
          </p>
          <p>
            Ferramentas de IA podem ajudar na pesquisa, organização e criação visual. A saída
            precisa ser revisada por uma pessoa e confrontada com fontes; a IA não é uma fonte de
            evidência. Não prometemos exclusividade autoral sobre imagens geradas automaticamente.
          </p>
        </article>

        <article className="content-policy-card">
          <ShieldCheck size={20} aria-hidden="true" />
          <h2>Licenças e correções</h2>
          <p>
            Quando um recurso de terceiro for usado, a publicação deve registrar a origem, a licença
            e a atribuição exigida. As regras da Sala de Calma e Estudo não substituem os termos do
            titular.
          </p>
          <p>
            Se você identificar crédito incorreto, licença incompatível ou possível violação, envie
            uma sugestão de revisão pelo formulário disponível na Sala de Calma e Estudo. O material
            será analisado antes de qualquer alteração.
          </p>
        </article>

        <article className="content-policy-card">
          <ShieldCheck size={20} aria-hidden="true" />
          <h2>Um projeto aberto</h2>
          <p>
            A Sala de Calma e Estudo é gratuita e aberta à colaboração. O código está sob MIT e os
            textos originais de aprendizagem sob CC BY 4.0. Veja as condições completas nos arquivos
            de licença.
          </p>
          <a
            href="https://github.com/KhaosAndEntropy/CalmAndStudy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Código e histórico no GitHub <ExternalLink size={12} aria-hidden="true" />
          </a>
        </article>
      </div>

      <aside
        className="content-policy-references"
        aria-label="Referências sobre direitos e licenças"
      >
        <h2>Leia as regras originais</h2>
        <ul>
          {references.map(reference => (
            <li key={reference.href}>
              <a href={reference.href} target="_blank" rel="noopener noreferrer">
                {reference.label} <ExternalLink size={13} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <p>
          Esta página resume práticas do projeto e não substitui orientação jurídica. A licença
          aplicável depende do material específico e de seus termos atuais.
        </p>
      </aside>
    </section>
  );
}
