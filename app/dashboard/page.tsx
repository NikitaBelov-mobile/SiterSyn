import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SiteCard } from '@/components/SiteCard';
import { CreateSiteDialog } from '@/components/CreateSiteDialog';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('credits, tier, full_name, email')
    .eq('id', user.id)
    .single();

  const profile = profileData as any;

  // Fetch user sites
  const { data: sitesData, error: sitesError } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const sites = sitesData as any;

  if (sitesError) {
    console.error('Failed to fetch sites:', sitesError);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Мои сайты</h1>
              <p className="text-sm text-muted-foreground">
                {profile?.email || user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Кредиты</div>
                <div className="text-2xl font-bold">{profile?.credits || 0}</div>
              </div>
              <Badge variant="outline" className="text-sm">
                {profile?.tier?.toUpperCase() || 'FREE'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Create New Site */}
        <div className="mb-8">
          <CreateSiteDialog />
        </div>

        {/* Sites Grid */}
        {!sites || sites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Нет созданных сайтов</h3>
            <p className="text-muted-foreground mb-6">
              Создайте свой первый сайт с помощью AI
            </p>
            <CreateSiteDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site: any) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}

        {/* Stats */}
        {sites && sites.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold">{sites.length}</div>
                <div className="text-sm text-muted-foreground">Всего сайтов</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold">
                  {sites.filter((s: any) => s.status === 'published').length}
                </div>
                <div className="text-sm text-muted-foreground">Опубликовано</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold">
                  {sites.filter((s: any) => s.status === 'draft').length}
                </div>
                <div className="text-sm text-muted-foreground">Черновиков</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
