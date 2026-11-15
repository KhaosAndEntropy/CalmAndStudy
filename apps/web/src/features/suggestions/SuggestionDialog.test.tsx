import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SuggestionDialog } from './SuggestionDialog';

describe('SuggestionDialog', () => {
  it('exige que novas pautas confirmem os limites editoriais e incluam três fontes', () => {
    render(
      <SuggestionDialog
        draft={{
          title: '',
          field: '',
          reason: '',
          source: '',
          sources: Array.from({ length: 3 }, () => ({ publisher: '', url: '' })),
          kind: 'topic',
        }}
        setDraft={vi.fn()}
        suggestions={[]}
        submitting={false}
        message=""
        onClose={vi.fn()}
        onSave={vi.fn()}
        onRetry={vi.fn()}
      />,
    );

    expect(
      (
        screen.getByRole('checkbox', {
          name: /confirmo que a proposta é educativa/i,
        }) as HTMLInputElement
      ).required,
    ).toBe(true);
    expect(screen.getAllByLabelText(/^Link HTTPS [123]$/)).toHaveLength(3);
    expect(screen.getByText(/não aceitamos pautas controversas/i)).toBeTruthy();
  });
});
