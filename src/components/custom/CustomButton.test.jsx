
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import CustomButton from './CustomButton';

describe('CustomButton Accessibility', () => {
  test('automatically derives aria-label from tooltip for icon-only button', () => {
    render(
      <CustomButton
        icon="edit"
        tooltip="Editar registro"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Editar registro');

    // Icon should be aria-hidden
    const icon = button.querySelector('.material-icons');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('strips HTML from tooltip when deriving aria-label', () => {
    render(
      <CustomButton
        icon="delete"
        tooltip="<span>Eliminar</span> <b>item</b>"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Eliminar item');
  });

  test('uses isPendingText as aria-label when in pending state', () => {
    render(
      <CustomButton
        isPending={true}
        isPendingText="Cargando..."
      >
        Enviar
      </CustomButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Cargando...');
  });

  test('does not override manual aria-label', () => {
    render(
      <CustomButton
        icon="add"
        tooltip="Agregar nuevo"
        aria-label="Mi label personalizado"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Mi label personalizado');
  });

  test('does not set aria-label from tooltip if children are present', () => {
    render(
      <CustomButton
        icon="info"
        tooltip="Más información"
      >
        Info
      </CustomButton>
    );

    const button = screen.getByRole('button');
    // It should NOT have aria-label because children are present (content is enough)
    expect(button).not.toHaveAttribute('aria-label');
  });

  test('sets aria-label for FAB buttons', () => {
    render(
      <CustomButton
        fab
        tooltip="Acciones"
      />
    );

    // The FAB link should have aria-label
    const fabLink = screen.getByRole('link');
    expect(fabLink).toHaveAttribute('aria-label', 'Acciones');
  });
});
