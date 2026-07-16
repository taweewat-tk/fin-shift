import { useMutation } from '@tanstack/react-query';

import { postLogout } from '@/shared/services/api/auth/auth';

export const useLogout = () =>
  useMutation<void, Error, void>({
    mutationFn: postLogout,
  });
