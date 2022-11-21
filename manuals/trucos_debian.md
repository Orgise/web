# Trucos GNU/Linux
Estos trucos también se aplican para las distribuciones basadas en Debian GNU/Linux (Ubuntu, Linux Mint, etc.).

## Comandos

### Descargar paquete y sus dependencias
```shell
sudo apt install --download-only pkg_name
```
**Nota:** los empaquetados se guardarán en `/var/cache/apt/archives/`.

### Mostrar información de un paquete

```shell
sudo apt-cache show nombre_paquete
```

### Instalar programas *.deb* junto a sus dependencias
```shell
sudo apt install ./programa.deb
# Otra forma
sudo dpkg -i programa.deb
sudo apt install -f
```

### Contar el número de paquetes que tenemos instalados
```shell
dpkg-query -l | wc -l
```

### Visualizar la fecha, operación y nombre de los últimos paquetes gestionados
El fichero `/var/log/dpkg.log` contiene información sobre la totalidad de paquetes instalados y desinstalados mediante el comando dpkg. Dpkg es el administrador de paquetes de Debian.
```shell
tac /var/log/dpkg.log | less
```

### Activar backports en Debian 11, instalar y actualizar los paquetes

Los *backports* son repositorios oficiales de Debian que cuentan con paquetes algo más actualizados, pero fuera de la rama *stable*.

```shell
sudo nano /etc/apt/sources.list
```

Añadimos las dos siguientes líneas:

```shell
deb <http://deb.debian.org/debian> bullseye-backports main contrib non-free
deb-src <http://deb.debian.org/debian> bullseye-backports main contrib non-free
```

Ejemplos:

```shell
# Actualizar paquetes usando backports
sudo apt -t bullseye-backports update
sudo apt -t bullseye-backports upgrade
# Instalar paquetes usando backports
sudo apt install "package-name" -t bullseye-backports
```

### Instalar SmartPSS en GNU/Linux con Wine

[Descargar el programa](https://dahuawiki.com/SmartPSS)

```shell
# Añadir soporte para 32 bits
sudo dpkg --add-architecture i386
#  Instalar Wine y otras dependencias:
sudo apt update && sudo apt install wine wine32 wine64 libwine libwine:i386 fonts-wine
# Instalar el programa
wine nombre_programa.exe
```
