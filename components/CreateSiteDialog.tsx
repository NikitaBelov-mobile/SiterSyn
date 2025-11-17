'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STYLES = [
  { value: 'min', label: 'Минималистичный' },
  { value: 'cor', label: 'Корпоративный' },
  { value: 'cre', label: 'Креативный' },
  { value: 'mod', label: 'Современный' },
];

const SITE_TYPES = [
  { value: 'lp', label: 'Landing Page' },
  { value: 'pf', label: 'Портфолио' },
  { value: 'ec', label: 'E-commerce' },
  { value: 'bl', label: 'Блог' },
];

const EXAMPLES = [
  'Создайте минималистичную landing page для SaaS продукта с hero секцией и тремя фичами',
  'Современный сайт-портфолио для дизайнера с галереей работ',
  'Корпоративный сайт для консалтинговой компании',
  'Креативная страница для музыкального фестиваля',
];

export function CreateSiteDialog() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('min');
  const [siteType, setSiteType] = useState('lp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Пожалуйста, введите описание сайта');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style,
          siteType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось создать сайт');
      }

      if (data.success && data.site) {
        // Redirect to editor
        router.push(`/editor/${data.site.id}`);
        setOpen(false);
        setPrompt('');
      } else {
        throw new Error(data.error || 'Неизвестная ошибка');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Создать новый сайт
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создать новый сайт</DialogTitle>
          <DialogDescription>
            Опишите, какой сайт вы хотите создать, и AI сгенерирует его за несколько секунд.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Описание сайта</Label>
            <Textarea
              id="prompt"
              placeholder="Например: Создайте минималистичную landing page для SaaS продукта..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Examples */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Примеры:</Label>
            <div className="grid gap-2">
              {EXAMPLES.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="text-left text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Style and Type Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteType">Тип сайта</Label>
              <Select value={siteType} onValueChange={setSiteType}>
                <SelectTrigger id="siteType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SITE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Стиль</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Генерация...
              </>
            ) : (
              'Создать сайт'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
