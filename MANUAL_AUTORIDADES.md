# Manual de Uso para Autoridades - Sistema de Gestión de Emergencias

Bienvenido al panel de control del **Sistema de Gestión de Emergencias de Venezuela**. Esta plataforma permite a los organismos de seguridad, protección civil, bomberos y centros de asistencia coordinar y atender en tiempo real las incidencias reportadas por la ciudadanía.

A continuación, encontrarás una guía rápida sobre cómo navegar y operar dentro del sistema.

---

## 1. Acceso y Validación en el Sistema

Para resguardar la seguridad del país y la privacidad de las víctimas, el acceso a la plataforma está estrictamente restringido. 

### ¿Cómo ingresar?
1. Ingresa a la página oficial de control: **[https://emergencia.joch.dev](https://emergencia.joch.dev)**.
2. Introduce tu Correo Electrónico institucional o registrado.
3. El sistema te enviará un **Código de Acceso Operativo (Token de un solo uso)** a tu bandeja de entrada.
4. Introduce el código de 6 dígitos en la pantalla para iniciar sesión de forma segura.

> [!WARNING]
> Tu cuenta debe ser dada de alta previamente por el **Administrador General (`jochdev`)**. Los operadores no pueden autorregistrarse públicamente para evitar infiltraciones en la base de datos confidencial. Si tu organismo aún no está registrado, solicita el alta enviando una credencial oficial a **hola@joch.dev**.

---

## 2. Roles, Permisos y Cobertura Geográfica

El sistema implementa un modelo de **Control de Acceso Basado en Roles (RBAC)** y delimitación territorial para evitar la saturación de información:

*   **Administrador (`jochdev` / Admin):** Tiene control total. Es el único rol autorizado para crear organismos, registrar operadores, ver la **Bitácora de Auditoría** global y reasignar coberturas.
*   **Operador:** Usuario encargado del monitoreo en tiempo real. Su visibilidad está estrictamente limitada por la **cobertura geográfica** configurada en su perfil por el Administrador:
    *   **Nivel Estado:** Visualiza y gestiona incidentes de todo ese Estado.
    *   **Nivel Municipio:** Su bandeja se limita únicamente a los reportes de ese municipio.
    *   **Nivel Parroquia:** Solo interactúa con datos y reportes de esa parroquia específica.

---

## 3. Módulos Principales (Diseño en una Sola Página)

La interfaz opera en una sola pantalla de alto rendimiento. Puedes alternar de inmediato entre módulos usando las pestañas superiores:

### 🔴 Bandeja de Incidentes (Triage en Tiempo Real)
Visualiza los reportes urgentes emitidos por los ciudadanos. El sistema prioriza automáticamente las filas por severidad visual:
*   **Prioridad 1 (Rojo):** Personas atrapadas o heridas en estructuras colapsadas. Requiere despacho inmediato.
*   **Prioridad 2 (Naranja):** Personas desaparecidas.
*   **Derivar Caso:** Si el incidente requiere apoyo de otra jurisdicción u organismo nacional, puedes actualizar el territorio asignado para transferir el caso instantáneamente a la bandeja del operador competente en tiempo real.

### 🔍 Búsqueda de Familiares
Permite gestionar y verificar el estatus de los ciudadanos. Cuando un operador localiza a una persona en el terreno, actualiza su estado a **"A salvo"** y le asigna el **Refugio** correspondiente. Esto permite que el buscador público web responda de inmediato a los familiares con el paradero exacto, resguardando datos sensibles.

### 🏠 Refugios de Emergencia
Directorio dinámico de los espacios provisionales habilitados (escuelas, iglesias, plazas).
*   **Control de Ocupación:** Los operadores deben mantener actualizada la **población actual** frente a la capacidad máxima del sitio para evitar el hacinamiento y coordinar desvíos de traslados.
*   **Insumos Urgentes:** Espacio para listar carencias críticas (agua, colchonetas, medicinas) que se sincroniza automáticamente con el módulo de acopio.

### 📦 Centros de Acopio y 🚑 Voluntariado Médico
*   **Acopio:** Gestión de puntos de donación de la sociedad civil. Solo los centros aprobados y marcados como **"Verificados"** se muestran en la web pública para evitar desvíos o desinformación.
*   **Médicos:** Base de datos confidencial de profesionales de la salud disponibles (médicos, paramédicos, psicólogos) ordenados por su ubicación actual para asignación rápida en refugios o zonas de triaje.

---

## 4. Seguridad, Privacidad y Bitácora de Auditoría

Cada acción dentro de la plataforma queda registrada de forma inmutable.
*   **Bitácora (`logs_auditoria`):** El sistema guarda automáticamente un registro con el nombre del operador, hora exacta, dirección IP y el cambio realizado (ej. *"Modificó estatus de víctima de Desaparecido a A Salvo"* o *"Consultó dirección exacta"*), garantizando la transparencia absoluta del manejo de la crisis.
*   **Campos Protegidos:** Por motivos de seguridad institucional, los operadores pueden visualizar sus datos de identificación (DNI/Cédula y Organismo) pero **no pueden editarlos**. Solo están autorizados a gestionar sus credenciales de acceso.

---

## 5. Manifiesto y Apoyo al Proyecto

Esta es una **iniciativa ciudadana independiente de código abierto** para facilitar la localización de personas y coordinar apoyo. Los datos recopilados se pondrán a disposición de los cuerpos de rescate oficiales (Protección Civil, Bomberos, Cruz Roja) para agilizar las labores de búsqueda y salvamento.

**Sostenibilidad y Donaciones:**
Los servicios de hospedaje del sitio web, bases de datos y APIs son servicios externos desplegados en infraestructura de servidores privados (VPS). Si deseas colaborar con el financiamiento para mantener la infraestructura operativa durante la contingencia, puedes hacerlo a través de PayPal a **hola@joch.dev** con la nota: *Aporte a emergencia.joch.dev*.

*Se recibirán donaciones voluntarias únicamente hasta que una autoridad venezolana se haga cargo de los gastos operativos. En ese momento, **Jochdev** transferirá por completo el sistema y las bases de datos a las instituciones pertinentes, procediendo a la posterior destrucción de los respaldos temporales privados para proteger la privacidad de la ciudadanía*.