# Acessibilidade da Calm & Study Web

A interface web foi ajustada para reduzir barreiras de uso por teclado, leitores de tela, ampliação e preferências do sistema. A meta de implementação é se aproximar do nível AA das WCAG 2.2; isso não equivale a uma certificação nem substitui avaliação com pessoas com deficiência.

## O que a interface oferece

- Idioma da página definido como português do Brasil, landmarks de navegação e conteúdo e atalho para pular direto ao conteúdo.
- Controles nativos com rótulos claros, estado selecionado anunciado e alvos de toque maiores.
- Foco de teclado visível, menu móvel operável por teclado e diálogos que recebem foco, prendem a navegação enquanto abertos, fecham com `Esc` e devolvem o foco ao fechar.
- Mensagens de carregamento, resultados e erros anunciadas por tecnologias assistivas; progresso exposto como valor, não só por cor.
- Ilustrações com descrição acessível, ícones decorativos ocultos de leitores de tela e cartões com títulos interativos semanticamente válidos.
- Suporte a redução de movimento, alto contraste do sistema, cores forçadas e zoom/refluxo em telas estreitas.
- Texto secundário com contraste reforçado nas paletas disponíveis.

## Conferência manual recomendada

Antes de uma divulgação ampla, percorra cada tela apenas com `Tab`, `Shift+Tab`, `Enter`, `Espaço` e `Esc`; teste zoom do navegador em 200% e 400%, contraste forçado do Windows e ao menos um leitor de tela (NVDA com Firefox/Chrome ou VoiceOver com Safari). Verifique especialmente descoberta, filtros, leitura de artigo, tutoriais, pesquisa, preferências e sugestões.

Os testes de tipo e build garantem compilação, mas não comprovam conformidade WCAG. Conteúdo e futuras mudanças também precisam manter títulos em ordem, rótulos, contraste e comportamento de foco.
