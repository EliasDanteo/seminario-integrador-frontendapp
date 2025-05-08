# Frontend GitLaw

Este proyecto fue desarrollado con **Angular v18**, **TypeScript** y **Angular Material** como parte del trabajo final para la asignatura Seminario Integrador de la **Universidad Tecnológica Nacional – Facultad Regional Rosario**.

Es una aplicación web que consume una API REST creada en Node.js. El sistema permite a visitantes, clientes, abogados y administradores interactuar con el sistema jurídico desde una interfaz moderna y responsiva.

👉 **Link al backend:** [Repositorio Backend GitLaw](https://github.com/AaronDeBernardo/seminario-integrador-backendapp.git)

---

## Accesos y funcionalidades

La interfaz adapta su contenido según el tipo de usuario autenticado:

### Administradores

- Gestión completa (CRUD) de abogados, clientes, secretarios, turnos, actividades, casos y más.
- Acceso a reportes de desempeño e ingresos.
- Registro de cobros y seguimiento de pagos.

### Abogados

- Gestión de sus turnos disponibles.
- Edición y carga de documentos, notas y recordatorios de los casos.
- Registro de actividades relacionadas a sus clientes.

### Clientes

- Seguimiento del estado de sus casos.
- Solicitud de turnos con abogados.

### Visitantes

- Lectura de noticias legales y novedades del estudio.
- Acceso al formulario de solicitud de turnos sin necesidad de registrarse.

---

## Requisitos

- **Node.js**: Versión 20.19.1. [Descargar desde nodejs.org](https://nodejs.org/)
- **npm**: Se instala con Node.js. Para actualizarlo:

```bash
npm install -g npm
```

## Instalación

1. Clona este repositorio en tu computadora:

```
git clone https://github.com/EliasDanteo/seminario-integrador-frontendapp.git
```

2. Accede al directorio del proyecto:

```
cd seminario-integrador-frontendapp
```

3. Instala las dependencias:

```
npm install
```

---

## Ejecución

Para iniciar el proyecto en modo desarrollo, asegurate de tener Angular CLI instalado y ejecutá:

```bash
ng serve
```
---

## Integrantes

Este proyecto fue desarrollado por estudiantes de la **Universidad Tecnológica Nacional – Facultad Regional Rosario**, como parte del Seminario Integrador:

- **Borsato, Milton Rubén** - <borsatomilton@gmail.com>
- **Danteo, Elías Tomás** - <elias.danteo.tomas@hotmail.com>
- **De Bernardo, Aarón** - <aarondebernardo@gmail.com>
- **Gramaglia, Francisca** - <franciscagramaglia714@gmail.com>
- **Spini, Santiago** - <santiagospini@gmail.com>




