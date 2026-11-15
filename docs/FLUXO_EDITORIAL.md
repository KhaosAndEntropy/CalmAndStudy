# Fluxo editorial da Sala de Calma e Estudo

Este documento define como um artigo chega à aplicação, quais informações o leitor deve receber e como manter o primeiro ritmo planejado de **20 publicações por mês**. A documentação não afirma que os artigos existentes já passaram por este fluxo.

## Estado atual e limite importante

O site continua lendo o mesmo catálogo em `packages/content/src/index.ts`; complementos de leitura ficam em `packages/content/src/expanded.ts`. O monorepo contém `GET /api/research` e `GET /api/links/check` em Cloudflare Pages Functions (`functions/api/`), com handlers compartilhados em `packages/research/src/index.ts`; o Vite executa o handler de pesquisa localmente. `POST /api/submissions` recebe sugestões de temas, revisões e pacotes de referências em uma fila privada no D1. Os 79 artigos web têm ilustrações de IA locais; se uma imagem falhar, uma ilustração vetorial local evita cards vazios. Nenhuma imagem é solicitada a um serviço externo ao abrir o site. A busca bibliográfica exclui registros retratados e preprints; exige licença aberta reconhecida, DOI confirmado no Crossref e texto integral acessível, com PDF/XML testado pelo backend. No OpenAlex, o backend examina até 40 resultados relevantes antes do filtro estrito e percorre todas as localizações de cada trabalho em vez de confiar somente em `best_oa_location`; a janela maior evita que registros inadequados no início da lista escondam trabalhos elegíveis. Versões publicadas têm prioridade; uma cópia aceita/publicada em repositório pode ser incluída se a licença e o PDF forem confirmados e o Crossref classificar o DOI como artigo de periódico. A interface identifica essa cópia. O filtro confirma procedência bibliográfica e acesso, não a verdade das afirmações, revisão por pares por si só nem a independência das bases. Erros de fonte aparecem como indisponibilidade; resposta válida sem registro elegível aparece como busca concluída sem resultados. O `validateEditorialRecord` confere estrutura e matemática do score; não confirma que uma citação prova a afirmação.

Ilustrações locais ajudam a identificar áreas temáticas; não devem ser interpretadas como imagens documentais ou como evidência. A versão atual não faz busca por fotografias nem depende de um provedor externo de imagens.

Os 79 artigos legados ainda não têm registros editoriais completos; nenhum atende, hoje, a todos os requisitos de publicação. Percentuais anteriores são **ilustrativos** e não devem ser citados como verificação. O leitor vê a indicação de auditoria pendente. Artigos futuros só recebem o selo de publicação após passar pelos critérios abaixo.

## Dados que acompanham um artigo novo

O tipo `EditorialRecord` registra (há também um [JSON Schema v1](../packages/content/schemas/editorial-record.schema.json) para validar rascunhos produzidos fora do TypeScript):

- status editorial (`draft`, `researching`, `needs-review`, `approved`, `published` ou `needs-update`);
- datas de criação, atualização, consulta das fontes e revisão;
- assistência de IA usada, com fornecedor, modelo e versão de prompt, quando aplicável;
- lista de afirmações atômicas, cada uma classificada como fato estabelecido, interpretação, hipótese ou debate;
- para cada afirmação, fontes ligadas, relação da evidência (apoia, qualifica ou contradiz), trecho comprobatório curto, localizador e data de consulta;
- dados das fontes: título, instituição/editora, URL, tipo, autoria, data de publicação, DOI/licença quando houver e dependências conhecidas;
- avaliação versionada, dimensões, justificativa, limitações e responsável pela revisão humana.

Não guarde dados pessoais de leitores no pacote editorial. Trechos devem ser curtos, necessários para localizar e conferir a evidência, respeitando direitos autorais e licenças.

## Como a pesquisa deve ser feita

