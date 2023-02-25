# Trucos Docker

## Introducción
Docker es una plataforma creada con el fin de desarrollar, implementar y ejecutar aplicaciones dentro de contenedores. Lo cual permite a los desarrolladores realizar el empaquetado de nuestras aplicaciones junto a sus correspondientes dependencias dentro de una unidades estandarizadas conocidas bajo el término de contenedores de software.

Como alternativa a Docker podemos usar Podman, el cual es un motor de contenedores desarrollado por RedHat. Si bien es similar a Docker en muchos aspectos, se diferencia de esta última en que su arquitectura no utiliza un demonio. Tampoco necesita permisos de administrador. Esto significa que podman puede ejecutar contenedores directamente en el sistema sin necesidad de un demonio de fondo, lo que lo hace más seguro y fácil de usar. Podman también ofrece una interfaz de línea de comandos (CLI) similar a la de Docker, por lo que la mayoría de los usuarios pueden simplemente asignar un alias de Docker a Podman para realizar la misma tarea.

## Instalación

### Instalación simple
Abrimos el terminal y escribimos los siguientes comandos:

```shell
sudo apt install docker.io docker-compose
sudo usermod -aG docker your_user
newgrp docker
# Para los que quieran usar podman
sudo apt install podman podman-compose podman-docker
# Comprobar instalación satisfactoria
docker -v
```

### Instalación completa
[Tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-es)


## Conceptos

### Imagen
Una imagen es una captura del estado de un contenedor.
Cada vez que se arranque una imagen se generará un contenedor asociado a ella.

Las imágenes se guardan en el directorio /var/lib/docker/overlay2 de tu máquina física.

Para poder borrar una imagen hace falta primero borrar todos los contenedores relacionados con ella.

### Contenedor
Los contenedores dependen de las imágenes. Son instancias en ejecución de las imágenes.

Para poder borrar un contenedor debe de estar detenido.

Los commit efectuados sobre un contenedor solo ocupan los cambios que se hayan realizado en base a la imagen de la que ha partido o bifurcado.

### Volumen
Directorio compartido entre anfitrión e invitado.

### Dockerfile
Un Dockerfile es un archivo de texto plano que contiene una serie de instrucciones necesarias para crear una imagen que, posteriormente, se convertirá en una sola aplicación utilizada para un determinado propósito.

Todas las imágenes que se crean usando un Dockerfile usan la instrucción build.

Use el punto si se encuentra en el directorio donde se ubique su Dockerfile.

El archivo Dockerfile debe de llamarse así.

El Dockerfile usa la caché de intrucciones anteriormente ejecutadas por eficiencia.
Para que la caché no se cancele si instalamos muchos paquetes, usamos solo una instrucción con ampersand (&). Docker en este caso solo ejecutaría una capa.

| Instrucción | Descripción
|-|-|
| MAINTAINER | Define el nombre y la dirección de correo electrónico del mantenedor de la imagen
| FROM | Especifica la imagen base que se utilizará para construir la imagen actual
| RUN | Ejecuta un comando dentro del contenedor mientras se está construyendo la imagen
| CMD | Especifica el comando que se ejecutará cuando se inicie el contenedor
| ENTRYPOINT | Especifica el comando o script que se ejecutará cuando se inicie el contenedor, aunque se pueden agregar argumentos a la línea de comandos
| COPY | Copia archivos desde el sistema de archivos del host al contenedor
| ADD | Copia archivos desde el sistema de archivos del host al contenedor, pero también admite la extracción de archivos comprimidos
| EXPOSE | Especifica los puertos que deben estar expuestos en el contenedor
| VOLUME | Crea un volumen de Docker para el contenedor
| WORKDIR | Establece el directorio de trabajo dentro del contenedor
| ENV | Define una variable de entorno dentro del contenedor
| USER | Establece el usuario y el grupo de usuario que se utilizarán dentro del contenedor

La instrucción EXPOSE no expone los puertos hacia el anfitrión, sino a los contenedores que están en la misma red.

