import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CustomButton from './CustomButton';

describe('CustomButton Component', () => {
  it('renders button children correctly', () => {
    render(<CustomButton>Guardar</CustomButton>);
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  it('applies iconPosition class to icon element when icon is provided', () => {
    const { container: leftContainer } = render(
      <CustomButton icon="send" iconPosition="left">
        Enviar
      </CustomButton>
    );
    const leftIcon = leftContainer.querySelector('i.material-icons');
    expect(leftIcon).toBeInTheDocument();
    expect(leftIcon).toHaveClass('left');

    const { container: rightContainer } = render(
      <CustomButton icon="arrow_forward" iconPosition="right">
        Siguiente
      </CustomButton>
    );
    const rightIcon = rightContainer.querySelector('i.material-icons');
    expect(rightIcon).toBeInTheDocument();
    expect(rightIcon).toHaveClass('right');
  });

  it('renders pending state with preloader when isPending is true', () => {
    render(
      <CustomButton isPending isPendingText="Cargando...">
        Guardar
      </CustomButton>
    );
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('uses tooltip as aria-label for icon-only button when aria-label is not provided', () => {
    render(<CustomButton icon="edit" tooltip="Editar elemento" />);
    expect(screen.getByRole('button', { name: 'Editar elemento' })).toBeInTheDocument();
  });
});
