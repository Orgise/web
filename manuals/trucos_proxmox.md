# Trucos Proxmox

## Enlaces
[Sitio web de Proxmox](https://www.proxmox.com/en/)

[Proxmox VE Administration Guide](https://pve.proxmox.com/pve-docs/pve-admin-guide.html)

## Problemas frecuentes

### Eliminar alerta al iniciar sesión desde el navegador web
El aviso detallado es el siguiente:

> No hay una suscripción válida

> You do not have a valid subscription for this server. Please visit www.proxmox.com to get a list of available options.

Editamos el fichero `/usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js`

Buscamos donde ponga `No valid subscription`.

Reemplazamos lo primero por lo segundo:
> if (res === null || res === undefined || !res || res.data.status.toLowerCase() !== 'active')

> if (false)

Reiniciamos el servicio `systemctl restart pveproxy.service`.

La próxima vez que nos logeemos habiendo borrado la caché, no nos saldrá la alerta.
        
### Configurar repositorios para poder actualizar el sistema sin tener la suscripción activa
```shell
# Nos vemos al directorio de configuración de los repositorios
cd /etc/apt/sources.list.d/
# Copiamos el repositorio original de pago a uno nuevo gratuito sin suscripción 
cp pve-enterprise.list pve-no-subscription.list
```

Comentamos las líneas del repositorio de pago en `pve-enterprise.list`.
```
# deb https://enterprise.proxmox.com/debian/pve bullseye pve-enterprise
```

Editamos el fichero `pve-no-subscription.list` y pegamos lo siguiente.
```
deb http://download.proxmox.com/debian/pve buster pve-no-subscription
```

Ya podremos actualizar nuestro sistema.
```shell
apt update
apt dist-upgrade
```

### Contenedor no muestra salida por consola
* Opciones del contenedor
    * Modo de consola
        * Shell

