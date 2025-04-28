import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const JSONuser = sessionStorage.getItem('user');

  if (JSONuser !== null) {
    const user = JSON.parse(JSONuser);
    if (user.is_admin) return true;
  }

  const router = new Router();
  router.navigate(['/']);
  return false;
};
