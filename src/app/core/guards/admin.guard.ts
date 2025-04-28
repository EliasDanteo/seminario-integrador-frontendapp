import { CanActivateFn, Router } from '@angular/router';
import { TipoUsuarioEnum } from '../utils/enums.js';

export const adminGuard: CanActivateFn = (route, state) => {
  const JSONuser = sessionStorage.getItem('user');

  if (JSONuser !== null) {
    const user = JSON.parse(JSONuser);
    if (user.is_admin || user.tipo_usuario === TipoUsuarioEnum.SECRETARIO)
      //todo secretario es admin
      return true;
  }

  const router = new Router();
  router.navigate(['/']);
  return false;
};
