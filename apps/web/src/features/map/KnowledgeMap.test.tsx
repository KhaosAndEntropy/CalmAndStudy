// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { topics } from '@calmandstudy/content';
import { KnowledgeMap } from './KnowledgeMap';

describe('KnowledgeMap', () => {
  it('filtra por assunto e área e orienta quando não encontra pontos', () => {
    render(<KnowledgeMap topics={topics} onOpenTopic={vi.fn()} />);
    const search = screen.getByRole('textbox', { name: 'Buscar assunto no mapa' });
    fireEvent.change(search, { target: { value: 'termo que não existe' } });

    expect(screen.getByText('0 assuntos · 0 conexões')).toBeTruthy();
    expect(screen.getByText('Nenhum assunto encontrado')).toBeTruthy();

    fireEvent.change(search, { target: { value: topics[0].title } });
    expect(screen.getByRole('combobox', { name: 'Assunto selecionado' })).toHaveProperty(
      'value',
      topics[0].id,
    );
    expect(screen.getByRole('button', { name: `Ler artigo: ${topics[0].title}` })).toBeTruthy();
  });

  it('apresenta a sequência como antes, agora e próximo passo', () => {
    const onOpenTopic = vi.fn();
    render(<KnowledgeMap topics={topics} onOpenTopic={onOpenTopic} />);
    const firstTopic = topics.find(topic => topic.relatedTopics?.length) ?? topics[0];
    fireEvent.change(screen.getByRole('combobox', { name: 'Assunto selecionado' }), {
      target: { value: firstTopic.id },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ler artigo/ }));

    expect(onOpenTopic).toHaveBeenCalledWith(firstTopic);
    expect(screen.getByRole('heading', { name: 'Você está aqui' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Para entender antes' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Próximo passo' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Assuntos que conversam com este' })).toBeTruthy();
  });

  it('apresenta filtros e relações editoriais com rótulos acessíveis', () => {
    render(<KnowledgeMap topics={topics} onOpenTopic={vi.fn()} />);

    expect(screen.getByRole('combobox', { name: 'Área' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Assunto selecionado' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Para entender antes' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Próximo passo' })).toBeTruthy();
  });

  it('mostra a sequência como opção inicial e alterna entre árvore e grafo', () => {
    render(<KnowledgeMap topics={topics} onOpenTopic={vi.fn()} />);
    const sequence = screen.getByRole('button', { name: /Sequência/ });
    const tree = screen.getByRole('button', { name: /Árvore/ });
    const graph = screen.getByRole('button', { name: /Grafo/ });

    expect(sequence.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(tree);
    expect(tree.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('region', { name: 'Árvore de relações do assunto' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Bases sugeridas' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Próximos passos' })).toBeTruthy();

    fireEvent.click(graph);
    expect(graph.getAttribute('aria-pressed')).toBe('true');

    expect(screen.getByRole('heading', { name: 'Uma visão de toda a rede' })).toBeTruthy();
    expect(screen.getByRole('region', { name: /Grafo; em telas estreitas/ })).toBeTruthy();
    expect(screen.getAllByRole('button', { pressed: false }).length).toBeGreaterThan(1);

    const anotherTopic = topics[1];
    fireEvent.click(
      screen.getByRole('button', { name: `${anotherTopic.title}, ${anotherTopic.field}` }),
    );
    expect(screen.getByRole('combobox', { name: 'Assunto selecionado' })).toHaveProperty(
      'value',
      anotherTopic.id,
    );

    fireEvent.click(sequence);
    expect(screen.getByRole('heading', { name: 'Você está aqui' })).toBeTruthy();
  });

  it('adapta a apresentação do mapa ao Modo aventura sem alterar os assuntos', () => {
    render(<KnowledgeMap topics={topics} onOpenTopic={vi.fn()} mode="adventure" />);

    expect(screen.getByText('MAPA DA EXPEDIÇÃO')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Trace seu próximo caminho de descoberta.' }),
    ).toBeTruthy();
    expect(screen.getByText(/constelação completa de assuntos/)).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Assunto selecionado' })).toBeTruthy();
  });
});
