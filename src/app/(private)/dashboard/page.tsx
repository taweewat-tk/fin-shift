import Link from 'next/link';

import PAGE_ROUTES from '@/shared/constants/page-routes';
import withAuth from '@/shared/hocs/withAuth';

function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-zinc-500">Charts land later in Phase 1.</p>
      <Link href={PAGE_ROUTES.CARDS} className="mt-4 inline-block text-blue-600">
        Manage cards →
      </Link>
    </main>
  );
}

export default withAuth(DashboardPage);
