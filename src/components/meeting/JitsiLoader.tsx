import { useEffect, useState } from 'react';

interface JitsiLoaderProps {
  children: (isLoaded: boolean) => React.ReactNode;
}

export const JitsiLoader = ({ children }: JitsiLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.JitsiMeetExternalAPI) {
      setIsLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://8x8.vc/vpaas-magic-cookie-016384bdf9444c6795aaf6aadb640f8b/external_api.js';
    script.async = true;
    
    // Handle script load
    script.onload = () => {
      console.log('Jitsi Meet API script loaded successfully');
      setIsLoaded(true);
    };

    // Handle script error
    script.onerror = () => {
      console.error('Failed to load Jitsi Meet API script');
      setIsLoaded(false);
    };

    // Add script to document
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <>{children(isLoaded)}</>;
};

export default JitsiLoader;
