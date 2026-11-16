import { useState } from 'react';
import { HeartHandshake, Newspaper } from 'lucide-react';

export const releaseNotes = [
  [
    'Primeiros passos do Modo escolar',
    'Já dá para escolher etapa, ano e componente e explorar três exemplos de estudo alinhados a habilidades da BNCC. O popup de entrada agora também aponta para o apoio escolar gratuito, que segue em ampliação e não substitui matrícula ou certificação.',
  ],
  [
    'Cabeçalho melhor ajustado no celular',
    'O nome da seção agora se adapta ao espaço disponível, e as opções de modo ficam dentro da tela mesmo em celulares estreitos ou na horizontal.',
  ],
  [
    'Controles mais fáceis de enxergar',
    'O selo do acervo e o botão de curtida ganharam texto, ícone e contornos com mais contraste no tema base. O foco pelo teclado e os estados de interação também ficaram mais claros.',
  ],
  [
    'Uma forma opcional de apoiar o projeto',
    'Se o Estude com Calma foi útil, agora é possível contribuir por Pix. O apoio é voluntário; todo o conteúdo continua gratuito e aberto, sem vantagens ou cobranças.',
  ],
  [
    'Um lugar de estudo com identidade brasileira',
    'Os banners agora apresentam caminhos próprios para estudar com calma ou explorar em modo aventura. A página inicial também celebra a origem brasileira do projeto e quem o criou.',
  ],
  [
    'O Modo aventura ganhou uma expedição própria',
    'Uma nova navegação reúne descobertas, trilhas, tutoriais e conquistas em uma jornada mais interativa. Os artigos e o cuidado com as fontes continuam iguais; você pode trocar de ritmo quando quiser.',
  ],
  [
    'Dois jeitos de aprender e uma pausa com carinho',
    'Escolha entre Estudo calmo e Modo aventura. O check-in é opcional, e um lembrete discreto pode sugerir uma pausa depois de um tempo de navegação ativa. As escolhas pessoais não são enviadas.',
  ],
  [
    'Agora é mais fácil participar do Estude com Calma',
    'O projeto está aberto a contribuições educativas, correções e melhorias. Toda proposta é revisada antes de entrar no catálogo.',
  ],
  [
    'Mais clareza sobre fontes, imagens e licenças',
    'Uma nova página explica como consultar referências, entender ilustrações feitas com IA, reportar correções e respeitar as licenças de cada material.',
  ],
  [
    'Um banner mais realista para dar boas-vindas',
    'A página inicial agora recebe uma imagem fotográfica criada para o Estude com Calma, com objetos de leitura e descoberta e uma área escura que preserva a leitura do texto.',
  ],
  [
    'As questões das trilhas voltaram a ficar alinhadas',
    'Corrigimos um estilo que estreitava o texto dos enunciados. As perguntas e alternativas agora se organizam sem cortes em telas pequenas.',
  ],
  [
    'Um mapa mais fácil de seguir',
    'O mapa agora apresenta cada assunto com suas bases, próximos passos e temas relacionados em blocos claros, que também funcionam bem no celular.',
  ],
  [
    'Cards e áreas com cores mais vivas',
    'Artigos, trilhas, tutoriais e outros cards usam a mesma elevação e uma sombra mais perceptível. Os selos das áreas têm cores próprias e o destaque acompanha a imagem quando disponível.',
  ],
  [
    'Mais referências para suas pesquisas',
    'A busca considera mais resultados antes de exibir aqueles que atendem aos critérios de acesso livre e leitura integral.',
  ],
  [
    'Tutoriais e trilhas mais fáceis de acompanhar',
    'Agora você pode buscar por assunto e filtrar por área nas duas seções. Os tutoriais têm capas fotográficas ilustrativas, permitem rever a etapa final e guardam um check no card quando você conclui cada atividade. A apresentação e o rodapé também identificam quem criou e desenvolveu o Estude com Calma.',
  ],
  [
    'Mais fácil instalar e explorar o catálogo',
    'A opção para instalar o Estude com Calma como app ficou mais clara, os artigos passaram a carregar em pequenos lotes e o atalho de sugestão sai da frente do link “Sobre o Estude com Calma” quando você chega ao rodapé no celular.',
  ],
  [
    'O Estude com Calma fica mais acessível',
    'Ficou mais confortável navegar pelo teclado, ampliar o conteúdo e usar os controles com tecnologias assistivas.',
  ],
  [
    'Uma apresentação para quem chega',
    'Na primeira visita, uma mensagem explica a proposta do Estude com Calma, as formas de explorar os assuntos e como consultar as referências. Ela pode ser aberta novamente pelo link “Sobre o Estude com Calma”, no rodapé.',
  ],
  [
    'Ilustrações para todos os artigos',
    'Os artigos atuais têm imagens ilustrativas criadas para cada tema. Elas ajudam a imaginar o assunto, mas não substituem evidências históricas ou científicas.',
  ],
  [
    'Uma voz e um resumo para cada leitura',
    'Agora você pode ouvir o artigo em português usando a voz disponível no seu navegador e terminar a leitura com uma síntese simples para guardar a ideia principal.',
  ],
  [
    'Leituras anteriores mais fáceis de encontrar',
    'O botão “Ler primeiro” ganhou contraste e um formato próprio para ficar legível em diferentes paletas e tamanhos de tela.',
  ],
  [
    'Áreas científicas mais fáceis de explorar',
    'As ciências agora aparecem em uma lista organizada, com pesquisa, contagem de artigos e indicação clara da área selecionada.',
  ],
  [
    'Mais caminhos para conectar os artigos',
    'As trilhas cobrem os artigos disponíveis, com sequências que ajudam a construir contexto. As conexões e os limites de cada percurso também ficam explicados.',
  ],
  [
    'Mais prática depois de cada leitura',
    'Os artigos ganharam exercícios curtos; cada trilha propõe uma atividade por tema e uma síntese final que percorre o caminho inteiro. A biblioteca de tutoriais também cresceu.',
  ],
  [
    'Fontes públicas, com transparência',
    'O Estude com Calma explicita o compromisso de priorizar informações sustentadas por fontes públicas e rastreáveis. A checagem automática informa se um link respondeu; não comprova, sozinha, a qualidade da evidência nem a ausência de paywall.',
  ],
  [
    'Ícones para navegador e celular',
    'O site agora usa o símbolo do Estude com Calma na aba do navegador e oferece ícones adequados para adicionar um atalho à tela inicial do celular.',
  ],
  [
    'O leitor mantém os controles sempre visíveis',
    'A barra de navegação e o botão de fechar ficam acima da imagem e acompanham a leitura sem serem encobertos pelo conteúdo.',
  ],
  [
    'Agradecimentos à comunidade',
    'Criamos um espaço para reconhecer quem ajuda com ideias e feedback. Os nomes só serão publicados com autorização.',
  ],
  [
    'Uma saída simples da biblioteca',
    'A tela de Salvos ganhou um botão para voltar às descobertas, e o botão voltar do celular agora navega entre as seções do Estude com Calma.',
  ],
  [
    'Leitura mais suave e no seu ritmo',
    'O salvamento não interrompe mais o artigo. Se quiser, ative uma barra discreta que acompanha seu progresso nas preferências de aparência. O compartilhamento está marcado como “Em breve”.',
  ],
];
export const ReleaseNotes = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.ceil(releaseNotes.length / pageSize);
  const visibleNotes = releaseNotes.slice((page - 1) * pageSize, page * pageSize);
  return (
    <section className="updates-page" aria-labelledby="updates-title">
      <header className="updates-intro">
        <div className="eyebrow">
          <Newspaper size={14} aria-hidden="true" /> NOVIDADES DO ESTUDE COM CALMA
        </div>
        <h1 id="updates-title">Novidades por aqui.</h1>
        <p>
          Um registro simples das melhorias que chegam para deixar o estudo mais claro, confortável
          e acessível.
        </p>
      </header>
      <div className="updates-list" aria-label="Histórico de melhorias">
        {visibleNotes.map(([title, description], index) => (
          <article className="update-note" key={title}>
            <span className="update-index" aria-hidden="true">
              {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
            </span>
            <div>
              <time
                dateTime={
                  (page - 1) * pageSize + index === 0
                    ? '2026-11-14'
                    : (page - 1) * pageSize + index < 7
                      ? '2026-11-13'
                      : '2026-11-11'
                }
              >
                {(page - 1) * pageSize + index === 0
                  ? '14 de novembro de 2026'
                  : (page - 1) * pageSize + index < 7
                    ? '13 de novembro de 2026'
                    : '11 de novembro de 2026'}
              </time>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
      <nav className="updates-pagination" aria-label="Paginação das novidades">
        <span>
          Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, releaseNotes.length)} de{' '}
          {releaseNotes.length}
        </span>
        <div>
          <button
            className="outline-btn"
            onClick={() => setPage(current => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            Anterior
          </button>
          <span aria-live="polite">
            {page} / {pageCount}
          </span>
          <button
            className="outline-btn"
            onClick={() => setPage(current => Math.min(pageCount, current + 1))}
            disabled={page === pageCount}
            aria-label="Próxima página"
          >
            Próxima
          </button>
        </div>
      </nav>
    </section>
  );
};

const acknowledgements: { id: string; name: string; contribution?: string }[] = [];

export const AcknowledgementsPage = () => (
  <section className="updates-page acknowledgements-page" aria-labelledby="acknowledgements-title">
    <header className="updates-intro">
      <div className="eyebrow">
        <HeartHandshake size={14} aria-hidden="true" /> COM A AJUDA DE QUEM USA
      </div>
      <h1 id="acknowledgements-title">O Estude com Calma cresce em comunidade.</h1>
      <p>
        Um espaço para reconhecer as pessoas que ajudam a melhorar o produto com ideias, observações
        e feedbacks.
      </p>
    </header>
    {acknowledgements.length > 0 ? (
      <section className="acknowledgements-list" aria-label="Pessoas agradecidas">
        {acknowledgements.map(person => (
          <article className="acknowledgement-card" key={person.id}>
            <HeartHandshake size={18} aria-hidden="true" />
            <div>
              <h2>{person.name}</h2>
              {person.contribution && <p>{person.contribution}</p>}
            </div>
          </article>
        ))}
      </section>
    ) : (
      <section className="acknowledgements-empty">
        <span className="acknowledgements-mark">
          <HeartHandshake size={22} aria-hidden="true" />
        </span>
        <h2>Obrigado a quem compartilha feedback.</h2>
        <p>Suas observações ajudam a deixar o Estude com Calma mais clara, útil e acolhedora.</p>
        <small>
          Os nomes aparecerão aqui somente com autorização. Ainda não há pessoas listadas.
        </small>
      </section>
    )}
  </section>
);
