import { CanActivateFn, Router } from '@angular/router';
import { TipoUsuarioEnum } from '../utils/enums.js';

export const abogadoGuard: CanActivateFn = (route, state) => {
  const JSONuser = sessionStorage.getItem('user');

  if (JSONuser !== null) {
    const user = JSON.parse(JSONuser);
    if (user.tipo_usuario === TipoUsuarioEnum.ABOGADO) return true;
  }

  const router = new Router();
  router.navigate(['/']);
  return false;
};