### Docker Compose
Es un orquestador de contenedores, es decir, configura varios contenedores vinculados entre sí. Usa el formato `.yml`.
Un ejemplo de Docker Compose es la pila LAMP.
[Saber más](https://keepcoding.io/blog/que-es-docker-compose/)

| Instrucción | Descripción
|-|-|
| version | Definir la versión de Docker Compose a usar en el fichero
| services | Define los contenedores que se deben crear
| image | Especifica la imagen que se utilizará para construir el servicio
| context | Ruta donde se encuentra el Dockerfile
| build | Especifica la ubicación del Dockerfile que se utilizará para construir la imagen
| command | Especifica el comando que se ejecutará cuando se inicie el servicio
| environment | Define una variable de entorno que se utilizará en el servicio
| ports | Especifica los puertos que deben estar expuestos en el servicio
| volumes | Crea un volumen de Docker para el servicio
| networks | Especifica las redes que deben estar disponibles para el servicio
| depends_on | Especifica los servicios que deben estar en ejecución antes de iniciar este servicio
| restart | Define la política de reinicio para los contenedores
| env_file | Permite cargar variables de entorno desde un archivo en lugar de definirlas en el archivo YAML
| labels | Define las etiquetas que se deben aplicar a los contenedores
| container_name | Especifica el nombre que se utilizará para el contenedor
| healthcheck | Define un comando que se ejecutará periódicamente para verificar la salud del contenedor
| extends | Permite extender un servicio existente en un archivo YAML diferente. Esto evita la necesidad de repetir la definición del servicio en cada archivo YAML
| secrets | Permite el uso de secretos en el archivo de Docker Compose, lo que permite a los contenedores acceder a datos confidenciales sin exponerlos en el archivo de configuración
| configs | Similar a la directiva secrets, pero se utiliza para archivos de configuración en lugar de datos confidenciales
| deploy | Define opciones de implementación para servicios, como la cantidad de réplicas que se deben crear o cómo se debe equilibrar la carga
| scale | Define el número de instancias de un servicio que se deben crear. Esta opción es una forma más rápida de crear varias instancias del mismo servicio
| tmpfs | Permite la creación de sistemas de archivos temporales en memoria para los contenedores
| stop_grace_period | Define el tiempo que se debe esperar antes de detener un contenedor. Esto puede ser útil para permitir que los procesos en el contenedor finalicen correctamente antes de detener el contenedor
| logging | Define cómo se deben registrar los registros del contenedor, como dónde se deben almacenar y cómo se deben formatear
| external_links | Permite conectar los contenedores de una pila a los contenedores que se ejecutan fuera de la pila
| extra_hosts | Permite agregar entradas de host adicionales al archivo `/etc/hosts` del contenedor. Esto es útil cuando se necesita conectar con un host que no se puede resolver mediante DNS
| stop_signal | Define la señal que se enviará al contenedor para detenerlo. Por defecto, Docker envía una señal SIGTERM, pero esto puede ser cambiado con esta directiva
| tty | Permite asignar una TTY (Terminal Type) al contenedor. Esto puede ser útil para ejecutar aplicaciones interactivas que requieren una terminal
|

Ejemplo instrucción `healthcheck`:
Healtcheck va a ejecutar un curl a localhost, cada minuto y medio, una vez hayan pasado 40 segundos, si el comando tarda más de 10 segundos en devolver un resultado lo considerará como un fallo y si un fallo ocurre más de 3 veces el servicio se considerará "no saludable".

```yml
version: '3.8'
services:
  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    env_file: common.env
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Intrucción `volumes`:

- El volumen puede ser una ubicación en tu sistema o también el nombre de un volumen que hayas creado con Docker.
- Opcionalmente podemos especificar si el uso de volúmenes será de solo lectura o de lectura y escritura, con “ro” y “rw”, respectivamente.
- La propiedad `volumes` fuera de `services` indica los volúmenes que pueden ser usados por cualquier servicio que lo necesite, permitiendo usar el mismo volumen en varios contenedores.
- La propiedad `volumes` dentro de un servicio, indica el volúmen que vamos a utilizar seguido de la ruta del contenedor donde va a ser montado el volumen.

Podemos aplicar las siguientes políticas de reinicio a nuestros servicios con la instrucción `restart`:

- no: nunca reinicia el contenedor
- always: siempre lo reinicia
- on-failure: lo reinicia si el contenedor devuelve un estado de error
- unless-stopped: lo reinicia en todos los casos excepto cuando se detiene




### Docker Swarm
Docker Swarm es una herramienta software que permite ejecutar los contenedores en una granja de nodos, esto implica uno o varios balanceadores de carga implementados en uno o varios nodos maestros y los nodos que prestan el servicio, implementados en nodos trabajadores. Los contenedores que se ejecutan en modo Swarm se les denomina en ocasiones como modo enjambre.
[Saber más](https://www.makingscience.es/blog/que-es-docker-swarm/)

### Docker Machine
Docker Machine es una herramienta que nos ayuda a crear, configurar y manejar máquinas (virtuales o físicas) con Docker Engine. Con Docker Machine podemos iniciar, parar o reiniciar los nodos docker, actualizar el cliente o el demonio docker y configurar el cliente docker para acceder a los distintos Docker Engine. El propósito principal del uso de esta herramienta es la de crear máquinas con Docker Engine en sistemas remotos y centralizar su gestión.
[Saber más](https://www.josedomingo.org/pledin/2016/05/creando-servidores-docker-con-docker-machine/)

## Comandos

### docker info
Muestra información de Docker y del sistema anfitrión.

### docker version
Muestra la versión de Docker.

```shell
# Otra forma de ver la versión
docker -v
```

### docker login
Loguearse en Docker Hub, será necesario estar autenticado para subir una imagen.

```shell
docker login
docker login -u <usuario> -p <password>
```

Si ya estamos logeados y volvemos a poner el comando, nos aparece:
> Authenticating with existing credentials...
> Login Succeeded

Autenticarse usando token en vez de nuestra contraseña:
[Guía oficial](https://docs.docker.com/docker-hub/access-tokens/)

1. Logearse en [Docker Hub](https://hub.docker.com).
2. Haga clic en su nombre de usuario arriba a la derecha y pulse Ajustes de cuenta.
3. Seleccione Seguridad > Nuevo token de acceso.
4. Añada una descripción para su token, algo identificativo.
5. Seleccione los permisos del token.
6. Almacene el token en un lugar seguro ya que solo se mostrará una vez.
7. Introducimos el comando `docker login -u <username>`. Cuando le pida la contraseña use el token generado.

### docker logout
Cerrar sesión en repositorios de contenedores.

```shell
# Cerrar sesión de docker.io
docker logout docker.io
# Eliminar la caché de las credenciales del fichero de autenticación para todos los repositorios
docker logout --all
```
### docker push
Subir una imagen a un repositorio (Docker Hub).

```shell
docker push <imagen_local>
```

### docker commit
Guardar los cambios realizados de un contenedor en una nueva imagen.

```shell
docker commit <ID o nombre_contenedor> <nombre_imagen_nueva>
```

Para subir una imagen creada a un repositorio como puede ser Docker Hub, es necesario etiquetarla antes.

```shell
docker tag <imagen_local> <nombre_tag_imagen>
docker push <nombre_tag_imagen_creada>
```

### docker build
Construir una imagen a partir de un Dockerfile (--file será necesario si el nombre del fichero no es "Dockerfile" y no está situado el mismo directorio).

```shell
docker build -t my-image:1.0 .
docker build --tag <nombre_imagen> --file <fichero_dockerfile>
```

**Importante:** no se nos debe olvidar el punto final.

### docker image
Administrar imágenes.

```shell
# Eliminar imágenes no usadas
docker image prune
# Descargar imagen
docker image pull <imagen>
# Comprobar existencia de imagen. No devuelve nada, solo 1 si no existe y 0 de lo contrario.
docker image exists <imagen>
```

### docker images
Muestra las imágenes instaladas localmente.

```shell
docker images
```

### docker pull
Descargar imagen desde un repositorio público.

```shell
docker pull httpd
docker pull ubuntu:18.04
```

### docker run
Lanzar un contenedor desde la imagen.

```shell
docker run <image>
# Asignar un volumen
docker run -v /tmp/testdir:/root/testdir httpd
# Crear e iniciar un contenedor basado en una imagen Ubuntu 18.04, que ejecuta una Shell en modo interactivo (-it) como entrypoint.
docker run –-name <nombre_contenedor> -h ubuntuDocker -it ubuntu:18.04 /bin/bash
# Publicar el puerto 80 del contenedor al 8080 del host.
docker run -it --name test -p 8080:80 debian test
# Publicar todos los puertos expuestos a puertos aleatorios del host.
docker run -it --name test -P debian bash
# Eliminar automáticamente el contenedor cuando se detenga
docker run --rm alpine
# Limitar recursos del contenedor a 100M de RAM y swap, y 2 núcleos
docker run -m 100m --cpus=2 debian
```

### docker exec
Ejecutar comandos dentro del contenedor.

```shell
docker exec -it nombre_contenedor /bin/bash
```

### docker stop
Dettener un contenedor.

```shell
# Para hacer referencia al contenedor que queramos eliminar, introducimos su identificador o su nombre.
docker stop httpd
docker stop e7e8165c699a
# Parar todos los contenedores
docker stop $(docker ps -aq)
```

### docker kill
Finalizar (matar) contenedor.

```shell
docker kill <id o nombre_imagen>
```

### docker tag
Añadir un nombre adicional a una imagen.

Antes de poder subir una imagen al repositorio debemos asegurarnos de que contenga nuestro nombre de usuario, para que el repositorio sepa a qué cuenta de usuario subir la imagen. Ejemplo:

```shell
# docker tag <local_image>:<tag> <your_registry_username>/<local_image>:<tag>
docker tag httpd:2.4 <username>/appweb:latest
```

### docker top
Mostrar procesos en ejecución contenedor.

```shell
docker top <id o nombre_imagen>
```

### docker rmi
Eliminar imagen.

```shell
# Para hacer referencia a la imagen que queramos eliminar, introducimos su identificador o su nombre.
docker rmi bf756fb1ae65
```

### docker rm
Eliminar contenedor.

```shell
docker rm <container>
# Eliminar todos los contenedores
docker rm $(docker ps -aq)
# Forzar eliminación
docker rm -f <container>
```

### docker ps
Listar contenedores.

```shell
docker ps
# Listar contenedores que no se encuentran en ejecución en este momento
docker ps -a
# Listar contenedores ejecutándose cuyo nombre empiece por "php"
docker ps --filter "name=php*"
```

### docker volume
Administrar volúmenes.

```shell
# Listar volúmenes
docker volume ls
# Crear volumen
docker volume create
# Eliminar volumen
docker volume rm
# Mostrar información detallada de los volúmenes
docker volume inspect
# Eliminar todos los volúmenes que no están siendo utilizados
docker volume prune
```

### docker network
Administrar redes.

```shell
# Crear red
docker network create
# Conectar a un contenedor a una red
docker network connect
# Desconectar a un contenedor de una red
docker network disconnect
# Mostrar información detallada de una red
docker network inspect <network>
# Listar redes
docker network ls
# Eliminar red
docker network rm
# Eliminar redes no utilizadas
docker network prune
```

### docker cp
Copiar información del contenedor a local o viceversa.

```shell
# Del contenedor a local
docker cp <id_contenedor>:<path_contenedor> <path_host_local>
# De local al contenedor
docker cp <path_host_local> <id_contenedor>:<path_contenedor>
```

### docker-compose
Trabajar con Docker Compose.

```shell
# Crear y arrancar la pila completa en segundo plano
docker-compose up -d
# Parar y eliminar todos los contenedores y redes que Docker Compose ha creado
docker-compose down
# Si tu fichero de Docker Compose no tiene el nombre por defecto, le indicamos el nuevo nombre con -f.
docker-compose -f compose_name.yml up -d
# Construir imágenes de los servicios específicados
docker-compose build
# Listar servicios
docker-compose ps
# Mostrar procesos en ejecución
docker-compose top
# Reiniciar contenedores
docker-compose restart
# Arrancar servicio
docker-compose start <service>
# Arrancar servicios
docker-compose start
# Parar servicio
docker-compose stop <service>
# Parar servicios
docker-compose stop
# Ejecutar comando
docker-compose exec <service> <command>
# Mostrar registros
docker-compose logs
```

### docker exec
Ejecutar comandos sobre un contenedor en ejecucción.

```shell
# Entrar en un contenedor como root
docker exec -u 0 -ti your_container bash
```

### docker search
Buscar imagen en repositorio.

```shell
docker search <img>
```

### docker save
Guardar imagen en un fichero `.tar`.
Pasos para realizar
```shell
docker save --output <cont> name.tar
docker export --output <cont> name.tar
docker import name.tar <cont>
```

### docker load
Cargar una imagen desde un archivo tar o STDIN (Standard Input).

```shell
docker load --input <test.tar>
```

### docker diff
Inspeccionar cambios de archivos o directorios de contenedores.

```shell
docker diff <id o nombre_imagen>
```

### docker df
Mostrar el uso del disco por Docker.

### docker create
Crear contenedores. El contenedor se crea pero no se ejecuta.

```shell
docker create -it --storage-opt size=120G fedora /bin/bash
```

### docker restart
Reiniciar contenedor.

```shell
docker restart <cont>;
```

### docker stats
Mostrar estadísticas de uso de los recursos de contenedores (CPU, Memoria, I/O, PIDs).

```shell
# Estadísticas generales
docker stats
# Estadísticas del contenedor
docker stats <id o nombre_imagen>
```

### docker update
Actualizar recursos asignados a un contenedor.

```shell
docker update <id o nombre_imagen>
```

### docker unpause
Reanudar contenedores parados.

```shell
docker unpause <container>
```

### docker system
Administrar Docker.

```shell
# Eliminar todos contenedores, redes, imágenes o volúmenes "colgantes" sin referencia o no utilizados
docker system prune
# Información del sistema
docker system info
```

### docker events
Obtener eventos en tiempo real desde el servidor. Estos eventos incluyen detalles sobre contenedores, imágenes, redes y volúmenes, como creación, eliminación, inicio, detención y otros cambios de estado. Esta información puede ser útil para comprender mejor el comportamiento de los contenedores y para la monitorización de los recursos.

```shell
docker events
```

## Ejemplos prácticos

### Contenedor de MariaDB
Crear un contenedor de MariaDB para tener un SGBD donde probar consultas SQL.

```shell
docker run --name some-mariadb -e MYSQL_ROOT_PASSWORD=root -d mariadb:latest
docker exec -it some-mariadb mariadb -u root -p
```

### Contenedor de Apache
Crear un contenedor de Apache para desarrollo web montando nuestra ruta actual en el directorio por defecto del servidor web.

```shell
docker run -dit --name my-apache-app -p 8080:80 -v .:/usr/local/apache2/htdocs/ httpd:alpine
```

### Entorno LAMP usando Docker Compose y Dockerfile
Al hacer uso de un Dockerfile para instalar dependencias para nuestro proyecto, evitamos tener que poner la directiva `command`, la cual ejecutará lo que hayamos indicado cada vez que se inicie Docker Compose, malgastando recursos y aumentando el tiempo de arranque del contenedor.

```shell
FROM php:apache
# Soporte para PDO
RUN docker-php-ext-install pdo_mysql
```

Usando el Dockerfile, creamos una imagen personalizada con todo lo que necesitamos una única vez. Podemos construir la imagen con el siguiente comando:

```shell
docker build -t php:apache-pdo .
```

O bien, la construimos automáticamente al lanzar el Compose, con el nombre que le hayamos indicado al servicio. Será la opción que elegiremos para construir el siguiente Docker Compose:

```yml
version: "3.9"
services:
  db:
    image: mariadb:latest
    container_name: mariadb_server
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
  web:
    build: .
    container_name: php_web_server
    ports:
      - "8080:80"
    volumes:
      - ./public:/var/www/html
    depends_on:
      - db
volumes:
  db_data:
```

## Solución de problemas

### Al crear un volumen e intentar acceder a los ficheros compartidos compruebo que no tengo permisos
Esto se debe a SELinux que está previniendo que un contenedor sea capaz de acceder al sistema de ficheros del anfitrión. Para autorizar el acceso, crearemos un nuevo contexto de seguridad para el directorio que vayamos a emplear como volumen.

```shell
# Activar contexto de seguridad
chcon -R -t container_file_t /ruta
# Desactivar contexto de seguridad
chcon -R -t user_home_t /ruta
# Comprobar el contexto de seguridad
ls -Z
```

### No puedo conectarme a MariaDB fuera del contenedor
Solución: añadir el parámetro --protocol=TCP al comando. Recuerda añadir el parámetro `-P` si el puerto es diferente al 3306.

```shell
mariadb -u root -p --protocol=TCP
```

### Añadir Docker Hub como repositorio de contenedores
Este error se produce cuando intentamos descargar o buscar una imagen y se produce el error `Error: error creating build container: short-name "<image>:<tag>" did not resolve to an alias and no unqualified-search registries are defined in "/etc/containers/registries.conf"` porque no se ha especificado una fuente donde encontrar los contenedores. Solución:

```shell
echo 'unqualified-search-registries=["docker.io"]' >> /etc/containers/registries.conf
```

### Error al iniciar sesión en un repositorio de contenedores
[Solución oficial](https://docs.docker.com/desktop/get-started/#credentials-management-for-linux-users)

Este error se produce en Ubuntu cuando escribimos el comando `docker login` y tras poner nuestras credenciales nos aparece el error:

Error saving credentials: error storing credentials - err: exit status 1, out: Error calling StartServiceByName for org.freedesktop.secrets: Timeout was reached.

```shell
# Dependencias
sudo apt install pass gnupg2
# Generar clave GPG. Ponemos los datos que queramos,
# para ayudar a identificar la clave. No tienen por qué ser reales
gpg --generate-key
# Inicializamos la clave. TAB para completar
pass init <generated gpg-id public key>
# Logearnos en el servidor
docker login
```