1. **Escolher uma pergunta verificável.** Delimitar período, lugar, população e termos ambíguos. Separar contexto histórico de interpretação.
2. **Descobrir fontes gratuitas.** A busca pública consulta [OpenAlex](https://help.openalex.org/api/authentication/) (índice multidisciplinar), [OpenAIRE Graph](https://graph.openaire.eu/docs/apis/graph-api-v4/quickstart/) (índice agregador para descoberta de artigos indicados como revisados por pares e acesso aberto), [Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) (metadados DOI), [Europe PMC](https://dev.europepmc.org/RestfulWebService) (biomedicina), [NASA STI](https://sti.nasa.gov/for-developers/) (documentação técnico-científica espacial) e [USGS Publications Warehouse](https://pubs.usgs.gov/documentation/web_service_documentation) (geociências e ambiente). As fontes institucionais só entram nos campos relevantes e passam filtros de procedência, direito e arquivo integral. OpenAIRE agrega dados de provedores e pode incluir registros de outras bases consultadas; serve para localizar candidatos e **não conta como confirmação independente**. O DOI candidato precisa ser confirmado no Crossref, e licença e texto integral são conferidos pelo backend antes de qualquer resultado aparecer. Nesta integração, a verificação do texto via Europe PMC exige PMCID, então o ganho de cobertura tende a ficar nas áreas biomédicas. Metadados OpenAIRE são oferecidos sob [termos de reutilização com atribuição CC BY](https://graph.openaire.eu/docs/apis/terms/). Índices e catálogos são pontos de partida, não substitutos da leitura de fontes primárias nem confirmação da verdade de uma afirmação. Não haverá dependência de API paga de IA.
3. **Conferir uma fonte pública.** Um resultado de busca não é evidência. Abrir o link, confirmar título e autoria, localizar a passagem pertinente, guardar trecho curto e data de acesso. Cada afirmação central precisa poder ser conferida em material acessível sem assinatura; uma publicação com paywall pode servir como contexto adicional, mas não como única base nem como única referência mostrada ao leitor.
4. **Testar independência.** Duas páginas que reproduzem o mesmo comunicado ou dataset contam como uma cadeia de evidência, não duas confirmações independentes. Registre `dependsOn` quando souber dessa relação.
5. **Vincular fontes a cada afirmação.** Uma lista geral de bibliografia não basta. Evidência conflitante precisa ser registrada e explicada; não esconda divergências em uma média.
6. **Redigir didaticamente.** Apresentar ideia central, contexto necessário, sequência lógica, vocabulário, exemplo, ressalva e conexão opcional com outro tema. História deve distinguir vestígio, fonte, interpretação e incerteza; ciências experimentais devem distinguir observação, modelo e hipótese.
7. **Revisar com pessoa.** Conferir todas as afirmações, links, contexto, números, tradução, imagem e licença. O fluxo inicial usa fontes públicas e curadoria humana; IA é opcional, não dependência nem aprovadora.
8. **Publicar em lote.** Alterar o estado para `published` apenas depois da revisão. O conteúdo público é exportado/armazenado no site; nenhuma chave da API deve ser incluída nos clientes ou no repositório.
9. **Rever.** Corrigir links quebrados e reabrir o estado `needs-update` quando a fonte mudar, houver nova evidência ou um leitor apontar erro. Indicar a data de revisão visível.

### Sugestões enviadas por leitores

Para sugerir um assunto novo, a pessoa informa **três instituições/publicações diferentes e três URLs HTTPS**. O servidor rejeita campos ausentes, links não HTTPS, editoras repetidas e domínios repetidos. A distinção real entre fontes — por exemplo, se uma página apenas republica o mesmo comunicado — precisa ser conferida pela equipe; a validação técnica não consegue provar independência por si só. Toda sugestão entra como pauta pendente e exige supervisão humana, evidências por afirmação e os mesmos critérios de publicação. Ela nunca é publicada automaticamente.

## Índice editorial de documentação (v1)

O `confidenceMethod` define pesos fixos e visíveis. Cada dimensão recebe nota de 0 a 100, com justificativa, e o total é a soma ponderada, arredondada para um inteiro:

| Dimensão                     | Peso | O que a pessoa revisora deve verificar                         |
| ---------------------------- | ---: | -------------------------------------------------------------- |
| Cobertura das afirmações     |  25% | Afirmações importantes têm evidência diretamente ligada?       |
| Qualidade da evidência       |  25% | A fonte é adequada à pergunta e ao tipo de conhecimento?       |
| Independência das fontes     |  20% | Há cadeias de evidência independentes, não mera repetição?     |
| Concordância entre fontes    |  15% | As fontes convergem? Divergências e limites estão registrados? |
| Atualidade                   |   5% | A data importa para esse tema e a informação continua atual?   |
| Transparência das incertezas |  10% | Interpretações, lacunas e ressalvas estão claras?              |

**Significado para o leitor:** é um índice editorial de qualidade da documentação disponível para aquele artigo, não a probabilidade matemática de o texto estar correto, nem garantia de consenso. O valor não deve ser publicado sem nome/identificação editorial, data, versão do método, justificativa e limitações. Se evidência for insuficiente, marque como `needs-review`/`needs-update` ou retire o número; não complete lacunas com precisão artificial.

Fórmula: `round(0,25 × cobertura + 0,25 × qualidade + 0,20 × independência + 0,15 × concordância + 0,05 × atualidade + 0,10 × transparência)`. O código calcula a soma a partir das dimensões preenchidas e verifica se o total coincide; a nota de cada dimensão ainda exige julgamento justificado da pessoa revisora. Para publicar, além de atingir 80/100, cada afirmação principal precisa de pelo menos três fontes independentes que a apoiem, texto integral aberto conferido nos últimos 90 dias e revisão humana registrada. A regra estrutural não comprova, sozinha, a validade histórica/científica das fontes.

## O que mostrar sempre ao leitor

Na página de cada artigo:

- assunto, área científica, escopo/época e tempo aproximado de leitura;
- síntese estruturada e ressalvas sem ocultar incerteza;
- status editorial e data da última verificação/revisão;
- índice e versão de metodologia, se houver avaliação válida, acompanhado da explicação acima;
- fontes clicáveis com nome, instituição, tipo, autoria e data de acesso/publicação disponível;
- seção “Como sabemos disso?” com afirmações e evidências associadas, incluindo discordâncias relevantes;
- procedência da imagem, texto alternativo, licença e crédito, ou mensagem de reserva caso não carregue;
- conexões e pré-requisitos como sugestões opcionais, sem bloquear a exploração.

Para o catálogo de demonstração, declarar com clareza que o índice é ilustrativo, que não há auditoria completa por afirmação e que os artigos não estão certificados pelo padrão novo. Não rotular fontes como verificadas nem como confirmação independente quando esses dados não estiverem registrados.

## Fontes atualmente integradas

| Provedor                                                                                     | Uso na aplicação                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Limite editorial                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [OpenAlex](https://help.openalex.org/api/authentication/)                                    | Busca multidisciplinar de metadados de artigos, autores, local de publicação, DOI, indicação de acesso aberto e citações. O backend percorre as localizações disponíveis para não descartar um texto elegível quando a localização preferida não for adequada. Uma versão de repositório só aparece depois da confirmação do DOI como artigo de periódico no Crossref. A chave gratuita `OPENALEX_API_KEY` aumenta a cota diária; se a autenticação falhar, o código tenta a consulta pública sem chave. | Índice de descoberta; cobertura, resumos, status de acesso e classificação podem variar. Citações não medem correção. OpenAlex não confirma sozinho licença, arquivo ou veracidade.       |
| [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)      | Segunda busca ampla de metadados DOI, editoras, revistas, datas e eventuais licenças. Sem cadastro ou chave para uso público.                                                                                                                                                                                                                                                                                                                                                                            | Metadados são depositados por membros e parceiros; registro DOI não confirma qualidade nem acesso gratuito ao texto.                                                                      |
| [OpenAIRE Graph](https://graph.openaire.eu/docs/apis/graph-api-v4/quickstart/)               | Índice agregador gratuito usado para localizar candidatos com DOI, indicação de revisão por pares, licença e acesso aberto; o DOI é conferido no Crossref e o texto integral é revalidado via Europe PMC.                                                                                                                                                                                                                                                                                                | Registros podem se repetir entre catálogos. OpenAIRE não conta como confirmação independente; a exigência de PMCID limita esta integração principalmente a publicações biomédicas.        |
| [Europe PMC](https://dev.europepmc.org/RestfulWebService)                                    | Busca especializada em biomedicina e ciências da vida, filtrada para registros do subset open access. Pode trazer artigos e preprints.                                                                                                                                                                                                                                                                                                                                                                   | Verificar tipo de publicação e licença item a item; “open access” da busca não significa que todo conteúdo do registro possa ser republicado.                                             |
| [NASA STI](https://sti.nasa.gov/for-developers/)                                             | Catálogo/API de documentos técnicos e científicos da NASA, incluindo relatórios e artigos relacionados às áreas aeroespacial, física e engenharia.                                                                                                                                                                                                                                                                                                                                                       | Não implica revisão por pares. A integração exige metadados de distribuição pública, direitos/licença e PDF acessível; material de terceiros sem permissão é excluído.                    |
| [USGS Publications Warehouse](https://pubs.usgs.gov/documentation/web_service_documentation) | Catálogo/API de relatórios, mapas e publicações do U.S. Geological Survey em geociências, água, ambiente e áreas próximas.                                                                                                                                                                                                                                                                                                                                                                               | A política de domínio público dos EUA tem exceções para conteúdo de terceiros. A integração exige autoria USGS declarada, PDF oficial e teste do arquivo; confira os avisos do documento. |

O backend faz até seis resultados por provedor aplicável, combina duplicatas por DOI/título quando há DOI, aplica timeout de oito segundos e mantém cache curto em memória quando o runtime está aquecido. Se uma API falhar, as outras continuam disponíveis. Um resultado não é copiado para artigo: o usuário seleciona referências candidatas, exporta metadados em JSON e realiza verificação editorial. O resumo do registro é apenas uma pista de pesquisa e não é incluído no arquivo exportado. Aumentar fontes de descoberta não publica automaticamente artigos no catálogo editorial.

O catálogo editorial também pode usar documentos públicos de órgãos de saúde e estatística, universidades, livros abertos e acervos digitais. Antes de incluir uma referência, confira que a página abre sem assinatura, que o domínio identifica claramente a instituição e que a fonte sustenta o trecho descrito. A checagem de links do app tem uma lista restrita de domínios confiáveis e só mostra referências com resposta HTTP 2xx; fontes que retornem bloqueio ou estado inconclusivo não devem ser forçadas para a interface. Quando duas referências vierem da mesma organização, identifique isso como apoio documental, não como confirmação independente.

Web envia o termo de busca a esses provedores públicos; a tela avisa para não inserir dados pessoais. Pesquisa e checagem são endpoints públicos GET com parâmetros limitados; sugestões são POST com schema e tamanho limitados. Todos passam por limite distribuído no D1, configurado em `docs/SEGURANCA.md`.

## Publicação no Cloudflare Pages

Com o diretório raiz do projeto Pages apontando para a raiz do monorepo:

- Build command: `pnpm --filter @calmandstudy/web build`
- Build output directory: `apps/web/dist`
- Functions directory: `functions/` (não mova para `dist`)
- Endereço automático: `<nome-do-projeto>.pages.dev`

O handler local roda com Vite via `pnpm dev`. No Pages, a função de arquivo `functions/api/research.ts` atende `/api/research`. Pages Functions usam a cota Workers Free; a documentação atualmente informa 100 mil invocações por dia no Free. Os assets estáticos são roteados separadamente pelo Pages. [Monorepos](https://developers.cloudflare.com/pages/configuration/monorepos/), [Functions routing](https://developers.cloudflare.com/pages/functions/routing/), [Workers pricing e limites](https://developers.cloudflare.com/workers/platform/pricing/)

## Ritmo e custo operacional de 20 publicações/mês

O pacote exporta `editorialCadence` com a meta inicial de 20 artigos por mês (cerca de cinco por semana); é uma meta de planejamento, não um limite técnico. Uma faixa operacional conservadora é 10–15 minutos de revisão final por artigo (cerca de 3h20–5h mensais), além da pesquisa e redação. O valor muda conforme complexidade; temas controversos, históricos ou de saúde podem precisar de mais revisão especializada.

**Orçamento do início:** R$ 0 de domínio (usar o endereço fornecido pelo Pages), R$ 0 de hospedagem dentro do plano gratuito, R$ 0 de invocações enquanto a API ficar dentro da cota gratuita e R$ 0 de chamadas pagas de IA. As três APIs integradas oferecem consulta sem custo, sujeita a políticas e limites dos provedores. Com 20 artigos mensais e fontes públicas gratuitas, o custo financeiro planejado é **R$ 0/mês**, sem contar seu tempo de pesquisa/revisão, acesso à internet, tráfego além das cotas ou mudanças futuras nos termos. Cloudflare documenta até 500 builds mensais, 20 mil arquivos por site no Pages Free e 100 mil invocações/dia para Workers Free; os limites podem mudar.

Não há geração em tempo real no app e, no plano gratuito, não haverá chamada paga de IA. Pesquisar os dados nas fontes públicas, revisar e guardar os artigos aprovados no catálogo versionado; Pages serve os arquivos estáticos sem custo por leitura no cenário inicial. A meta de 20 artigos é de planejamento, não um limite técnico. Confira as cotas e licenças atuais das fontes antes de cada integração.

## Próxima implementação técnica

1. Testar consultas reais e ajustar buscas/ordenação para reduzir resultados irrelevantes.
2. Adicionar fontes primárias específicas por campo (por exemplo, APIs NASA/USGS/NOAA) com proveniência e termos de uso claramente indicados.
3. Acrescentar um backend de rascunhos persistente apenas se a exportação local deixar de ser suficiente; hoje nada grava diretamente no catálogo.
4. Revisar candidatos, ligar evidências às afirmações e validar links/licenças; publicar somente registros revisados no catálogo versionado.
5. Monitorar mudanças de cotas, falhas das APIs, correções editoriais e tempo de revisão.

## Tutoriais e sugestões de pauta

### Limites para novas pautas

A Sala de Calma e Estudo não aceita novas pautas cuja proposta central seja controversa, partidária ou voltada a disputas ideológicas. Isso inclui pautas eleitorais, propaganda religiosa ou política, conflitos em andamento tratados como torcida, teorias conspiratórias e ataques a grupos ou pessoas. O formulário apresenta e exige a confirmação dessa regra; o backend também exige o sinal de confirmação para novas pautas. Isso não é um filtro automático capaz de interpretar o tema: toda sugestão permanece pendente e precisa de revisão humana. Revisões factuais de conteúdo existente podem ser encaminhadas com fontes, independentemente do tema. Os demais limites estão em [Como contribuir](../CONTRIBUTING.md).

As contribuições devem ser educativas, respeitosas e verificáveis. A revisão humana avalia escopo e fontes, e não transforma o jogo ou as preferências de navegação em perfil secreto.

Os tutoriais web abrem um roteiro com materiais, etapas marcáveis, progresso e fontes associadas. Sugestões são enviadas para o endpoint `/api/submissions` e ficam pendentes no D1 quando o binding e o segredo estão configurados. Se a rede ou o serviço falhar, a fila local mantém a cópia e permite tentar novamente/exportar. O envio centralizado não publica conteúdo: uma pessoa precisa revisar as três fontes propostas, a independência, os direitos de acesso e as afirmações antes de qualquer inclusão no catálogo.
