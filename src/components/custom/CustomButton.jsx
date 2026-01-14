import React, { useEffect, useRef, Children } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, FloatingActionButton } from '@materializecss/materialize';

const CustomButton = ({
  children,
  className = '',
  disabled = false,
  node = 'button',
  href,
  tooltip,
  waves = 'light',
  type = 'button',
  icon,
  iconPosition = 'left',
  floating,
  large,
  small,
  flat,
  onClick,
  fab,
  ...props // Cualquier otra prop que SI debe pasar al DOM
}) => {
  const elementRef = useRef(null);
  const fabRef = useRef(null);
  const fabButtonRef = useRef(null);


  // Tooltip initialization
  useEffect(() => {
    let tooltipInstance = null;
    if (tooltip && elementRef.current && Tooltip) {
      const tooltipOptions = typeof tooltip === 'object' ? tooltip : { html: tooltip };
      tooltipInstance = Tooltip.init(elementRef.current, tooltipOptions);
    }
    return () => {
      if (tooltipInstance) {
        tooltipInstance.destroy();
      }
    };
  }, [tooltip]);

  // FAB initialization
  useEffect(() => {
    if (fab && fabRef.current && FloatingActionButton) {
      const fabOptions = typeof fab === 'object' ? fab : {};
      const instance = FloatingActionButton.init(fabRef.current, fabOptions);
      return () => {
        if (instance) {
          instance.destroy();
        }
      };
    }
  }, [fab]);

  // FAB tooltip initialization
  useEffect(() => {
    let tooltipInstance = null;
    if (fab && tooltip && fabButtonRef.current && Tooltip) {
      const tooltipOptions = typeof tooltip === 'object' ? tooltip : { html: tooltip };
      tooltipInstance = Tooltip.init(fabButtonRef.current, tooltipOptions);
    }
    return () => {
      if (tooltipInstance) {
        tooltipInstance.destroy();
      }
    };
  }, [fab, tooltip]);

  // Construir clases dinámicamente
  let combinedClassName = `btn waves-effect waves-${waves} ${className}`;

  if (disabled) {
    combinedClassName = `btn disabled ${className}`;
  }

  // Aplicar modificadores de estilo
  if (floating) combinedClassName += ' btn-floating';
  if (large) combinedClassName += ' btn-large';
  if (small) combinedClassName += ' btn-small';
  if (flat) combinedClassName = `btn-flat waves-effect waves-${waves} ${className}`;

  if (tooltip) {
    combinedClassName += ' tooltipped';
  }

  // Renderizar icono si existe
  const iconElement = icon ? (
    <i className="material-icons">{icon}</i>
  ) : null;

  // Render FAB if enabled
  const renderFab = (classes) => {
    //const fabClasses = `btn-floating btn-large waves-effect waves-${waves} ${className}`;
    const fabToolbar = typeof fab === 'object' && fab.toolbarEnabled;

    const fabButtonProps = {
      ref: fabButtonRef,
      className: classes,
      href: href || '#!'
    };

    if (tooltip && typeof tooltip === 'string') {
      fabButtonProps['data-tooltip'] = tooltip;
      fabButtonProps['data-position'] = 'top'; // default position for FAB
    }

    return (
      <div
        ref={fabRef}
        className={`fixed-action-btn${fabToolbar ? ' toolbar' : ''}`}
        {...props}
      >
        <a {...fabButtonProps}>
          {iconElement || <i className="material-icons">edit</i>}
        </a>
        <ul>
          {Children.map(children, (child, index) => (
            <li key={index}>{child}</li>
          ))}
        </ul>
      </div>
    );
  };

  // Si es FAB, renderizar el componente FAB
  if (fab) {
    return renderFab(combinedClassName);
  }

  // Contenido normal del botón
  const content = (
    <>
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </>
  );

  // Elegir el componente a renderizar
  const Component = node;

  // Props comunes para ambos elementos
  const commonProps = {
    ref: elementRef,
    className: combinedClassName,
    disabled,
    onClick,
    ...props // Solo las props restantes que no hemos destructurado
  };

  if (tooltip && typeof tooltip === 'string') {
    commonProps['data-tooltip'] = tooltip;
    commonProps['data-position'] = 'bottom'; // default position
  }

  if (Component === 'a') {
    return (
      <Component
        {...commonProps}
        href={href || '#!'}
      >
        {content}
      </Component>
    );
  }

  return (
    <Component
      {...commonProps}
      type={type}
    >
      {content}
    </Component>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  node: PropTypes.oneOf(['button', 'a']),
  href: PropTypes.string,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      html: PropTypes.string,
      position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
      delay: PropTypes.number,
      exitDelay: PropTypes.number,
      enterDelay: PropTypes.number,
      margin: PropTypes.number,
      inDuration: PropTypes.number,
      outDuration: PropTypes.number,
      transitionMovement: PropTypes.number
    })
  ]),
  waves: PropTypes.oneOf([
    'light',
    'red',
    'yellow',
    'orange',
    'purple',
    'green',
    'teal'
  ]),
  type: PropTypes.string,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
  floating: PropTypes.bool,
  large: PropTypes.bool,
  small: PropTypes.bool,
  flat: PropTypes.bool,
  /**
   * Fixed action button
   * If enabled, any children button will be rendered as actions
   * @default false
   * @default options {
   *  direction: 'top',
   *  hoverEnabled: true,
   *  toolbarEnabled: false,
   * }
   */
  fab: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      direction: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
      hoverEnabled: PropTypes.bool,
      toolbarEnabled: PropTypes.bool
    })
  ]),
};

CustomButton.defaultProps = {
  node: 'button',
  waves: 'light',
  type: 'button',
  iconPosition: 'left',
  className: '',
  disabled: false,
};

export default CustomButton;