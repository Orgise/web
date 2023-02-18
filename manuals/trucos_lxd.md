# Trucos LXD

## Introducción
Linux Container Daemon es una herramienta de gestión de contenedores en GNU/Linux basada en LXC (LinuX Container). Es desarrollada por Canonical. 

Para usarla no es necesario instalar LXC.

[Documentación oficial](https://linuxcontainers.org/lxd/docs/master/)

## Instalación
LXD se instala mediante snap, a no ser que uses Alpine Linux, Fedora, Arch Linux o Gentoo, donde podrás realizar la [instalación](https://linuxcontainers.org/lxd/getting-started-cli/) con un solo comando.

Instalar snaps dentro de contenedores es difícil, por lo que se recomienda la instalación de LXD en una máquina física o virtual.
```shell
# Instalamos snap
sudo apt install snapd
# Instalamos LXD
sudo snap install lxd
# Agregamos a nuestro usuario al grupo lxd
sudo usermod -aG lxd your_username
# Cerramos sesión y entramos de nuevo
# Comprobamos que lxd funciona
lxd version
# Debe aparecer un número por pantalla
```

Si nos muestra que el comando `lxd version` no existe modificamos el fichero `.bashrc` agregándole al final:
```
if [ -d "/snap/bin" ] ; then
    PATH="/snap/bin:$PATH"
fi
```

Por último, ponemos el comando `source ~/.bashrc` y comprobamos de nuevo.

## Comandos

### lxd init
Configurar el demonio LXD. Imprescindible antes de ejecutar cualquier otro comando de lxd. Se ejecuta como administrador.

Configurar LXD rápidamente (no recomendado):
```shell
sudo lxd init --minimal
```

Configurar LXD de forma personalizada:
```shell
sudo lxd init
```

Would you like to use LXD clustering? (yes/no) [default=**no**]:

Do you want to configure a new storage pool? (yes/no) [default=**yes**]:

Name of the new storage pool [default=**default**]:

Name of the storage backend to use (btrfs, dir, lvm, zfs) [default=**zfs**]:

Create a new ZFS pool? (yes/no) [default=**yes**]:

Would you like to connect to a MAAS server? (yes/no) [default=**no**]:

Would you like to create a new local network bridge? (yes/no) [default=**yes**]:

What should the new bridge be called? [default=**lxdbr0**]:

What IPv4 address should be used? (CIDR subnet notation, “auto” or “none”) [default=**auto**]:

What IPv6 address should be used? (CIDR subnet notation, “auto” or “none”) [default=**auto**]:

Would you like LXD to be available over the network? (yes/no) [default=**no**]:

Would you like stale cached images to be updated automatically? (yes/no) [default=**yes**]:

Would you like a YAML "lxd init" preseed to be printed? (yes/no) [default=**no**]:

### lxc image
Ejecutar operaciones con las imágenes.

```shell
# Mostrar todas las imágenes en uno de los servidores predeterminados.
lxc image list images: | less
# Mostrar todas las imágenes de Debian en su version 11, con arquitectura amd64 y de tipo máquina virtual
lxc image list images: debian/11 arch=amd64 type=disk-kvm.img

# Exportar imagen a un comprimido
lxc image export alias_imagen

# Importar imagen desde una exportación anterior en formato comprimido
lxc image import nombre_comprimido.tar.gz --alias alias_imagen

# Eliminar una imagen
lxc image delete image_name
```

### lxc launch
Crear un contenedor o máquina virtual.
```shell
lxc launch ubuntu:22.04
lxc launch ubuntu:9413425d61ea
# Especificar nombre del contenedor
lxc launch images:ubuntu/jammy mi_ubuntu
# Crear máquinas virtuales
lxc launch debian/11 debian11 --vm -c limits.cpu=4 -c limits.memory=4GiB --console=vga
```

### lxc list
Listar todos los contenedores creados.
```shell
# Listado general
lxc list
# Solo contenedores
lxc list type=container
# Solo ejecutándose
lxc list status=running
# Por nombre
lxc list ubuntu.*
```

### lxc start
Arrancar un contenedor.
```shell
lxc start nombre-contenedor
# Arrancar una máquina virtual con interfaz gráfica usando QEMU
lxc start vm_name --console=vga
```

### lxc restart
Reiniciar un contenedor.
```shell
lxc restart nombre-contenedor
```

### lxc pause
Pausar un contenedor.
```shell
lxc pause nombre-contenedor
```

### lxc stop
Detener un contenedor.
```shell
lxc stop nombre-contenedor
# En caso de que no se detenga por las buenas
lxc stop nombre-contenedor --force
```

### lxc delete
Eliminar un contenedor o instantánea.
```shell
lxc delete nombre-contenedor
lxc delete container_name/snapshot1
```

### lxc shell
Entrar en el contenedor.
```shell
lxc shell nombre-contenedor
```

### lxc exec
Ejecutar comandos en el contenedor.
```shell
lxc exec micontenedor bash
lxc exec micontenedor -- ls -l /usr
```

### lxc file push
Enviar ficheros al contenedor.
```shell
# Enviar fichero
lxc file push /ruta_local/nombre_fichero nombre_contenedor/ruta_destino/nombre_fichero
# Enviar directorio recursivamente mostrando cada operación por pantalla
lxc file push /ruta_local_directorio nombre_contenedor/ruta_destino/directorio_destino -rv
```

### lxc file pull
Recibir ficheros del contenedor.
```shell
# Recibir fichero
lxc file pull nombre_contenedor/ruta_al_fichero /ruta_destino/nombre_fichero
# Recibir directorio recursivamente mostrando cada operación por pantalla
lxc file pull nombre_contenedor/ruta_al_directorio_remoto ruta_al_directorio_local -rv
```

### lxc remote list
Puede ver la lista de servidores añadidos.
```shell
lxc remote list
```

### lxc rename
Renombrar contenedor. Debe estar detenido.
```shell
lxc rename container_name
```

### lxc info
Mostrar información del contenedor.
```shell
lxc info container_name
```

### lxc storage
Administrar grupos de almacenamiento.
```shell
# Establecer el tamaño de almamcenamiento del grupo default en 20GiB
lxc storage set default volume.size 20GiB
```

### lxc console
Engancharse a la consola de una instancia en ejecución.
```shell
# Acceder a la interfaz gráfica de una VM en ejecucción
lxc console vm_name --type=vga
```

### lxc config show
Mostrar la configuración de un contenedor.
```shell
lxc config show container_name
```

### lxc config set
Modificar la configuración de un contenedor.
```shell
# Limitar el uso del procesador a 2 hilos
lxc config set container_name limits.cpu 2
# Seleccionar un hilo específico
lxc config set container_name limits.cpu 0-0
# Limitar a 100 MB la memoria RAM
lxc config set container_name limits.memory 100MB
# Limitar la cantidad de tiempo de CPU que puede usar el contenedor
lxc config set container_name limits.cpu.allowance 10ms/100ms
# Activar modo privilegiado
lxc config set container_name security.privileged true
```

### lxc config device
Manejar dispositivos.
```shell
# Reducir el uso de almacenamiento a 5 GB. Primero le asignamos el disco raíz al contenedor
lxc config device add container_name root disk pool=default path=/
lxc config device set container_name root size 7GB
# Limitar el uso de la red
lxc config device add container_name eth0 nic name=eth0 nictype=bridged parent=lxdbr0
lxc config device set container_name eth0 limits.ingress 1Mbit
lxc config device set container_name eth0 limits.egress 1Mbit
# Eliminar la ISO de una VM ya instalada
lxc config device remove vm_name iso
# Montar directorio local dentro del contenedor
lxc config device add my-container disk-storage-device disk source=/share/c1 path=/opt
```

### lxc snapshot
Crear instantáneas de un contenedor.
```shell
lxc snapshot container_name snapshot1
```

### lxc publish
Crear imagen de una instantánea de un contenedor.
```shell
# El alias será usado para ser exportado posteriormente
lxc publish container_name/snapshot_name --alias example_alias
```

## Extra

### Instalar máquinas virtuales de Windows
LXD permite virtualizar otros sistemas operativos como Windows.
[Tutorial oficial](https://ubuntu.com/tutorials/how-to-install-a-windows-11-vm-using-lxd#1-overview)

```shell
# Herramienta para crear una imagen de Windows compatible con LXD
sudo snap install distrobuilder --classic
# Instalar dependencias para poder convertir la ISO
sudo apt install wimtools libwin-hivex-perl
# Instalar el visor de máquinas virtuales
sudo apt install virt-viewer
# Creamos la imagen. Debemos ubicarnos en el directorio donde esté la ISO.
# Este proceso tardará varios minutos.
# El resultado de este comando es una nueva imagen de Windows con la que LXD puede trabajar
sudo distrobuilder repack-windows Win11_22H2_Spanish_x64v1.iso win11.lxd.iso
# Creamos una máquina virtual vacía
lxc init win11 --vm --empty
# Incrementamos el tamaño de almacenamiento para poder instalar Windows
lxc config device override win11 root size=50GiB
# Ajustamos la CPU y RAM óptima para la VM
lxc config set win11 limits.cpu=4 limits.memory=8GiB
# Para Windows 11, activamos un TPM virtual
lxc config device add win11 vtpm tpm path=/dev/tpm0
# Indicamos la ruta de la imagen y establecemos el orden de arranque
lxc config device add win11 install disk source=/home/mionaalex/Downloads/win11.lxd.iso boot.priority=10
# Arrancamos la máquina virtual para instalar Windows 11
lxc start win11 --console=vga
# Abrir de nuevo el visor en caso de que se reinicie la VM
lxc console win11 -–type=vga
```

Para mayor comodidad cuando trabaje con la VM, puede instalar los drivers de virtIO.


## Errores comunes

### Instancias LXD sin Internet
Los contenedores no tienen salida a Internet, aunque en el anfitrión funcione sin problemas. Solución:
```shell
# Convertirnos en superusuario
sudo su
# Vaciamos todas las reglas de iptables
for ipt in iptables iptables-legacy ip6tables ip6tables-legacy; do $ipt --flush; $ipt --flush -t nat; $ipt --delete-chain; $ipt --delete-chain -t nat; $ipt -P FORWARD ACCEPT; $ipt -P INPUT ACCEPT; $ipt -P OUTPUT ACCEPT; done
# Reiniciamos el servicio LXD
systemctl reload snap.lxd.daemon 
```

### Instancias LXD sin IPv4
Los contenedores no tienen asignada ninguna dirección IP, normalmente en su versión 4. Esto puede ser debido a restricciones del cortafuegos, así que añadiremos unas cuantas excepciones para nuestra adaptador virtual puenteado "lxdbr0":
```shell
sudo ufw allow in on lxdbr0
sudo ufw route allow in on lxdbr0
sudo ufw route allow out on lxdbr0
```

[Fuente](https://discuss.linuxcontainers.org/t/lxd-bridge-doesnt-work-with-ipv4-and-ufw-with-nftables/10034/27)
