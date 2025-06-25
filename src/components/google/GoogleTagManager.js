import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

// Componente principal de GTM
const GoogleTagManager = ({ gtmId }) => {
  useEffect(() => {
    if (!gtmId) {
      console.warn('Google Tag Manager: No GTM ID provided');
      return;
    }

    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    
    document.body.insertBefore(noscript, document.body.firstChild);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, [gtmId]);

  return null;
};


GoogleTagManager.propTypes = {
  gtmId: PropTypes.string.isRequired
};

// Hook para enviar eventos a GTM
export const useGTMEvent = () => {
  const pushEvent = (eventData) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(eventData);
    } else {
      console.warn('Google Tag Manager: dataLayer not found');
    }
  };

  return { pushEvent };
};

// Componente que reemplaza a AnalyticsTracker
// Trackea automáticamente los cambios de ruta
export const GTMRouteTracker = () => {
  const location = useLocation();
  const { pushEvent } = useGTMEvent();

  useEffect(() => {
    // Enviar page_view cada vez que cambia la ruta
    pushEvent({
      event: 'page_view',
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString()
    });
  }, [location.pathname, pushEvent]);

  return null;
};

export { GoogleTagManager };