'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, RefreshCw } from 'lucide-react';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface PreviewProps {
  code: string;
  className?: string;
}

export function Preview({ code, className = '' }: PreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const viewportDimensions = {
    desktop: { width: '100%', height: '100%', maxWidth: 'none' },
    tablet: { width: '768px', height: '1024px', maxWidth: '768px' },
    mobile: { width: '375px', height: '667px', maxWidth: '375px' },
  };

  const refresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  useEffect(() => {
    // Reset error when code changes
    setError(null);
    refresh();
  }, [code]);

  // Build iframe content
  const buildIframeContent = () => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      * {
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>

    <script type="module">
      import React, { useState, useEffect } from 'https://esm.sh/react@18';
      import { createRoot } from 'https://esm.sh/react-dom@18/client';

      // Error boundary
      class ErrorBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false, error: null };
        }

        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }

        componentDidCatch(error, errorInfo) {
          console.error('Preview error:', error, errorInfo);
          window.parent.postMessage({ type: 'error', error: error.message }, '*');
        }

        render() {
          if (this.state.hasError) {
            return React.createElement('div', {
              style: {
                padding: '20px',
                backgroundColor: '#fee',
                color: '#c00',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
              }
            }, 'Error: ' + (this.state.error?.message || 'Unknown error'));
          }

          return this.props.children;
        }
      }

      try {
        ${code}

        const root = createRoot(document.getElementById('root'));
        root.render(
          React.createElement(ErrorBoundary, null,
            React.createElement(GeneratedSite || (() => React.createElement('div', null, 'No component found')))
          )
        );

        window.parent.postMessage({ type: 'ready' }, '*');
      } catch (error) {
        console.error('Failed to render:', error);
        document.getElementById('root').innerHTML =
          '<div style="padding: 20px; background-color: #fee; color: #c00; font-family: monospace; white-space: pre-wrap;">Error: ' +
          error.message +
          '</div>';
        window.parent.postMessage({ type: 'error', error: error.message }, '*');
      }
    </script>
  </body>
</html>
    `.trim();
  };

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'error') {
        setError(event.data.error);
      } else if (event.data.type === 'ready') {
        setError(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b p-2 bg-muted/50">
        <div className="flex items-center gap-1">
          <Button
            variant={viewport === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewport('desktop')}
            className="gap-2"
          >
            <Monitor className="h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant={viewport === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewport('tablet')}
            className="gap-2"
          >
            <Tablet className="h-4 w-4" />
            Tablet
          </Button>
          <Button
            variant={viewport === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewport('mobile')}
            className="gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={refresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Обновить
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 m-4">
          <div className="font-semibold text-destructive mb-1">Ошибка рендеринга</div>
          <div className="text-sm text-destructive/80 font-mono">{error}</div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-muted/20 p-4">
        <div
          className="mx-auto bg-white shadow-lg transition-all duration-300"
          style={{
            width: viewportDimensions[viewport].width,
            maxWidth: viewportDimensions[viewport].maxWidth,
            height: viewport === 'desktop' ? '100%' : viewportDimensions[viewport].height,
            minHeight: viewport === 'desktop' ? '600px' : undefined,
          }}
        >
          <iframe
            key={iframeKey}
            ref={iframeRef}
            srcDoc={buildIframeContent()}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
