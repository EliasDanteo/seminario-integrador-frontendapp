import { CanActivateFn, Router } from '@angular/router';
import { TipoUsuarioEnum } from '../utils/enums.js';

export const clienteGuard: CanActivateFn = (route, state) => {
  const JSONuser = sessionStorage.getItem('user');

  if (JSONuser !== null) {
    const user = JSON.parse(JSONuser);
    if (user.tipo_usuario === TipoUsuarioEnum.CLIENTE && !user.is_admin)
      return true;
  }

  const router = new Router();
  router.navigate(['/']);
  return false;
};
