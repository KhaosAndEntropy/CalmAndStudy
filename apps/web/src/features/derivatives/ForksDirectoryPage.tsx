import {
  BadgeCheck,
  ExternalLink,
  FileText,
  GitFork,
  SearchCheck,
  ShieldAlert,
} from 'lucide-react';
import './forks-directory.css';

const repositoryUrl = 'https://github.com/KhaosAndEntropy/EstudeComCalmaBrasil';

export function ForksDirectoryPage() {
  return (
    <section className="updates-page forks-directory" aria-labelledby="forks-directory-title">
      <header className="updates-intro">
        <div className="eyebrow">
          <GitFork size={14} aria-hidden="true" /> CÓDIGO ABERTO, ORIGENS VISÍVEIS
        </div>
        <h1 id="forks-directory-title">Forks e derivados do projeto.</h1>
        <p>
          O código e os textos podem ser reutilizados conforme suas licenças. Esta página ajuda a
          distinguir forks reconhecidos pelo GitHub de projetos derivados independentes, sem sugerir
          endosso ou julgar a legalidade de terceiros.
        </p>
      </header>

      <section className="forks-origin-card" aria-labelledby="forks-origin-title">
        <div className="forks-card-icon">
          <GitFork size={21} aria-hidden="true" />
        </div>
        <div>
          <span className="forks-status">RELAÇÃO DE REPOSITÓRIO</span>
          <h2 id="forks-origin-title">Forks identificados pelo GitHub</h2>
          <p>
            A página oficial de forks do repositório mostra as cópias que o GitHub reconhece como
            parte desta rede. A lista muda conforme novos forks são criados; consulte o próprio
            GitHub para ver o estado atual.
          </p>
          <a href={`${repositoryUrl}/forks`} target="_blank" rel="noopener noreferrer">
            Consultar forks no GitHub <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="forks-listed-section" aria-labelledby="forks-listed-title">
        <div className="forks-section-heading">
          <div className="forks-card-icon">
            <SearchCheck size={21} aria-hidden="true" />
          </div>
          <div>
            <h2 id="forks-listed-title">Derivados independentes registrados</h2>
            <p>
              Entradas nesta lista precisam de revisão humana e de informações públicas
              verificáveis.
            </p>
          </div>
        </div>
        <div className="forks-empty-state">
          <strong>Ainda não há projetos independentes listados.</strong>
          <p>
            Isso não significa que não existam cópias. A lista reúne apenas projetos que foram
            enviados para revisão e tiveram sua ficha conferida.
          </p>
        </div>
      </section>

      <section className="forks-rules" aria-labelledby="forks-rules-title">
        <h2 id="forks-rules-title">Como a lista reduz confusões</h2>
        <div className="forks-rules-grid">
          <article>
            <BadgeCheck size={19} aria-hidden="true" />
            <h3>Mostramos o tipo de vínculo</h3>
            <p>
              “Fork no GitHub” descreve somente a relação exibida pelo GitHub. Um projeto
              independente pode usar código licenciado sem ser um fork reconhecido pela plataforma.
            </p>
          </article>
          <article>
            <FileText size={19} aria-hidden="true" />
            <h3>Registramos fatos conferíveis</h3>
            <p>
              Uma ficha revisada inclui endereço público, origem declarada, localização dos créditos
              e licença informada. A data da revisão aparece junto à entrada; mudanças posteriores
              podem torná-la desatualizada.
            </p>
          </article>
          <article>
            <ShieldAlert size={19} aria-hidden="true" />
            <h3>Não é selo nem acusação</h3>
            <p>
              Estar na lista não significa aprovação, parceria ou certificação jurídica. A ausência
              da lista também não prova infração. Não publicamos acusações nem dados pessoais.
            </p>
          </article>
        </div>
      </section>

      <aside className="forks-license-note">
        <h2>Licenças diferentes para materiais diferentes</h2>
        <p>
          O código está sob MIT e os textos originais de aprendizagem sob CC BY 4.0. A atribuição
          deve apontar a origem, a licença e as alterações quando aplicável. Imagens, marcas e
          materiais de terceiros mantêm seus próprios termos; as licenças do projeto não os cobrem.
          O nome ou símbolo do projeto não deve ser usado de modo que sugira vínculo oficial sem
          autorização.
        </p>
        <div className="forks-license-links">
          <a href={`${repositoryUrl}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">
            Licença do código (MIT) <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a
            href={`${repositoryUrl}/blob/main/CONTENT-LICENSE.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Licença dos conteúdos (CC BY 4.0) <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a
            href="https://www.gov.br/inpi/pt-br/servicos/marcas/guia-basico"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guia de marcas do INPI <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
        <small>
          Esta página descreve a prática do projeto e não substitui orientação jurídica.
        </small>
      </aside>

      <p className="forks-submit-note">
        Quer sugerir inclusão, correção ou retirada de uma ficha?{' '}
        <a
          href={`${repositoryUrl}/issues/new?template=derivacao.yml`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abra uma solicitação pública no GitHub <ExternalLink size={12} aria-hidden="true" />
        </a>
        . A solicitação não inclui o projeto automaticamente nesta lista.
      </p>
    </section>
  );
}
