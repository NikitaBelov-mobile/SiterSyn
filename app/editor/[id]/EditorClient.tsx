'use client';

import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/Chat/ChatInterface';
import { Preview } from '@/components/Editor/Preview';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Globe, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Site {
  id: string;
  title: string;
  slug: string;
  code: string;
  toon_spec: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface EditorClientProps {
  site: Site;
}

export function EditorClient({ site: initialSite }: EditorClientProps) {
  const [site, setSite] = useState(initialSite);
  const [code, setCode] = useState(initialSite.code);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(code !== site.code);
  }, [code, site.code]);

  // Auto-save
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 5000); // Auto-save after 5 seconds of no changes

    return () => clearTimeout(timer);
  }, [code, hasUnsavedChanges]);

  const handleCodeUpdate = (newCode: string) => {
    setCode(newCode);
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges || saving) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const data = await response.json();
      if (data.site) {
        setSite(data.site);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    await handleSave();

    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'published',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish');
      }

      const data = await response.json();
      if (data.site) {
        setSite(data.site);
        alert('Сайт опубликован!');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Не удалось опубликовать сайт');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.slug}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div>
              <h1 className="font-semibold">{site.title}</h1>
              <p className="text-sm text-muted-foreground">/{site.slug}</p>
            </div>

            <Badge variant={site.status === 'published' ? 'default' : 'secondary'}>
              {site.status === 'published' ? 'Опубликован' : 'Черновик'}
            </Badge>

            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Несохранённые изменения
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Скачать код
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || saving}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Сохранить
            </Button>

            {site.status === 'draft' && (
              <Button size="sm" onClick={handlePublish} className="gap-2">
                <Globe className="h-4 w-4" />
                Опубликовать
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - Left */}
        <div className="w-96 border-r flex flex-col bg-background">
          <ChatInterface
            siteId={site.id}
            currentCode={code}
            onCodeUpdate={handleCodeUpdate}
          />
        </div>

        {/* Preview Panel - Right */}
        <div className="flex-1 overflow-hidden">
          <Preview code={code} />
        </div>
      </div>
    </div>
  );
}
