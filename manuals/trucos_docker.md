# Trucos Docker

## Introducción
Docker es una plataforma creada con el fin de desarrollar, implementar y ejecutar aplicaciones dentro de contenedores. Lo cual permite a los desarrolladores realizar el empaquetado de nuestras aplicaciones junto a sus correspondientes dependencias dentro de una unidades estandarizadas conocidas bajo el término de contenedores de software.

## Instalación
### Instalación simple
Abrimos el terminal y escribimos los siguientes comandos:
```shell
sudo apt install docker.io docker-compose
sudo usermod -aG docker your_user
newgrp docker
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

CMD interpreta shell.
[Saber más](https://www.ionos.es/digitalguide/servidores/know-how/dockerfile/)

### Docker Compose
Es un orquestador de contenedores, es decir, configura varios contenedores vinculados entre sí. Usa el formato `.yml`.
Un ejemplo de Docker Compose es la pila LAMP.
[Saber más](https://keepcoding.io/blog/que-es-docker-compose/)

### Docker Swarm
Docker Swarm es una herramienta software que permite ejecutar los contenedores en una granja de nodos, esto implica uno o varios balanceadores de carga implementados en uno o varios nodos maestros y los nodos que prestan el servicio, implementados en nodos trabajadores. Los contenedores que se ejecutan en modo Swarm se les denomina en ocasiones como modo enjambre.
[Saber más][https://www.makingscience.es/blog/que-es-docker-swarm/]

### Docker Machine
Docker Machine es una herramienta que nos ayuda a crear, configurar y manejar máquinas (virtuales o físicas) con Docker Engine. Con Docker Machine podemos iniciar, parar o reiniciar los nodos docker, actualizar el cliente o el demonio docker y configurar el cliente docker para acceder a los distintos Docker Engine. El propósito principal del uso de esta herramienta es la de crear máquinas con Docker Engine en sistemas remotos y centralizar su gestión.
[Saber más][https://www.josedomingo.org/pledin/2016/05/creando-servidores-docker-con-docker-machine/]

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
Loguearse en Docker Hub, será necesario estar autenticado para subir (push) una imagen.
```shell
docker login
docker login -u <usuario> -p <password>
```

### docker push
Subir una imagen a un repositorio (Docker Hub).
```shell
docker push <imagen_local>
```

### docker commit
Crear una imagen de un contenedor personalizado en ejecución.
```shell
docker commit <ID o nombre_contenedor> <nombre_imagen_nueva>
```

### docker commit
Para subir una imagen creada a un repositorio como puede ser Docker Hub, es necesario "tagearla" antes.
```shell
docker tag <imagen_local> <nombre_tag_imagen>
docker push <nombre_tag_imagen_creada>
```
### docker build
Construir una imagen a partir de un Dockerfile (--file será necesario si el nombre del fichero no es "Dockerfile" y no está situado el mismo directorio).

```shell
docker build --tag <nombre_imagen> --file <fichero_dockerfile>
```

### docker images
Muestra las imágenes instaladas localmente.
```shell
# Otra forma de ver la versión
docker -v
```

### docker pull
Descargar imagen desde un repositorio público.
```shell
docker pull httpd
docker pull ubuntu:18.04
```

### docker run
Abrir un contenedor desde la imagen.
```shell
docker run httpd
# Asignar un volumen
docker run -v /tmp/testdir:/root/testdir httpd
# Crear e iniciar un contenedor basado en una imagen Ubuntu 18.04, que ejecuta una Shell en modo interactivo (-it) como entrypoint.
docker run –name <nombre_contenedor> -h ubuntuDocker -it ubuntu:18.04 /bin/bash
# Publicar el puerto 80 del contenedor al 8080 del host.
docker run -it --name test -p 8080:80 debian test
# Publicar todos los puertos expuestos a puertos aleatorios del host.
docker run -it --name test -P debian bash
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
docker rm e7e8165c699a
# Eliminar todos los contenedores
docker rm $(docker ps -aq)
```

### docker ps
Listar contenedores.
```shell
docker ps
# Listar contenedores que no se encuentran en ejecución en este momento
docker ps -a
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
# Listar redes
docker network ls
# Crear red
docker network create
# Eliminar red
docker network rm
# Mostrar información detallada de las redes
docker network inspect
# Conectar a un contenedor a una red
docker network connect
# Desconectar a un contenedor de una red
docker network disconnect
# Eliminar redes no utilizadas
docker network prune
```

### docker cp
Copiar información del contenedor a local.
```shell
docker cp <id_contenedor>:<path_contenedor> <path_host_local>
```
### docker-compose
Trabajar con Docker Compose.
```shell
# Parar y eliminar todos los contenedores que Docker Compose ha creado
docker-compose down
# Si tu fichero de Docker Compose no tiene el nombre por defecto, le indicamos el nuevo nombre con -f.
docker-compose -f compose_name.yml up -d
# Listar servicios
docker-compose ps
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
docker search <término>
```

### docker save
Guardar imagen en un fichero `.tar`.
```shell
docker save --outpout <nombre_contenedor> <nombre_empaquetado_contenido.tar>
docker export --output <nombre_contenedor> <nombre_empaquetado_contenido.tar>
docker import <nombre_empaquetado_contenido.tar> <nombre_contenedor>
```

### docker load
Cargar una imagen desde un archivo tar o STDIN (Standard Input).
```shell
docker load --input <test.tar>
```

### docker df
Mostrar el uso del disco por Docker.

### docker create
Crear contenedores. El contenedor se crea pero no se inicia.
```shell
docker create -it --storage-opt size=120G fedora /bin/bash
```

### docker restart
Reiniciar contenedor.
```shell
docker restart container_name;
```

### docker stats
Mostrar estadísticas de uso de los recursos de contenedores (CPU, Memoria, I/O, PIDs).
```shell
# Estadísticas generales
docker stats
# Estadísticas del contenedor
docker stats <id o nombre_imagen>
```

### docker system
Administrar Docker.
```shell
# Eliminar todos contenedores, redes, imágenes o volúmenes "colgantes" sin referencia o no utilizados
docker system prune
# Información del sistema
docker system info