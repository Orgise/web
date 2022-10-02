# Trucos Git en GNU/Linux

## Cultura

* Para ignorar ficheros y no tenerlos en cuenta para incluirlos en el repositorio creamos un fichero llamado ***.gitignore*** y dentro de este por cada línea escribimos el elemento a ignorar.
* Head o el símbolo asterisco (\*) hace referencia al commit en el que nos encontramos en este momento
* Un Issue es una tarea a realizar o un fallo a corregir para próximas versiones
* Un Milestone es una forma de administrar los issues y poder asignarle un tiempo límite para su realización
* Los Label nos ayudan a categorizar los Issues.
* Las Tags (Etiquetas) nos ayudan a marcar un commit con el número de una versión.

### git hooks

Un hook es un script se que dispara cuando ejecutamos cierto comando usando git. Ejemplo: Tras hacer commit podemos automatizar el push a GitHub y luego que se copie nuestro cambios en el hosting haciendo push mediante SSH y reinicie el servidor web. Para crear un hook entramos en .git/hooks y creamos un fichero llamado post-commit (para que se ejecute después de un commit) y después ya ponemos nuestros comandos como si un script de bash se tratase.

```shell
#!/bin/bash
git push origin miRama
ssh root@miservidor.org ‘bash -s’ < deployment.sh
```

**deployment.sh**

```shell
#!/bin/bash
cd ../var/www/html/miweb
git pull origin miRama
sudo service apache2 restart
```

