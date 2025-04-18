const apiUrl = 'http://localhost:3000/api';

export const environment = {
  apiUrl: apiUrl,
  abogadosUrl: apiUrl + '/usuarios/abogados',
  clientesUrl: apiUrl + '/usuarios/clientes',
  secretariosUrl: apiUrl + '/usuarios/secretarios',
  casosUrl: apiUrl + '/casos',
  especialidadesUrl: apiUrl + '/especialidades',
  actividadesUrl: apiUrl + '/actividades',
  noticiasUrl: apiUrl + '/misc/noticias',
  jusUrl: apiUrl + '/misc/precios-jus',
  feedbackUrl: apiUrl + '/feedbacks',
  documentosUrl: apiUrl + '/casos/documentos',
};
