# **Trucos Git en GNU/Linux**

## **Cultura**

* Para ignorar ficheros y no tenerlos en cuenta para incluirlos en el repositorio creamos un fichero llamado ***.gitignore*** y dentro de este por cada línea escribimos el elemento a ignorar.
* Head o el símbolo asterisco (\*) hace referencia al commit en el que nos encontramos en este momento
* Un Issue es una tarea a realizar o un fallo a corregir para próximas versiones
* Un Milestone es una forma de administrar los issues y poder asignarle un tiempo límite para su realización
* Los Label nos ayudan a categorizar los Issues.
* Las Tags (Etiquetas) nos ayudan a marcar un commit con el número de una versión.

### **git hooks**

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

### **Conexión mediante SSH a GitHub**
[Tutorial oficial de GitHub](https://docs.github.com/es/authentication/connecting-to-github-with-ssh)

[Tutorial alternativo](https://juncotic.com/repositorios-git-ssh/)

Generamos una llave en nuestra máquina

```shell
sudo apt install openssh-client
cd ~/.ssh && ssh-keygen
```

Le pondremos el nombre “github” para identificarla bien y una contraseña de paso.

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

## **Comandos**

### **Instalación**

```shell
sudo apt install git
```

### **git config**

```shell
# Establecer nombre
git config --global user.name usuario
git config --global user.name “Usuario Pro”

# Establecer correo electrónico
git config --global user.email usuario@micorreo.org

# Establecer editor de texto prederminado
git config --global core.editor “codium --wait”

# Visualizar archivo de configuración global
git config --global -e

# Ayuda visual de colores
git config --global color.ui true

# Establecer como se tratarán los retornos de carro o saltos de línea
git config --global core.autocrlf input

# Visualizar todas las configuraciones posibles
git config -h
git config --global --list
```

### **git init**

```shell
# Iniciar un repositorio vacío en el directorio actual
git init
```

### **git status**

```shell
# Mostrar el estado actual de nuestro repositorio
git status
git status -s (short)
```

### **git add**

```shell
# Agregar ficheros a la etapa de stage
git add *.txt
git add -A (todos)
git add --all
git add holaMundo.java adiosMundo.sh
```

### **git commit**

```shell
# Comprometer nuestro trabajo
git commit -m “Descripción del commit”
# Nota: si no le ponemos una descripción nos abrirá el editor y nos pedirá que se la pongamos.

# Cambiar descripción del último commit realizado
git commit --ammend -m “Nueva descripción”
```

### **git rm**

```shell
# Borrar un fichero y añadir dicho cambio a la etapa de stage
git rm archivo.txt
```

### **git restore**

```shell
# Restaurar algún cambio que hayamos pasado a stage
git restore --staged archivo.txt

# Recuperar un archivo eliminado
git restore archivo.txt
```

### **git mv**

```shell
# Mover o renombrar un fichero y añadir dicho cambio a la etapa de stage
git mv archivo.txt nuevoNombre.txt
```

### **git diff**

```shell
# Mostrar cambios realizados en los ficheros
git diff

# Mostrar cambios realizados en los ficheros en la tapa staged
git diff --staged
```

### **git log**

```shell
# Mostrar el historial de commits
git log
git log --oneline (formato corto)
```

### **git branch**

```shell
# Mostrar la rama en la que nos encontramos
git branch

# Mostrar ramas ocultas
git branch -a

# Eliminar rama
git branch -D nombreRama
```

### **git checkout**

```shell
# Cambiar de rama o commit
git checkout nombre

# Crear y cambiar de rama
git checkout -b nombreRama

# Volver a un commit antiguo
git log (copiamos el SHA del commit al que queramos viajar)
git checkout SHA_copiado

# Fusionar el contenido de otras ramas a la principal
git checkout master (hay que situarse primero en la principal)
git merge otraRama
```

## git push

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

### **git remote**

```shell
# Indicar servidor remoto donde subir nuestros cambios
git remote add origin URL.git

# Visualizar repositorio donde se almacena nuestro código
git remote -v

# Eliminar conexión al repositorio
git remote remove origin
```

### **git reset**

```shell
# Borrar un commit (sin que afecte al código actual)
git reset --soft SHA

# Restaurar el código de un commit borrando los siguientes creados a este (peligroso)
git reset --hard SHA

# Eliminar el último commit hecho localmente
git reset --soft HEAD^

```

[Tutorial para borrar el último commit remoto](https://gist.github.com/CrookedNumber/8964442)

### **git help**

```shell
# Mostrar ayuda de git
git help
man git-status
git help status
```

### **git clone**

```shell
# Copiar el código fuente de un proyecto a nuestro equipo
git clone URL.git
```

### **git tag**

```shell
# Crear un tag
git tag v1.0
git tag -a v1.0 -m “Mensaje”

# Crear un tag de un commit antiguo
git tag v1.0 SHA
```

### **git fetch**

```shell
# Obtener commits realizados por otros desarrolladores del proyecto
git fetch origin
git merge origin/master
```

### **git pull**

```shell
# Obtener los cambios del servidor remoto
git pull origen
```