### Conexión mediante SSH a GitHub
[Tutorial oficial de GitHub](https://docs.github.com/es/authentication/connecting-to-github-with-ssh)

[Tutorial alternativo](https://juncotic.com/repositorios-git-ssh/)

Generamos una llave en nuestra máquina

```shell
sudo apt install openssh-client
cd ~/.ssh && ssh-keygen
```

Le pondremos el nombre "github" para identificarla bien y una contraseña de paso.

En el caso que hayamos creado una clave especificando su nombre es necesario configurar SSH para que sepa cuál es el nombre del archivo que contiene la clave. Si hemos creado las claves con los nombres por defecto no es necesario este paso.

Para realizar esta configuración es necesario modificar ( o crear en el caso que no exista) el archivo `~/.ssh/config`

Dentro de este archivo se encontrará una lista de servidores que se conectaran por SSH y el archivo correspondiente para cada clave. 

```shell
nano ~/.ssh/config
```

```
Host github.com
  User git
  Hostname github.com
  IdentityFile ~/.ssh/github
```

GitHub Settings → SSH and GPG keys → New SSH key En el campo Key pegamos el contenido de github.pub. Podemos no incluir el nombre de nuestra máquina ni de nuestro usuario sin problema.

Nos vamos a nuestro proyecto en GitHub y pulsamos Code para copiar la dirección SSH.

Añadimos una nueva conexión remota:

```
cd /ruta_al_repositorio
git remote add origin git@github.com:usuario/proyecto.git
```

Ya podremos hacer push sin tener que poner credenciales

### Evitar poner la *passphrase* de la llave SSH cada vez que interactuemos con el repositorio
```shell
# Iniciar el agente SSH en segundo plano
eval "$(ssh-agent -s)"
# Indicar la clave privada al agente
ssh-add ~/.ssh/id_rsa
```

**Nota:** estos dos comandos los tendremos que poner siempre en cada nueva sesión pues el agente solo almacena la clave temporalmente.


### Cambiar la *passphrase* de llave ssh
```shell
ssh-keygen -p -f ~/.ssh/id_ed25519
```

### Comprobar la conexión SSH con GitHub
```shell
ssh -T git@github.com
```

## Comandos

Todos los comandos que veremos a continuación se han de ejecutar desde terminal estando dentro del espacio de trabajo donde se vaya a iniciar Git.

### Instalar Git

```shell
sudo apt install git
```

### git config

Sirve para definir valores de configuración de Git a nivel de un proyecto global o local.
De manera predeterminada, el comando escribirá en un nivel local si no se pasa ninguna opción de configuración. La configuración de nivel local se aplica al repositorio en el que se invoca el comando.
> Los valores de configuración locales se almacenan en un archivo que se puede encontrar en el directorio `.git/config` del repositorio.
>
> El nivel de configuración global se corresponde con el fichero `/home/usuario/.gitconfig`.
>
> La configuración de nivel de sistema se aplica a toda una máquina. Afecta a todos los usuarios del sistema operativo y a todos los repositorios. El archivo de configuración se ubica en `/etc/gitconfig`.

```shell
# Establecer nombre
git config --global user.name usuario
git config --global user.name "Usuario Pro"

# Establecer correo electrónico
git config --global user.email usuario@micorreo.org

# Establecer editor de texto prederminado
git config --global core.editor "codium --wait"

# Visualizar archivo de configuración global
git config --global -e

# Ayuda visual de colores
git config --global color.ui true

# Establecer como se tratarán los retornos de carro o saltos de línea
git config --global core.autocrlf input

# En caso de conflicto, elegir qué herramienta usar para visualizar diferencias en el código
git config --global merge.tool kdiff3

# Visualizar todas las configuraciones posibles
git config -h
git config --global --list
```

### git init

Crea un nuevo repositorio de Git. Puede utilizarse para convertir un proyecto existente y sin versión en un repositorio de Git, o para inicializar un nuevo repositorio vacío.

La mayoría de los demás comandos de Git no se encuentran disponibles fuera de un repositorio inicializado, por lo que este suele ser el primer comando que se ejecuta en un proyecto nuevo.

Al ejecutar este comando, se crea un subdirectorio de .git en el directorio de trabajo actual, que contiene todos los metadatos de Git necesarios para el nuevo repositorio.

```shell
# Iniciar un repositorio vacío en el directorio actual
git init
```

### git status

El comando de git status nos da toda la información necesaria sobre la rama actual.

Podemos encontrar información como:
- Si la rama actual está actualizada.
- Si hay algo para confirmar, enviar o recibir (pull).
- Si hay archivos en preparación (staged), sin preparación (unstaged) o que no están recibiendo seguimiento (untracked).
- Si hay archivos creados, modificados o eliminados.

```shell
# Mostrar el estado actual de nuestro repositorio
git status
# Mostrar el estado actual de nuestro repositorio en formato corto
git status -s
```

### git add

Cuando creamos, modificamos o eliminamos un archivo, estos cambios suceden en local y no se incluirán en el siguiente commit (a menos que cambiemos la configuración).

Necesitamos usar el comando git add para incluir los cambios del o de los archivos en tu siguiente commit.

```shell
# Agregar todos los ficheros a la etapa de stage
git add .
git add -A
git add --all
# Agregar todos los ficheros .txt a la etapa de stage
git add *.txt
# Agregar varios ficheros a la etapa de stage
git add holaMundo.java adiosMundo.sh
```

### git commit

Este es el comando de Git más usado. Una vez que se llega a cierto punto en el desarrollo, queremos guardar nuestros cambios (quizás después de una tarea o asunto específico).  

El comando permite establecer puntos de control en el proceso de desarrollo al cual puedes volver más tarde si es necesario.

También necesitamos escribir un mensaje corto para explicar qué hemos desarrollado o modificado en el código fuente.

```shell
# Comprometer nuestro trabajo
git commit -m "Descripción del commit"
# Nota: si no le ponemos una descripción nos abrirá el editor y nos pedirá que se la pongamos.

# Cambiar descripción del último commit realizado
git commit --ammend -m "Nueva descripción"

# Si se te olvida incluir un fichero en el commit
git add NOMBRE-DEL-FICHERO-OLVIDADO
git commit --amend -m "un mensaje de commit actualizado"
```

Confirmar una instantánea de todos los cambios del directorio de trabajo. Esta acción solo incluye las modificaciones a los archivos con seguimiento (los que se han añadido con `git add` en algún punto de su historial).
```shell
git commit -am "Descripción del commit"
```

### git rm

Eliminar ficheros

```shell
git rm archivo.txt
```

### git restore

Permite reestablecer tu estado actual a un estado específico. Puedes restablecer el estado de archivos específicos, así como el de todo una rama. Esto es útil si aún no has subido tu commit a GitHub o a otro repositorio remoto.

```shell
# Restaurar algún cambio que hayamos pasado a stage
git restore --staged archivo.txt

# Recuperar un archivo eliminado
git restore archivo.txt
```

### git mv

Mover o renombrar un fichero, un directorio o un enlace simbólico.

```shell
git mv archivo.txt nuevoNombre.txt
```

### git diff

Se utiliza cuando deseas ver las diferencias entre dos árboles. 

```shell
# Mostrar cambios realizados en los ficheros
git diff

# Mostrar cambios realizados en los ficheros en la tapa staged
git diff --staged
```

### git log

```shell
# Mostrar el historial de commits
git log
git log --oneline (formato corto)
```

### git branch

Permite crear, enumerar y eliminar ramas, así como cambiar su nombre.

```shell
# Mostrar la rama en la que nos encontramos
git branch

# Mostrar ramas tanto locales como remotas
git branch -a

# Eliminar rama
git branch -D nombreRama
```

### git checkout

Permite desplazarte entre las ramas creadas por `git branch`.

```shell
# Cambiar de rama o commit
git checkout nombre

# Crear y cambiar de rama
git checkout -b nombreRama

# Volver a un commit antiguo
# Debemos copiar el SHA del commit al que queramos viajar
git log
git checkout SHA_copiado

# Fusionar el contenido de otras ramas a la principal
git checkout master (hay que situarse primero en la principal)
git merge otraRama
```

## git push

Envía tus commits al repositorio remoto.

```shell
# Subir una nueva rama al repositorio
git push -u origin nueva_rama

# Subir los cambios a una rama existente al repositorio
git push origin nombre_rama

# Forzar sincronización remota
git push origin nombre_rama -f

# Subir un tag
git push origin v1.0

# Marcar la rama main como upstream
git push --set-upstream origin main

# Subir todos los tags creados
git push origin --tags
```

### git remote

Permite crear, ver y eliminar conexiones con otros repositorios.

```shell
# Indicar servidor remoto donde subir nuestros cambios
git remote add origin URL.git

# Visualizar repositorio donde se almacena nuestro código
git remote -v

# Eliminar conexión al repositorio
git remote remove origin
```

### git reset

El comando permite reestablecer tu estado actual a un estado específico. Puedes restablecer el estado de ficheros específicos, así como el de toda una rama. Esto es útil si aún no has subido tu commit a GitHub o a otro repositorio remoto.

```shell
# Borrar un commit (sin que afecte al código actual)
git reset --soft SHA

# Restaurar el código de un commit borrando los siguientes creados a este (peligroso)
git reset --hard SHA

# Eliminar el último commit hecho localmente
git reset --soft HEAD^

# Sacar un fichero del área de stage después de haberlo añadido
git reset HEAD FICHERO-A-UNSTAGE
```

[Tutorial para borrar el último commit remoto](https://gist.github.com/CrookedNumber/8964442)

### git revert

Deshace los cambios realizados por un commit anterior creando un commit completamente nuevo, todo esto sin alterar el historial de commits.

```shell
git revert HEAD
```

### git help

Mostrar ayuda.

```shell
git help
man git-status
git help status
```

### git clone

Realizará una copia local del repositorio alojado en la dirección dada.

```shell
git clone URL.git
```

### git tag

Es el manejador oficial de etiquetas, permitiendo crearlas, modificarlas y eliminarlas.

```shell
# Crear un tag
git tag v1.0
git tag -a v1.0 -m "Mensaje"

# Crear un tag de un commit antiguo
git tag v1.0 SHA
```

### git fetch

Actualizar el repositorio local con la información de metadatos más reciente del original (pero no realiza ninguna transferencia de ficheros). Es más como simplemente verificar si hay algún cambio disponible.

Puedes usar `git fetch` para conocer los cambios realizados en un repo/rama remota desde tú última pull. Esto es útil para permitir la comprobación antes de hacer el actual pull, lo que podría cambiar los archivos de tu actual rama y la copia de trabajo(y potencialmente perder sus cambios, etc.).

```shell
git fetch origin
```

### git pull

Recibir actualizaciones del repositorio remoto.

```shell
# Obtener los cambios del servidor remoto
git pull origen
```
