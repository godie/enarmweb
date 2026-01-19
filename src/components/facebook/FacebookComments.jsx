import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Component to render Facebook Comments plugin
 *
 * Props:
 * - appId: Facebook App ID (required)
 * - href: URL for which comments are loaded (required)
 * - numPosts: number of posts to display
 * - width: width of the comments box
 * - locale: Facebook SDK locale (default: 'es_LA')
 * - version: Facebook Graph version (default: 'v23.0')
 */
export default function FacebookComments({
  appId,
  href,
  numPosts,
  width,
  locale,
  version = 'v23.0'
}) {
  useEffect(() => {
    // Insert fb-root div if not present
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.insertBefore(fbRoot, document.body.firstChild);
    }

    // Load SDK if not already loaded
    if (!document.getElementById('facebook-jssdk')) {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version
        });
      };

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = `https://connect.facebook.net/${locale}/sdk.js#xfbml=1&version=${version}&appId=${appId}`;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    } else {
      // If SDK already loaded, parse XFBML
      if (window.FB && window.FB.XFBML) {
        window.FB.XFBML.parse();
      }
    }
  }, [appId, locale, version]);

  return (
    <div>
      <div className="fb-comments"
        data-href={href}
        data-width={width}
        data-numposts={numPosts}>
      </div>
    </div>
  );
}

FacebookComments.propTypes = {
  appId: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  numPosts: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locale: PropTypes.string,
  version: PropTypes.string
};

FacebookComments.defaultProps = {
  numPosts: 5,
  width: '',
  locale: 'es_LA',
  version: 'v23.0'
};
