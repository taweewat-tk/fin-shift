'use client';

import { Button } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import PAGE_ROUTES from '@/shared/constants/page-routes';
import { useLogout } from '@/shared/hooks/api/mutations/auth/useLogout';

const NAV_LINKS = [
  { href: PAGE_ROUTES.DASHBOARD, label: 'Dashboard' },
  { href: PAGE_ROUTES.CARDS, label: 'Cards' },
];

export default function AppNav() {
  const pathname = usePathname();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        window.location.href = PAGE_ROUTES.SIGN_IN;
      },
    });
  };

  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
      <div className="flex items-center gap-4">
        <span className="font-semibold">fin-shift</span>
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? 'font-medium text-blue-600' : 'text-zinc-500'}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Button size="small" onClick={handleLogout} loading={isPending}>
        Log out
      </Button>
    </nav>
  );
}
