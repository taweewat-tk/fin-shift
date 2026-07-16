import AppNav from '@/shared/components/AppNav';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
