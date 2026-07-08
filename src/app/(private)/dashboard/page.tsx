import withAuth from '@/shared/hocs/withAuth';

function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-zinc-500">Cycle-aware ledger and charts land in Phase 1.</p>
    </main>
  );
}

export default withAuth(DashboardPage);
