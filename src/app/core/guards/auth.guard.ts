import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const user = sessionStorage.getItem('user');

  if (user) {
    return true;
  } else {
    const router = new Router();
    router.navigate(['/']);
    return false;
  }
};
