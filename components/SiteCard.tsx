'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Eye, Globe } from 'lucide-react';
import Link from 'next/link';

interface SiteCardProps {
  site: {
    id: string;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    thumbnail_url?: string | null;
    created_at: string;
    updated_at: string;
  };
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export function SiteCard({ site, onDelete, onPublish }: SiteCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1">{site.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              /{site.slug}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/editor/${site.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/preview/${site.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Превью
                </Link>
              </DropdownMenuItem>
              {site.status === 'draft' && onPublish && (
                <DropdownMenuItem onClick={() => onPublish(site.id)}>
                  <Globe className="mr-2 h-4 w-4" />
                  Опубликовать
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(site.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="aspect-video bg-muted rounded-md overflow-hidden">
          {site.thumbnail_url ? (
            <img
              src={site.thumbnail_url}
              alt={site.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Globe className="h-12 w-12" />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-2">
          <Badge variant={site.status === 'published' ? 'default' : 'secondary'}>
            {site.status === 'published' ? 'Опубликован' : 'Черновик'}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(site.updated_at)}
        </div>
      </CardFooter>
    </Card>
  );
}
