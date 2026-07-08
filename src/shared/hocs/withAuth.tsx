import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_COOKIE_NAME } from '@/shared/constants/cookies';
import PAGE_ROUTES from '@/shared/constants/page-routes';

const withAuth = <TProps extends object>(Component: React.ComponentType<TProps>) => {
  const ComponentWithAuth: React.FC<TProps> = async (props: TProps) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!accessToken) redirect(PAGE_ROUTES.SIGN_IN);
    return <Component {...props} />;
  };
  return ComponentWithAuth;
};

export default withAuth;
