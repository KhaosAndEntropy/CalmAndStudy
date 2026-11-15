# Receber sugestões e referências

O site e o app enviam sugestões de temas, revisões de artigos e pacotes de referências para uma fila privada no Cloudflare D1. Nada é publicado automaticamente. Se o servidor estiver indisponível ou a pessoa atingir o limite diário, os dados ficam no navegador para tentar reenviar. Arquivos JSON podem ser baixados como cópia manual, mas o site e o app não importam arquivos.

## Configurar no Cloudflare Pages

1. Crie um banco D1, por exemplo `calmandstudy-submissions`.
2. Execute `functions/migrations/0001_submissions.sql` e `functions/migrations/0002_content_engagement.sql` nesse banco pela tela **D1 > Console** do painel Cloudflare. A primeira cria a fila e os limites; a segunda habilita leituras, curtidas e estatísticas.
3. No projeto Pages, em **Settings > Functions > D1 database bindings**, crie o binding `DB` apontando para esse banco.
4. Em **Settings > Variables and Secrets**, adicione o segredo `SUBMISSION_HASH_SECRET` com pelo menos 32 caracteres aleatórios.
5. Recomendado para manter a busca multidisciplinar em produção: adicione `OPENALEX_API_KEY` como segredo em **Settings > Variables and Secrets** (chave gratuita em https://openalex.org/settings/api). Sem ela, a busca básica ainda tenta consultar OpenAlex, mas a cota pública pode acabar.
6. Faça um novo deploy para aplicar os bindings à Function.

Sem esses dois bindings, o endpoint responde que o recebimento ainda não está configurado. O site mantém cópias locais e permite baixar JSON enquanto isso.

## Limite e privacidade

- Cada endereço de rede pode enviar até cinco itens por dia UTC, somando sugestões de tema, revisões e pacotes de fontes. A resposta informa quando o limite renova; a interface mostra o horário local.
- Os endpoints de pesquisa, checagem de links e envios têm também limites por minuto no D1: 20, 12 e 10 requisições, respectivamente. A checagem é compartilhada entre deploys e não depende da memória temporária de uma instância.
- O backend usa HMAC com `SUBMISSION_HASH_SECRET` para contar o limite. O endereço IP não é gravado nas sugestões; a tabela de limite guarda somente o resumo HMAC e a data UTC, removendo datas anteriores quando recebe novos envios.
- Envie somente o necessário para a curadoria. A fila contém os textos e links enviados pela pessoa, sem endpoint público de consulta.
- Pacotes JSON devem ser tratados como rascunhos. Metadados e acesso aberto não substituem leitura e revisão humana das fontes.

## Revisar a fila

No console D1, consulte as sugestões pendentes:

```sql
SELECT id, kind, title, field, article_id, reason, created_at, status
FROM submissions
WHERE status = 'pending'
ORDER BY created_at DESC;
```

Para ver o pacote original de fontes ou detalhes do envio, consulte `payload_json` para o `id` escolhido. Atualize `status` para `in_review`, `accepted` ou `rejected` durante a triagem. Ainda não existe painel editorial; o banco permanece acessível somente a quem tem acesso ao projeto Cloudflare.

## Tentar novamente depois do limite

No site, mantenha o mesmo navegador e dispositivo: sugestões e referências pendentes ficam salvas localmente. Use **Reenviar pendentes** na área de sugestões ou **Enviar para curadoria** no Caderno de Pesquisa depois que o limite renovar. O identificador original é preservado para que uma confirmação perdida não gere cópias duplicadas. A API informa a data/hora de renovação.

O botão **Baixar cópia JSON** existe apenas como backup manual. Não há mecanismo para reimportar esse arquivo no app ou no site.

## Desenvolvimento local

O servidor Vite não executa Pages Functions. Para validar o envio localmente, rode o projeto com Cloudflare Pages/Wrangler e bindings D1 locais; enquanto isso não estiver configurado, o site guardará a sugestão e permitirá exportar o JSON. Não coloque `SUBMISSION_HASH_SECRET` no frontend nem no repositório.
