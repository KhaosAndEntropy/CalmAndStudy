# Sala de Calma e Estudo

Sala de Calma e Estudo é um projeto gratuito de aprendizagem. Reúne artigos curtos, trilhas, tutoriais e fontes abertas para ajudar qualquer pessoa a explorar diferentes assuntos no próprio ritmo.

Há dois modos de estudo — **Estudo calmo** e **Modo aventura** — com o mesmo conteúdo e os mesmos critérios editoriais. O projeto valoriza fontes verificáveis, transparência sobre incertezas, privacidade e bem-estar.

## Começar em poucos minutos

Requisitos: Node.js 22.13 ou superior e pnpm 10.

```sh
pnpm install
pnpm dev
```

Abra [http://localhost:4173](http://localhost:4173). Para usar Docker, basta ter o Docker Desktop iniciado e executar:

```sh
docker compose up --build
```

Mais detalhes: [guia para rodar localmente](docs/RODAR_LOCALMENTE.md).

## Onde encontrar as coisas

- `apps/web`: site responsivo e PWA.
- `packages/content`: artigos, áreas, trilhas, tutoriais e exercícios.
- `packages/research`: pesquisa em fontes públicas.
- `functions`: API e migrações do Cloudflare D1.
- `docs`: guias para leitores, desenvolvedores e mantenedores.

## Contribuir

O código usa licença [MIT](LICENSE). Os textos originais de aprendizagem usam [CC BY 4.0](CONTENT-LICENSE.md); conteúdos de terceiros mantêm suas próprias licenças e atribuições.

Contribuições são bem-vindas quando têm propósito educativo, linguagem respeitosa e fontes verificáveis. Consulte [como contribuir](CONTRIBUTING.md) antes de abrir uma proposta.

Quem desejar também pode conhecer a opção de [apoio voluntário](docs/APOIO_VOLUNTARIO.md). Ela não é necessária para usar o projeto e não altera o acesso ao conteúdo.

## Guias

O [índice da documentação](docs/README.md) aponta para o guia certo conforme o que você quer fazer: conhecer o projeto, executar, contribuir, entender a arquitetura ou publicar.

## Idiomas

- [Português (Brasil)](docs/pt-BR/README.md)
- [English](docs/en/README.md)
- [Español](docs/es/README.md)

## Usar no celular

Abra o site no navegador do celular e escolha **Instalar a Sala de Calma e Estudo** ou **Adicionar à tela inicial**. É a versão web responsiva instalada como PWA; não é necessário instalar um aplicativo separado.
