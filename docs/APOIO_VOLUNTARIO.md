# Apoio voluntário por Pix

O Estude com Calma continua gratuita e aberta. Quem gostar do projeto e quiser — e puder — pode contribuir voluntariamente por Pix. Não há assinatura, meta, recompensa, conteúdo exclusivo nem mudança no acesso para quem não contribui.

## Como a opção funciona

- A área **Apoiar o projeto** fica disponível nos menus e no rodapé, nos dois modos de estudo.
- O QR e o código Pix são montados localmente no navegador. A chave não é enviada a um serviço de QR externo.
- Antes de confirmar, confira no aplicativo do banco o nome do destinatário e o valor escolhido.
- O projeto não recebe confirmação da transferência, não registra quem contribuiu e não guarda dados bancários.
- O Pix é destinado à pessoa responsável pelo projeto; não é doação a uma instituição beneficente e não há benefício fiscal prometido.

## Configuração de publicação

Para mostrar o QR, configure estas três variáveis no ambiente de build do Cloudflare Pages e gere uma nova publicação:

```text
VITE_DONATION_PIX_KEY=chave-pix-destinada-a-receber
VITE_DONATION_PIX_NAME=NOME DO RECEBEDOR
VITE_DONATION_PIX_CITY=CIDADE
```

O nome aceita até 25 caracteres e a cidade até 15, conforme os limites do formato Pix usado pelo QR. Use a chave e o nome que devem aparecer publicamente ao pagador. Se os valores não estiverem configurados ou forem inválidos, a página continua acessível e explica que o Pix está indisponível.

### Privacidade da configuração

Como o site é uma aplicação estática, valores com prefixo `VITE_` são incorporados ao JavaScript enviado ao navegador. Eles **não são secrets** após a publicação. Isso é esperado para uma chave Pix que precisa ser lida pelo app bancário, mas nunca coloque aqui senhas, tokens ou credenciais privadas. Configure somente a chave pública escolhida para receber contribuições.

## Transparência

O apoio não financia uma assinatura nem compra serviços ou resultados. A contribuição é espontânea e não interfere na seleção de temas, revisão editorial, fontes, recomendações ou prioridades do catálogo.
