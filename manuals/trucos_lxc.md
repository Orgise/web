# Trucos LXC

## Introducción
El objetivo de LXC (Linux Containers) es crear un ambiente lo más próximo posible a una instalación estándar de GNU/Linux pero sin precisar un kernel separado haciendo uso de virtualización por contenedores. Tecnologías similares como LXD o Docker nacieron gracias a LXC.

El uso de LXD se ha extendido enormemente por la cantidad de operaciones que permite, a diferencia de LXC cuyas funcionalidades son más básicas.

Los contenedores creados están alojados en `/var/lib/lxc/` y su sistema raiz está en `/var/lib/lxc/container_name/rootfs`.

Podemos ver todas las plantillas que podemos instalar con el comando `ls /usr/share/lxc/templates/`.

El fichero de configuración global de los contenedores se ubica en `/etc/lxc/default.conf`.

## Instalación
Abrimos el terminal y escribimos el siguiente comando:
```shell
sudo apt install lxc
```

## Comandos
Todos los siguientes comando se han de ejecutar como `sudo`.

### lxc-checkconfig
Usado para confirmar si el kernel soporta LXC.

### lxc-create
Crear contenedor.
```shell
# Creamos el contenedor cont1 basado en ubuntu
lxc-create cont1 -t ubuntu
lxc-create -n cont1 -t ubuntu -- -a amd64 -r bionic
```

### lxc-ls
Listar contenedores creados.
```shell
# Listado en formato amigable
sudo lxc-ls -f
```

### lxc-start
Arrancar contenedor.
```shell
# Arrancar un contenedor segundo plano
lxc-start cont1 -d
```

### lxc-freeze
Congela la ejecución de todos los procesos del contenedor.
```shell
lxc-freeze cont1
```

### lxc-unfreeze
Desongela la ejecución de todos los procesos del contenedor.
```shell
lxc-unfreeze cont1
```

### lxc-attach
Ejecutar un comando específico o conectarse al contenedor.
```shell
# Conectarse al contenedor
lxc-shell cont1
# Enviar comando
lxc-shell cont1 ls
# Enviar comando con parámetros
lxc-shell cont1 -- ls -lha
```
Para salir del contenedor escribimos `exit`.

### lxc-execute
Ejecutar un comando específico mientras el contenedor está apagado.

Los comandos de red no funcionarán pues al estar parado el contenedor, no se le asignará ninguna IP.
```shell
sudo lxc-execute cont1 ls
```

### lxc-console
Conectarse a la consola del contenedor.
```shell
lxc-console cont1
```

### lxc-stop
Detener contenedor.
```shell
lxc-stop cont1
```

### lcx-info
Mostrar información del contenedor.
```shell
lxc-info cont1
```

### lxc-destroy
Eliminar contenedor. Debe estar detenido.
```shell
lxc-destroy test-container
```

### lxc-snapshot
Administrar instantáneas del contenedor.
```shell
# Crear instantánea
lxc-snapshot cont1
# Ver instantáneas
lxc-snapshot cont1 -L
# Restaurar instantánea
lxc-snapshot cont1 -r nombre_instantanea
# Eliminar instantánea
lxc-snapshot cont1 -d nombre_instantanea
```

### lxc-copy
Copiar contenedor.
```shell
lxc-copy cont1 -N cont2
```

## Configuración
El fichero de configuración de cada contenedor se ubica en `/var/lib/lxc/your_container/config`.
### Autoarranque
Si queremos que los contenedores se inicien automáticamente al iniciar el host, editamos el fichero de configuración de nuestro contenedor y añadimos la línea:
```
lxc.start.auto = 1
```

### Limitar recursos hardware
```shell
# Máxima RAM permitida
lxc.cgroup2.memory.max = 512M
# Procesadores disponibles. En este caso el primero.
lxc.cgroup2.cpuset.cpus = 0
```

## Errores frecuentes
### Error al crear contenedor basado en Ubuntu
Esta advertencia que puede parecer inofensiva se produce cuando creamos un contenedor de Ubuntu, haciendo que la instalación del mismo falle. La advertencia mostrada es la siguiente:

`W: Cannot check Release signature; keyring file not available /usr/share/keyrings/ubuntu-archive-keyring.gpg`

Solución:
```shell
sudo wget -O /usr/share/keyrings/ubuntu-archive-keyring.gpg http://archive.ubuntu.com/ubuntu/project/ubuntu-archive-keyring.gpg
```

Cuando creemos contenedores basados en Ubuntu, ya no nos aparecerá esa advertencia ni los errores que esta conlleva.