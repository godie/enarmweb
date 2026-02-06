import { useEffect, useRef, Children } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, FloatingActionButton } from '@materializecss/materialize';
import CustomPreloader from './CustomPreloader';

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
  medium,
  flat,
  onClick,
  fab,
  isPending = false,
  isPendingText = '',
  ...props // Cualquier otra prop que SI debe pasar al DOM
}) => {
  const elementRef = useRef(null);
  const fabRef = useRef(null);
  const fabButtonRef = useRef(null);


  // Tooltip initialization
  useEffect(() => {
    let tooltipInstance = null;
    if (tooltip && elementRef.current && Tooltip) {
      const tooltipOptions = typeof tooltip === 'object'
        ? { ...tooltip, text: tooltip.text || tooltip.html }
        : { text: tooltip };
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
      const tooltipOptions = typeof tooltip === 'object'
        ? { ...tooltip, text: tooltip.text || tooltip.html }
        : { text: tooltip };
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

  if (disabled || isPending) {
    combinedClassName = `btn disabled ${className}`;
  }

  // Aplicar modificadores de estilo
  if (floating) combinedClassName += ' btn-floating';
  if (large) combinedClassName += ' btn-large';
  if (medium) combinedClassName += ' btn-medium';
  if (small) combinedClassName += ' btn-small';
  if (flat) combinedClassName = `btn-flat waves-effect waves-${waves} ${className}`;

  if (tooltip) {
    combinedClassName += ' tooltipped';
  }

  // Renderizar icono si existe
  const iconElement = icon ? (
    <i className="material-icons" aria-hidden="true">{icon}</i>
  ) : null;

  const getCleanLabel = (input) => {
    const text = typeof input === 'string' ? input : (input?.text || input?.html);
    return text ? text.replace(/<[^>]*>?/gm, '') : undefined;
  };

  // Render FAB if enabled
  const renderFab = (classes) => {
    //const fabClasses = `btn-floating btn-large waves-effect waves-${waves} ${className}`;
    const fabToolbar = typeof fab === 'object' && fab.toolbarEnabled;

    const fabButtonProps = {
      className: classes,
      href: href || '#!',
      'aria-label': props['aria-label'] || getCleanLabel(tooltip)
    };

    if (tooltip) {
      if (typeof tooltip === 'string') {
        fabButtonProps['data-tooltip'] = tooltip;
        fabButtonProps['data-position'] = 'top';
      } else {
        fabButtonProps['data-tooltip'] = tooltip.text || tooltip.html || '';
        fabButtonProps['data-position'] = tooltip.position || 'top';
      }
    }

    return (
      <div
        ref={fabRef}
        className={`fixed-action-btn${fabToolbar ? ' toolbar' : ''}`}
        {...props}
      >
        <a {...fabButtonProps} ref={fabButtonRef}>
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
  const content = isPending ? (
    <span className="valign-wrapper" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
      <CustomPreloader size="small" color="green" />
      {isPendingText && <span style={{ marginLeft: '10px' }}>{isPendingText}</span>}
    </span>
  ) : (
    <>
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </>
  );

  // Elegir el componente a renderizar
  const Component = node;

  // Derive aria-label for accessibility
  const hasNoChildren = Children.count(children) === 0;
  let autoAriaLabel = props['aria-label'];

  if (!autoAriaLabel) {
    if (isPending && isPendingText) {
      autoAriaLabel = isPendingText;
    } else if (hasNoChildren && icon) {
      autoAriaLabel = getCleanLabel(tooltip);
    }
  }

  // Props comunes para ambos elementos
  const commonProps = {
    className: combinedClassName,
    disabled,
    onClick,
    'aria-label': autoAriaLabel,
    ...props // Solo las props restantes que no hemos destructurado
  };

  if (tooltip) {
    if (typeof tooltip === 'string') {
      commonProps['data-tooltip'] = tooltip;
      commonProps['data-position'] = 'bottom';
    } else {
      commonProps['data-tooltip'] = tooltip.text || tooltip.html || '';
      commonProps['data-position'] = tooltip.position || 'bottom';
    }
  }

  if (Component === 'a') {
    return (
      <Component
        {...commonProps}
        ref={elementRef}
        href={href || '#!'}
      >
        {content}
      </Component>
    );
  }

  return (
    <Component
      ref={elementRef}
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
  medium: PropTypes.bool,
  flat: PropTypes.bool,
  isPending: PropTypes.bool,
  isPendingText: PropTypes.string,
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