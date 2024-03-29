# Trucos GNU/Linux
A continuación se detallan algunos comandos, herramientas y errores interesantes para los usuarios de GNU/Linux. La distribución base es Debian GNU/Linux aunque la mayoría de los comandos tiene su equivalente en otras distribuciones.

## Comandos

### ¿Cómo formatear una memoria USB?

Primero debemos averiguar el nombre de la memoria con los comandos `lsblk` o `fdisk -l`.

**Aviso:** el dispositivo tiene que estar desmontado. Usa el comando `umount /dev/sdXX` para desmontarlo.

```shell
# Formatear en FAT32
sudo mkfs -t fat32 -n nombre_para_el_usb /dev/sdXX
# Formatear en NTFS
sudo mkfs.ntfs -n nombre_para_el_usb /dev/sdXX
```

### Expulsar el dispositivo del equipo

```shell
sudo eject /dev/sdX
```

### ¿Cómo poner nuestra melodía personalizada al arrancar el sistema?

Lo primero es elegir una melodía. Busca en Internet los términos “grub tune” para encontrar alguna ya hecha o investiga como crear una tú mismo.

1. Comando `sudo nano /etc/default/grub`.
2. Descomenta la línea que dice `GRUB_INIT_TUNE=""`.
3. Entre las comillas inserta tu nueva melodía.
4. Comando `sudo update-grub2`.
5. Reinicia la computadora para escuchar tu temazo a todo volumen.

[Ver algunas melodías](https://etherpad.wikimedia.org/p/grub_tune_compilation)

Desventajas:

* No se le puede bajar volumen: sonará al máximo por el speaker de tu equipo.
* Cuanto más dure, más tardará el sistema en arrancar. Entre 1 y 3 segundos es lo ideal.

### ¿Qué particiones debo crear manualmente cuando instale una distribución GNU/Linux?

* Swap: área de intercambio. De 2 a 4 GB.
* /: raíz. Al menos 20 GB.
* /home: tus datos personales. El espacio restante.
* (Opcional) /boot. Arranque. 2 GB.
* Si tu sistema usa UEFI, deberás crear `/boot/efi`. Al menos 256 MB.

### Borrar el historial de comandos

```shell
history -c
```

### ¿Cómo instalar temas o iconos de Internet y aplicarlos?

1. [Descargar](https://www.mate-look.org/) algún paquete de iconos o de temas.
2. Descomprimir el fichero descargado.
3. Mover el directorio extraída a `/home/tu_usuario/.icons` o `/home/tu_usuario/.themes`.
4. Ir a las opciones de apariencia y marcar el estilo deseado.

**Nota:** la instalación de un tema para todos los usuarios del sistema se hace moviendo el directorio descomprimida a /usr/share/icons o /usr/share/themes.

**Extra:** también puedes aplicar el tema o los iconos para tu gestor de inicio de sesión como lightdm. Un tema que a mi me gusta es Arc que se puede instalar escribiendo el comando:

```shell
sudo apt install arc-theme
```

### Subir, bajar y mutear el volumen del altavoz

```shell
pactl set-sink-volume [TAB] +10%
pactl set-sink-volume [TAB] -10%
pactl set-sink-mute [TAB] toggle
```

**Nota:** *[TAB]:* pulsar la tecla tabulador para autocompletar

### Subir y bajar el volumen del micrófono

```shell
amixer set Capture 5%+
amixer set Capture 5%-
```

### Herramienta para buscar ficheros

```shell
sudo apt install catfish
```

### Personalizar LightDM (gestor de inicio de sesión)

Editamos el fichero `/etc/lightdm/lightdm-gtk-greeter.conf`:

```shell
[greeter]
# Fondo de pantala de inicio de sesión
background=/ruta/imagen/fondo

# Nombre del tema
theme-name=Tema a usar

# Nombre del paquete de iconos
icon-theme-name=Iconos a usar

# Tipografía y tamaño
font-name:Ubuntu 11

# Mostrar información extra en la pantalla
indicators=\~host;\~spacer;\~session;\~clock;\~a11y;\~power

# Teclado virtual a usar. Instalar si no lo tienes
keyboard=onboard

# Posición del diálogo para iniciar sesión. Establecido en la parte izquierda centrado
position=5% 40%

# Usar los fondos de pantalla individuales de cada usuario
user-background=false

# Formato de tiempo para el reloj
clock-format= %a %d %b, %H:%M
```

**Nota:** para dejar un valor por defecto se comenta. Para añadir una foto de tu usuario la debemos ubicar en `/home/usuario/.face`.

Editamos el fichero `/etc/lightdm/lightdm.conf`:

```shell
[Seat:\*]
# Mostrar el nombre de todos los usuarios
greeter-hide-users=false
```

### Restaurar controlador de vídeo abierto (error driver NVIDIA pantalla negra)

Este error se origina cuando en Linux Mint aplicamos desde `Ajustes → Gestor de controladores` los gráficos privativos que nos ofrece Nvidia para nuestra tarjeta gráfica y la pantalla se nos queda en negro tras reiniciar.

```shell
# El comando su, abreviatura de «switch user» («cambiar de usuario» en español), permite a los usuarios ejecutar un programa como si fueran otro usuario.
sudo su
apt purge*\*nvidia\**; apt autoremove; reboot
```

### Ubuntu inicia en la consola después de actualizar la versión de Python
Esto ocurre porque la versión de Ubuntu no es compatible con la nueva versión de Python. Para solucionarlo, volvemos a reinstalar los paquetes y la configuración de Ubuntu por defecto con el siguiente comando:

```shell
sudo apt reinstall ubuntu-desktop
```

Si todavía deseas tener la última versión de Python, puedes elegir alguna de las siguientes opciones:
- Usar [pyenv](https://realpython.com/intro-to-pyenv/).
- Actualizar a la última versión de Ubuntu.
- Probar con otra distribución GNU/Linux.

### Copias de seguridad con rsync (muy recomendado)

Rsync (Remote Sync) es una herramienta de sincronización para copiar ficheros y directorios en un sistema o entre sistemas. La mayor ventaja de rsync es que sólo copia los ficheros modificados y, por lo tanto, reduce el consumo de CPU y ahorra el ancho de banda y el tiempo durante la copia de ficheros.

**Ejemplo 1:** Copiar los ficheros (solo si se encuentran cambios) del directorio A en el directorio Backup-A. 

```shell
rsync A/ Backup-A/
```

> Ten en cuenta que, si tienes un directorio A, utiliza «A» para mencionarlo y no «A/». El uso de A/ se referirá a todos los ficheros del directorio A y no al directorio A en sí. Así que copiar A creará un nuevo directorio en el destino y luego copiará los ficheros en A. Pero copiar A/ copiará sólo los ficheros en A en el destino.

El ejemplo anterior copia los ficheros del origen al destino. Pero si el sistema tenía algunos ficheros extra que no estaban en el origen, esos no serán eliminados por la sincronización de una vía. Si quieres eso, tendrás que usar la **sincronización bidireccional**.

Para mantener ambos puntos finales (directorios o ficheros) en el mismo estado, con los mismos ficheros y sin extras en ninguno de los dos lados, basta con añadir la opción `--delete` al comando original.

```shell
rsync --delete A/ Backup-A/
```

**Ejemplo 2:** Copia de seguridad local de nuestro directorio personal omitiendo ficheros y directorios ocultos usando un dispositivo externo como destino.

```shell
rsync -avh --delete --progress --exclude=".[!.]*" $HOME /media/USB_NAME/backup
```

Otros parámetros importantes:

- `-a`: equivale a `-rlptgoD`, es decir:
    - `-r:` copiar directorios recursivamente.
    - `-l`: copiar enlaces simbólicos.
    - `-p`: conservar permisos.
    - `-t`: conservar el tiempo de modificación.
    - `-g`: conservar el grupo.
    - `-o`: conservar el propietario.
    - `-D`: combinación de:
        - `--devices`: copiar ficheros de tipo dispositivo.
        - `--specials`: copiar ficheros especiales como FIFO o socket.
        
        Alguno de estos ficheros necesitarán permisos de root para poder copiarse, pero lo normal es que no nos encontremos con ellos cuando hagamos copias de nuestros directorios.

> Un **fichero FIFO** es un tipo especial de fichero en el almacenamiento local que permite que dos o más procesos se comuniquen entre sí leyendo/escribiendo en/desde este fichero.
>
> Un **fichero socket** es un punto final de un enlace de comunicación bidireccional entre dos programas que se ejecutan en la red.

- `-n`: comprobar lo que pasaría a la hora de ejecutar el comando.
- `--max-size=SIZE`: no transferir ficheros de mayor tamaño que SIZE.
- `--min-size=SIZE`: no transferir ficheros de menor tamaño que SIZE.
- `-v`: aumentar la verbosidad.
- `-q`: suprimir los mensajes que no sean de error.
- `-h`: mostrar los números en formato amigable.
- `-z`: mostrar los datos durante el envío. Útil para copias remotas lentas.
- `--exclude=PATTERN`: excluir los ficheros que coincidan con el patrón.
- `--exclude-from=FILE`: excluir los ficheros o directorios incluidos en el fichero de exclusión.
- `--include=PATTERN`: no excluir los ficheros que coincidan con el patrón.
- `--include-from=FILE`: incluir los ficheros o directorios incluidos en el fichero de exclusión.
- `--progress`: muestra una barra de progreso de la transferencia.

Importante a tener en cuenta para los ficheros de inclusiones y exclusiones de rsync:
* No cambiar /home/usuario por $HOME porque da problemas
* No poner comentarios en la misma línea que el fichero a excluir
* Puedes poner ficheros que no existan
* No es importante que los ficheros contengan espacios
* No pongas la barra (/) al final de cada ruta

Importante a tener en cuenta antes de ejecutar el comando:
* Probar antes de realizar la transferencia con `--dry-run`
* Comprobar que la ruta de origen y de destino sean la correcta


### Comando tar

El comando tar permite empaquetar y comprimir un fichero o serie de ficheros, incluso hasta el sistema de ficheros completo. Compatible con copias incrementales.

**Ejemplo:** copia total de nuestro directorio personal excluyendo los ficheros y directorios ocultos, además de usar un fichero con más exclusiones.

```shell
tar -X exclusiones-backup.txt --exclude="$HOME/.*" -czvf destino.tar.gz /home_tu_usuario
```

**Parámetros:**

- **-X exclusiones:** una lista de ficheros o directorios que deseo omitir
- **-exclude="$HOME/.\*":** ignorar los ficheros ocultos situados en esa ruta (los ficheros ocultos de los directorios hijos sí se copiarán)
- **-c, --create:** crear un nuevo fichero
- **-z, --gzip:** compresión gzip
- **-v, --verbose:** verbosidad
- **-f, --file:** indica que se dará un nombre al fichero tar.

### Solucionar el problema Redshift (Trying location provider \`geoclue2\`…)

Lo que haremos será crear y editar el fichero de configuración de redshift.

```shell
mkdir ~/.config/redshift && nano ~/.config/redshift/redshift.conf
```

Y pegaremos lo siguiente:

```shell
[redshift]

location-provider=manual

[manual]

; Madrid, Spain

lat=31.10

lon=-5.61
```

Deberás cambiar la latitud y longitud a la adecuada para ti. Reabrimos Redshift y ya estará arreglado.

### Ejecutar lanzadores al iniciar sesión

Crear los lanzadores y moverlos al directorio `/home/tu_usuario/.config/autostart/`.

**Nota:** cuando ejecutemos el instalador, dejamos marcada la casilla `Generate shorcuts` para que cree un lanzador automáticamente en el escritorio.

### Como usar el DNI electrónico (DNIe) en GNU/Linux

1. Introducimos el lector pero no el DNI. Ponemos el comando `lsusb` para ver que lo detecte.
2. Instalamos los paquetes necesarios para trabajar con el DNIe: `sudo apt install opensc-pkcs11 pcsc-tools pcscd pinentry-gtk2 libccid`.
3. Escribimos `pcsc_scan` e introducimos el DNI. Se actualizará la pantalla y al final pondrá DNI Electrónico español (si tu tarjeta es compatible). Si no saliera, instalar los drivers de la página web `dnielectronico.es` correspondientes.
4. Abrimos Firefox. Nos dirigimos a `Preferencias, Privacidad y Seguridad, Dispositivos de seguridad, Cargar`
    - **Nombre:** DNIe (o el que sea).
    - **Fichero:** `/usr/lib/x86_64-linux-gnu/opensc-pkcs11.so`.
5. Entramos en [este enlace](https://www.sede.fnmt.gob.es/certificados/persona-fisica/verificar-estado) para verificar que funciona correctamente. Nos pedirá la contraseña de nuestro DNIe.

**Nota:** Esta guía ha funcionado usando Debian y Mozilla Firefox.

### Como activar el autocompletado del terminal

```shell
sudo apt install bash-completion
```
Pulsar la tecla Tabulador para activar el autocompletado.

### Buscar ficheros y directorios

```shell
# Búsqueda en el directorio actual y sus subdirectorios para encontrar un fichero (no directorio) llamado fichero.txt sin distinción entre mayúsculas y minúsculas
find . -type f -iname fichero.txt
# Buscar fichero en varios directorios
find ./location1 /second/location -type f -name "pattern"
# Encontrar todos los ficheros y directorios vacíos en el directorio actual
find . -empty
# Buscar ficheros de más de 1 GB en el directorio actual
find . -size +1G
# Buscar más pequeños de 20 bytes
find . -size -20c
# Encontrar ficheros de más de 100 MB pero de menos de 2 GB de tamaño
find . -size +100M -size -2G
# Renombrar todos los resultados de la búsqueda con extensión .old
find . -type f -name "*.txt" -exec mv {} {}.old \;
# Listar detalladamente todos los resultados
find . -type f -name "*.txt" | xargs ls -l
# Buscar todos los ficheros .txt que contengan el término Alice
find . -type f -name "*.txt" -exec grep -i alice {} +
find . -type f -name "*.txt" | xargs grep -i alice
```

Recuerda:

| Acrónimo | Significado
|-|-|
| c | bytes
| k | kilobytes
| M | Megabytes
| G | Gigabytes

### Buscar texto en ficheros de un directorio

```shell
grep -Pri texto_a_buscar /ruta/directorio
```

### Desactivar IPv6

Abrimos el fichero de configuración `/etc/sysctl.conf`:

Dentro del fichero, insertamos al final:

```shell
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6=1
# Actualizar cambios sin reiniciar la máquina
sudo sysctl -p
```

Comprobamos que está desactivado:

```shell
ip a | grep inet6
```

### Desactivar Bluetooth

```shell
sudo systemctl stop bluetooth.service
sudo systemctl disable bluetooth.service
systemctl status bluetooth.service
```

### **Cambiando a Windows como predeterminado en el GRUB**

Editamos el fichero de configuración `/boot/grub/grub.cfg`.

Tendremos que modificar la línea `set default="0"`, en la que cambiaremos el 0 por el 4, que es el número que corresponde a la partición de Windows que está instalada junto a tu sistema GNU/Linux.

### Cambiar el nombre de un USB

Abrimos la utilidad de discos `gnome-disk-utilities`.

Seleccionamos el disco USB. Luego, desde el menú de la rueda de herramientas seleccionamos `Edit Filesystem` y cambiamos el nombre.

### Cambiar contraseña de partición cifrada

Arrancamos desde un LiveCD con la utilidad de discos instalada y abierta.

Seleccionamos la partición y desde el menú de la rueda de herramientas seleccionamos `Change Passphrase`.

Cambiamos la contraseña y reiniciamos el equipo.

### Apagar y reiniciar el sistema

```shell
# Apagar inmediatamente
shutdown now
# Apagar en 15 minutos
shutdown +15
# Apagar a las 16:00h de la tarde notificando a los usuarios
shutdown 16:00 "Se apagará el equipo esta tarde"
# Reiniciar el equipo inmediatamente
shutdown -r now
reboot
# Cancelar apagado o reinicio
shutdown -c
```

### Mostrar información del sistema
En algunos de los siguientes comandos se recomienda ejecutar con `sudo` para obtener mayor información.

```shell
# Detalles de la CPU
lscpu
lshw -class CPU
dmidecode --type processor
# Ver número de hilos de la CPU
cat /proc/cpuinfo | grep processor | wc -l
# Temperatura de la CPU
watch -n 2 sensors
# RAM
dmidecode --type 17
lshw -short -C memory
free -h
# Información general
lshw
dmidecode
hwinfo --short --all
# Almacenamiento secundario
sudo fdisk -l
lsblk
# Resoluciones disponibles
xrandr
# Dispositivos conectados al bus PCI, como la tarjeta Wi-Fi
lspci
# Dispositivos USB conectados
lsusb
# Idioma del sistema y distribución del teclado
localectl status
# Muestra información básica sobre el kernel y la versión del sistema operativo
uname -a
# Nombre, versión y entorno de escritorio usado
cat /etc/*release
hostnamectl
# Visualizar uso del disco
df -h
# IP privada
ip address
ip a
hostname -I
# IP privada + información adicional
nmcli -p device show
# IP pública
host myip.opendns.com resolver1.opendns.com
curl ifconfig.me
```

Para encontrar el resultado buscado, fíjate bien en términos como *Intel*, *Realtek* o *Wireless*.

### Instalar controladores para tarjetas Wi-Fi Intel y Realtek
Si estamos en Debian, debemos añadir el repositorio *non-free*.

```shell
sudo apt install firmware-iwlwifi # Intel
sudo apt install firmware-realtek # Realtek
# Reiniciamos el equipo para aplicar cambios
```

### Instalar controladores para tarjeta Wi-Fi BCM4311

```shell
sudo apt-get remove bcmwl-kernel-source
sudo apt-get install firmware-b43-installer b43-fwcutter
```

Reiniciamos y encendemos el adaptador inalámbrico desde los ajustes de red.

### Reiniciar en BIOS

```shell
systemctl reboot --firmware-setup
```

Este comando reiniciará el PC y entrará automáticamente a la BIOS ya que si tenemos activado el *Fast Boot* no podremos acceder a ella.

### Eliminar los repositorios externos

```shell
sudo rm /etc/apt/sources.list.d/\*
sudo apt update
```

### Retener paquetes
Útil para evitar que un paquete se actualice.

```shell
# Retener
sudo apt-mark hold <package-name>
# Liberar
sudo apt-mark unhold <package-name>
# Listar retenidos
sudo apt-mark showhold
```

### Cambiar la ruta por defecto de los directorios principales del usuario

```shell
nano .config/user-dirs.dirs
```

### Encontrar y eliminar ficheros duplicados

```shell
sudo apt install fdupes
```

### Ver las fuentes instaladas en nuestro sistema

```shell
fc-list
```

### Visualizar las últimas sesiones de un usuario

```shell
last nombre_usuario
lastlog -u <user>
```

### Ocultar GRUB al inicio

Editamos el fichero de configuración `/etc/default/grub`:

Asignamos el valor `0` a la variable `GRUB_TIMEOUT`.

```shell
# Recargamos la configuración de grub
sudo update-grub
```

### Recuperar ficheros con Photorec

```shell
sudo apt install testdisk
sudo photorec
```

1. Seleccionamos la unidad, luego la partición.
2. En `file opt` elegimos los formatos a recuperar.
3. Pulsamos `search` y elegimos el sistema de ficheros de la partición.
4. Elegimos la opción `Whole` para que lo escanee todo.
5. Elegimos un directorio donde guardar los ficheros recuperados (hay que entrar en él y luego pulsar `c`).

### Instalar temas LibreOffice

```shell
sudo apt install libreoffice-style-*
```

Reiniciar LibreOffice para aplicar cambios.

### El corrector ortográfico no funciona en LibreOffice

```shell
sudo apt install hunspell hunspell-es
```

Reiniciar LibreOffice para aplicar cambios.

### Cerrar procesos

```shell
# Forzar terminación de todos los procesos ping
pkill -9 ping
# Cerrar solo el proceso exacto que se ha indicado sin distinción de mayúsculas y mostrando lo que ha cerrado
pkill -fie "ping gnu.org"
# Cerrar un proceso con ID 1234
kill 1234
# Cerrar todos los procesos hijos y el proceso padre a la vez
killall ping
# Cerrar proceso seleccionando con el ratón la ventana
xkill
```
Señales más usadas de terminación de procesos:

| Señal | Descripción
|-|-|
| 9 (SIGKILL) | Cierra inmediatamente un proceso, sin permitirle guardar su estado actual
| 15 (SIGTERM) | Solicita la terminación del proceso. Esta señal puede ser ignorada por un proceso. Pero esta es la forma preferida de terminar un proceso ya que puede liberar los recursos cuando el proceso recibe SIGTERM. Es la que se usa por defecto

### Mover o renombrar ficheros y directorios

```shell
# Mover varios ficheros a la vez
mv fichero1.txt fichero2.txt fichero3.txt directorio_destino
# Renombrar directorio
mv directorio_de_origen nuevo_nombre_directorio
# Evitar sobrescribir el fichero si ya existe en destino
mv -n fichero_de_origen directorio_de_objetivo
```

Otros parámetros importantes:

- `-n`: evitar sobrescribir si ya existe en destino.
- `-i`: preguntar antes de sobrescribir.
- `-b:` sobrescribir creando una copia de seguridad.

### Contar el número de líneas, palabras y caracteres

```shell
# Número de líneas
wc -l fichero.txt
# Número de palabras
wc -w fichero.txt
# Número de caracteres
wc -c fichero.txt
```

### Ejecutar comandos o scripts en un momento determinado usando cron y crontab
[Tutorial](https://es.itsfoss.com/crontab-linux/)

Notas:

- Crontab es el fichero de configuración que contiene la lista de tareas programadas que el demonio Cron va a ejecutar.
- El fichero /etc/crontab es compartido por todos los usuarios.
- Crontab solo obtiene algunas variables de entorno del usuario.
- Para hacer que crontab lance aplicaciones gráficas hay que establecer la variable de entorno `DISPLAY=:0` ya sea en el propio crontab o en el script.

Ejemplos comando crontab:

```shell
# Crear/Editar crontab
crontab -e
# Borrar crontab del usuario actual solicitando confirmación
crontab -ir
# Ver crontab del usuario john
crontab -u john -l
```

Ejemplos tareas Crontab:

```shell
# Comprobar las variables de entorno que recibe crontab del usuario
* * * * * env > /tmp/cron.env
# Subir el volumen al 100% cada vez que arranque el equipo. También se puede usar pactl o pacmd
@reboot amixer -c 0 -- sset Master 100%
```


### Ejecutar comandos o scripts en un momento determinado usando at
[Tutorial](https://noviello.it/es/como-programar-la-ejecucion-de-tareas-con-el-comando-at-en-linux/)


### Comprimir ficheros y directorios

```shell
sudo apt install zip unzip
# Crear un comprimido a partir de un montón de ficheros y directorios
zip -r fichero_salida.zip fichero1 directorio1
```

### Escribir y enviar texto automáticamente cuando se pulse una combinación de teclado

Instalamos la siguiente herramienta de automatización (macro):

```shell
sudo apt install xdotool
```

Creamos un nuevo atajo de teclado `Ajustes → Teclado → Atajos de aplicación`.

**Ejemplo:** Escribir un mensaje al pulsar la tecla *Return*:

```shell
bash -c "sleep .1 && xdotool type 'Mensaje' && xdotool key Return"
```

### Copiar ficheros

```shell
# Copiar un fichero en otro directorio
cp /etc/issue ~/version.txt
# Copiar múltiples directorios recursivamente a un destino
cp -r directorio_origen_1 directorio_origen_2 directorio_origen_3 directorio_objetivo
```

### Comprobar que distribución estoy usando

```shell
lsb_release -d
uname -a
cat /etc/os-release
hostnamectl
```

### Cambiar permisos
**Nota:** Con chmod y sudo tienes el poder de cambiar los permisos en casi cualquier fichero. Esto no significa que debas hacerlo. Los permisos fuera de su directorio personal están establecidos de la manera que están por una razón. Cambiarlos es raramente la solución apropiada a cualquier problema.

```shell
# Otorgar permisos de ejecución al propietario para un fichero
chmod o+x fichero.txt
# Otorgar al propietario permiso de lectura y escritura mientras que el grupo y todos los demás tienen permiso de lectura
chmod 644 fichero.txt
```

### Cambiar propiedad de ficheros o directorios

```shell
# Establecer tu usuario personal como propietario de todos los ficheros de su directorio personal
sudo chown -R $USER:$USER $HOME
```

### Cambiar de directorio

```shell
# Cambiar al último directorio de trabajo
cd -
# Moverse al directorio personal.
# La virgulilla se obtiene pulsando AltGr + 4 o AltGr + ñ
cd ~
# Cambiar al directorio pasado como último argumento al comando anterior. Ejemplo:
ls $HOME
cd !$ # Nos moveremos al directorio personal
```

Usando pushd, popd y dirs para navegar con mayor facilidad entre directorios:

- pushd: añadir directorios a la pila.
- popd: eliminar directorios de la pila.
- dirs: listar directorios de la pila.

La pila se utiliza para guardar rutas de directorios en la memoria. Se mantiene hasta que se cierra la consola.
El historial de la pila se ordena de más reciente a más antiguo.
La posición número 0 de la pila se irá reescribiendo y siempre será el directorio de trabajo actual.
Ejemplos:

```shell
# Guardar directorio actual en la pila
pushd <dir>
# Rotar la pila para que el número introducido de la pila sea el primero, permitiéndonos cambiar a ese directorio
pushd +2
# Cambiar al directorio 3 de la pila sin que se agregue un nuevo elemento a la misma
cd ~3
# Borra y cambia al directorio cero de la pila
popd
# Agregar directorio a la pila sin cambiar de directorio
pushd -n <dir>
# Eliminar el elemento 2 de la pila
popd +n 2
# Listar pila en formato largo (ruta absoluta) y numerado
dirs -l -v
```

### Invocar al último comando introducido
Lo hacemos con `!!`. Ejemplo:

```shell
# Típico error al instalar un software sin tener permisos para ello
apt install vlc
sudo !! # Es equivalente a sudo apt install vlc
```

### Obtener el código de salida del último comando introducido

```shell
echo $?
```

### Vaciar el contenido de un fichero

```shell
> fichero.txt
```

### Descargar ficheros de Internet

```shell
sudo apt install wget
wget URL
# Descargar varios ficheros, cuyas URL estarán en fichero.txt
wget -i fichero.txt
# Descargar ficheros con un nombre diferente
wget -O nombre_del_fichero URL
# Reanudar la descarga anterior
wget -c
```

### Tuberías y redirecciones
[Tutorial](https://www.ochobitshacenunbyte.com/2020/11/05/tuberias-y-redirecciones-en-linux/)

### Concatenar comandos
[Tutorial](https://javiermartinalonso.github.io/linux/2018/01/23/linux-tips-concatenar-comandos.html)

### Abrir un fichero o URL usando la aplicación favorita del usuario

```shell
# Abrir el directorio actual en el explorador de ficheros
xdg-open .
# Abrir la URL proporcionada en su navegador
xdg-open https://gnu.org
```

### Exportar todos los Writer a PDF

```shell
lowriter --headless --convert-to pdf \*.odt
```

**Nota:** habrá tantos *.pdf* como *.odt* haya en el directorio actual.

### Convertir múltiples PDF en uno solo

```shell
pdftk mypdf1.pdf mypdf2 cat output salida.pdf
```

### Instalar entorno de desarrollo (LAMP) en Debian
[Tutorial completo](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mariadb-php-lamp-stack-on-debian-10)

### Crear 10 ficheros rápidamente

```shell
touch test{1..10}.txt
```

### Visualizar el tamaño del directorio actual
El comando du se puede usar para verificar cuánto espacio de almacenamiento ocupa una carpeta o directorio. Es útil para identificar qué parte de un sistema está usando una cantidad excesiva de espacio de almacenamiento.

```shell
du -sh .
```

### Ordenar ficheros

```shell
# Ordenar numéricamente y enviar el resultado a otro fichero
sort filename.txt -n > filename_ordenado.txt
# Ordenar quitando duplicados
sort filename.txt -u
```
### Ver los 20 comandos más usados

```shell
history | awk 'BEGIN {FS="[ \t]+|\\|"} {print $3}' | sort | uniq -c | sort -rn | head -n 20
```

### Mostrar contenido de ficheros por pantalla

```shell
cat fichero.txt
more fichero.txt
less fichero.txt
# Mostrar las primeras 15 líneas de varios ficheros
head -n 15 fichero.txt fichero2.txt
# Mostrar las últimas 15 líneas de varios ficheros
tail -n 15 fichero.txt fichero2.txt
# Actualizar las líneas a medida que se le añade contenido
tail -f fichero.txt
# Mostrar el contenido y el número de linea
nl fichero.txt
```

### Crear directorios

```shell
mkdir dir1
# Crear los directorios padre si no existen
mkdir -p dir1/dir2/dir3
```

### Dos herramientas para gestionar el portapapeles

```shell
sudo apt install xclip xsel
# Pegar portapapeles
xclip -o
xsel -o
# Añadir al portapapeles el contenido de un fichero
xclip -i ~/.bashrc
xsel -i < ~/.bashrc
# Borrar el contenido del portapapeles
xclip -i /dev/null
xsel -c
```

### Efecto de la película de Matrix

```shell
sudo apt install cmatrix && cmatrix
```

### Mostrar mensaje en bucle

```shell
yes mensaje
```

### Imprimir con efecto arco iris la salida de los comandos

```shell
ls | lolcat
```

### Dos herramientas para mostrar mensajes con tipografías grandes

```shell
sudo apt install toilet figlet
toilet mensaje
figlet mensaje
```

### Gato que persigue tu ratón por el terminal

```shell
sudo apt install oneko
oneko
```

### Hacer sonar por el altavoz el texto introducido por teclado

```shell
sudo apt install espeak
espeak
```

### **Mostrar el calendario**

```shell
# Año actual
cal
# Enero de 1990
cal 1 1990
```

### Tres métodos para descomprimir multiples ficheros .zip de un mismo directorio

```shell
unzip '*.zip'
unzip \*.zip
for z in *.zip; do unzip "$z"; done
```

### Cambiar el grupo principal de un usuario de forma teporal
Útil cuando añadimos a nuestro usuario a un grupo nuevo y no queremos cerrar sesión y entrar de nuevo para aplicar los cambios.

```shell
newgrp group_name
```

### Dividir la terminal en varias usando tmux
https://www.hostinger.com/tutorials/tmux-beginners-guide-and-cheat-sheet/


### Cambiar la distribución predeterminada del teclado
Muy útil cuando arrancamos desde un LiveUSB.

```shell
# Español
setxkbmap es
```

### Cambiar la ubicación de los directorios por defecto del usuario
[Manual de referencia](https://wiki.archlinux.org/title/XDG_user_directories)

### Reiniciar el equipo en caso de congelamiento severo

Pulsamos `Alt + Impr Pant`.
Sin dejar de soltarlas pulsamos las teclas `REISUB`.

[Más información](https://es.wikipedia.org/wiki/REInicia_SUBnormal)

### Añadir ruta al PATH
**Método temporal**

Expirará al cerrar el terminal actual.

```shell
export PATH=$PATH:/ruta
```

**Método permanente**

Añadimos el comando del método temporal en alguno de estos ficheros:

```shell
# Para todos los usuarios
/etc/profile
/etc/environment
# Para un usuario concreto
~/.bashrc
~/.bash_profile
~/.bash_login
~/.profile
```

### No se muestran correctamente todos los iconos de Adwaita en XFCE

Instalamos otro paquete de iconos como Papirus
```shell
sudo apt install papirus-icon-theme
```

### Visualizar idioma del sistema

```shell
cat /etc/locale.conf
```

### Cambiar idioma del sistema a español de España

```shell
sudo localectl set-locale LANG=es_ES.UTF-8
```

### Visualizar ejemplos comunes de uso de un comando

```shell
sudo apt install tldr
# Actualizar caché local
tldr -u
# Ejemplos de un comando específico
tldr rsync
```

### Herramienta para gestionar la papelera de reciclaje del usuario

```shell
sudo apt install trash-cli
# Eliminar fichero
trash file_name
# Listar elementos de la papelera
trash-list
# Recuperar fichero eliminado
trash-restore
```

### Alternativa al comando cd para navegar más rápido por el árbol de directorios

```shell
sudo apt install autojump
# Cambiar al directorio que contiene 'foo'
j foo
# Cambiar al directorio hijo que contenga 'bar'
jc bar
# Abrir el directorio con el explorador de ficheros que contenga 'music'
jo music
```

### Establecer el idioma de GIMP a castellano

```shell
sudo apt install language-pack-gnome-es
```

### Programa para grabar y reproducir vídeos de los comandos que introduces

```shell
sudo apt install asciinema
```

[Página web](https://asciinema.org/)

#### asciinema rec
Comenzar grabación y guardarla en /tmp si no se desea subir al servidor.
Ctrl+D o exit para finalizar grabación
Ctrl+\ para pausar grabación. Para escribir la barra invertida usamos AltGr.

```shell
# Comenzar grabación y guardarla en <file>
asciinema rec <file>
# Grabar a tu ritmo, reproducir rápido
asciinema rec original.cast
asciinema rec -c "asciinema play -s 5 -i 2 original.cast" -t "Proyecto final" final.cast
```

Parámetros:

| Parámetro | Descripción
|-|-|
| --append | Insertar nueva grabación en un fichero existente
| --overwrite | Reemplazar grabación
| --raw | Guardar la salida en su formato original, sin medidas de tiempo ni metadatos. Usando este parámetro no se puede subir al servidor.
| -c command | Especificar un comando para grabar, por defecto es $SHELL (/bin/bash)
| --rows | Establecer el número de filas del terminal que desee grabar
| --columns | Establecer el número de columnas del terminal que desee grabar
| -t, --title "title" | Título para la grabación
| -i seconds | Limita el tiempo de inactividad entre un fotograma y el siguiente. Útil cuando no hay cambios en la consola durante muchos segundos. Disponible a la hora de grabar y reproducir.
| -y | Subida automática
| -q | Salida silenciosa (implica subida automática)


#### asciinema play
Si pulsamos la tecla Espacio se conmutará la reproducción.
Si pulsamos el punto cuando está pausado avanzamos un fotograma.
Para salir pulsamos Ctrl+C.

```shell
 # Reproducir grabación
asciinema play [<file>|<url>]
# Duplicar velocidad de reproducción
asciinema play demo.cast -s 2
```

#### asciinema upload

Subir grabación sin cuenta. La grabación se conserva 7 días, luego es archivada y no es accesible.
```shell
asciinema upload <file>
```

#### asciinema auth
Iniciar sesión en el servidor.
Cada vez que ejecutemos asciinema se generará un UUID en `~/.config/asciinema/install-id` si no existe ya el fichero.
Este UUID será el que vinculemos con nuestra cuenta que deberemos haber creado previamente.
Las próximas grabaciones se subirán automáticamente a nuestra cuenta si hemos vinculado el UUID, si no, se subirán de forma anónima y estarán disponibles durante 7 días.

### Cifrar fichero y descifrarlo

```shell
# Cifrar
gpg -c fichero
# Descifrar (nos pedirá autenticación)
gpg fichero
```

### Añadir y eliminar a tu usuario del grupo sudo

```shell
# Añadir
sudo adduser user sudo
sudo usermod -aG sudo user
# Eliminar
sudo deluser user sudo
```

### Deshabilitar cuenta del superusuario (root)

```shell
sudo passwd -dl root
```


### Convertir imagen a texto
Para ello usaremos la tecnología OCR.

```shell
# Instalar motor OCR de línea de comandos y el paquete de idiomas en castellano
sudo apt install tesseract tesseract-langpack-spa
# Ejemplo de uso donde le indicamos como primer idioma el español y de segundo el inglés
# Tesseract es compatible con múltiples formatos de imagen
tesseract imagen.png salida -l spa+eng
```
[TextSnatcher](https://github.com/RajSolai/TextSnatcher) es una interfaz gráfica muy fácil de usar de Tesseract.

### Comparar ficheros

```shell
# El comando cmp se puede usar para verificar si dos archivos son idénticos
cmp fich1 fich2
# El comando comm permite combinar las funcionalidades de los comandos diff y cmp. Compara dos archivos ordenados líneas por línea, mostrando los resultados en tres columnas, si no se usan opciones.
comm fich1 fich2
# El comando diff, abreviatura de «difference», se usa para encontrar diferencias entre dos archivos. Compara el contenido de ambos archivos, línea a línea, y muestra las partes que no coinciden.
diff fich1 fich2
```

### Mostrar información de un comando

```shell
# Usos del comando
whatis comando
# Ubicación del ejecutable del comando
which comando
# Encontrar la ruta del comando
whereis comando
```

### Mostrar el nombre de tu usuario

```shell
whoami
who
```

### Eliminar por completo un fichero sin posibilidad de recuperación
No se puede recuperar ya que el comando sobrescribe con información aleatoria antes de eliminarlo.
**Atención:** no se recomienda usar este comando en un SSD.

```shell
shred -u fichero.txt
```

### Sistema operativo lento o se apaga solo, y al arrancar nos manda a BusyBox con el mensaje "initramfs"
Este error ocurre cuando hay un error en algún fichero del sistema, bien por alguna actualización que ha salido mal, o bien porque se ha tocado sin querer algún fichero del sistema.
Comprobamos el sistema de archivos en busca de errores, y los intentará reparar (hay que cambiar la X por la partición que requiera chequeo):

```shell
fsck -f /dev/sdaX
```

### Eliminar software preinstalado en Linux Mint para ahorrar espacio y acelerar actualizaciones
Los podremos reinstalar en cualquier momento.

```shell
sudo apt purge libreoffice-* thunderbird rhythmbox hexchat transmission-common pix hypnotix warpinator
rmdir ~/Warpinator
```

### Personalizar variable PS1
La variable PS1 se utiliza para especificar el prompt del shell. Esta se puede adaptar para que contenga información como el nombre de usuario, el nombre del servidor, la ruta actual, etc.

```shell
vim .bashrc
PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
```

En este ejemplo, usamos el formato que usa Linux Mint con el nombre del usuario y la máquina en verde, y la ruta actual en azul claro.

### Eliminar credenciales de sudo almacenadas en caché
Útil cuando necesitamos realizar una tarea simple como ejecutar un comando y luego desconectarse de los privilegios de superusuario.

```shell
sudo -K
```

### Modificar listas de acceso para un fichero (permisos extendidos)
El símbolo + en `-rw-r-xr--+` índica que ese fichero tiene permisos extendidos.

```shell
# Otorgar permisos recursivos de ejecución al usuario QEMU en nuestro directorio de Descargas
setfacl -R -m u:qemu:x ~/Descargas/
# Eliminar permisos extendidos
setfacl -b <file>
```

### Obtener listas de control de acceso a un fichero

```shell
getfacl <file>
```


### Eliminar enlace simbólico

```shell
unlink <file>
```

### QEMU/KVM
QEMU/KVM es una tecnología para GNU/Linux que permite la ejecución de máquinas virtuales muy rápidas y eficientes, ya que se integra con el propio kernel.
Comandos útiles:

#### virsh
Administración de máquinas virtuales.

Un dominio en virsh es una máquina virtual creada y administrada por la biblioteca libvirt. Esta biblioteca proporciona una capa de abstracción entre la máquina virtual y el hipervisor, permitiendo a los administradores controlar y configurar la máquina virtual con comandos sencillos.

Un pool en virsh es un grupo de recursos de almacenamiento que pueden ser compartidos entre varias máquinas virtuales. Estos recursos pueden ser discos duros, tarjetas de red y otros dispositivos que se pueden conectar a una máquina virtual. Los pools se definen mediante un archivo XML y pueden ser creados, modificados y eliminados usando una interfaz de línea de comandos (CLI) o una API para el lenguaje de programación.

```shell
# Entrar en consola interactiva
virsh
# Mostrar información del nodo
virsh hostname

# Mostrar información básica del dispositivo
virsh nodeinfo

# Mostrar uso del procesador
virsh nodecpustats --percent

# Mostrar uso de memoria
virsh nodememstats

# Listar máquinas virtuales creadas
virsh list --all
# Apagar
virsh shutdown <domain>
# Forzar apagado
virsh destroy <domain>
# Reiniciar
virsh restart <domain>
# Forzar reinicio
firsh reset <domain>
# Iniciar
virsh start <domain>
# Conectarse a la consola
virsh console <domain>
# Iniciar cuando se arranque el anfitrión
virsh autostart <domain>
# Desactivar inicio automático
virsh autostart <domain> --disable
# Pausar
virsh suspend <domain>
# Reanudar
virsh resume <domain>
# Crear instantánea (snapshot)
virsh snapshot-create-as --domain <domain> --name "snapshot-name" --description "description"
# Listar snapshots
virsh snapshot-list <domain>
# Mostrar información detallada de un snapshot
virsh snapshot-info <domain> <snapshot_name>
# Restaurar dominio al snapshot indicado (el estado actual se perderá)
virsh snapshot-revert <domain> <snapshot_name>
# Eliminar snapshot
virsh snapshot-delete <domain> <snapshot_name>
# Renombrar
virsh domrename <currentName> <newName>
# Cambiar configuración
virsh edit <domain>
# Guardar estado en un fichero
virsh save <domain> <file>
# Restaurar estado de un dominio desde un fichero
virsh restore <file>
# Establecer nº de núcleos para el dominio
virsh setvcpus <domain> --maximum <core_numbers> --config
virsh setvcpus <domain> --count <core_numbers> --config
# Establecer uso de RAM
sudo virsh setmaxmem test 2G --config
sudo virsh setmem test 2G --config
# Refrescar pool del almacenamiento
virsh pool-refresh default
# Eliminar dominio y sus volúmenes asociados
virsh destroy <domain>
virsh undefine <domain>
virsh pool-refresh default
virsh vol-delete --pool default <domain>.qcow2
# Insertar disco virtual a un dominio
virsh attach-disk --domain test \
  --source /var/lib/libvirt/images/test_vol2.qcow2 \
  --persistent --target vdb \
  --subdriver qcow2 \
  --driver qemu \
  --type disk
# Retirar disco virtual de un dominio
virsh detach-disk --domain test --persistent --live --target vdb

# Crear volumen
virsh vol-create-as <pool> <name> <capacity>
# Listar volumenes de un grupo
virsh vol-list <pool>

# Listar todas las redes
virsh net-list
# Iniciar una red
virsh net-start <network>
# Apagar una red
virsh net-shutdown <network>
# Mostrar información de una red
virsh net-info <network_name>
# Editar configuración de una red
virsh net-edit <network_name>

# Mostrar información de un dominio
virsh dominfo <domain>
# Listar todos los dispositivos de bloque asociados a un dominio
virsh domblklist <domain>
# Mostrar información sobre un dispositivo de bloque
virsh domblkinfo <domain> <device>
virsh domblkinfo debian11 vda --human
# Mostrar estadísticas sobre un dispositivo de bloque (el dominio debe estar ejecutándose)
virsh domblkstat <domain> <device>
# Mostrar errores de un dispositivo de bloque (el dominio debe estar ejecutándose)
virsh domblkerror <domain>
```

Para los siguientes comandos es necesario instalar `libguestfs-tools`:

```shell
# Listar ficheros
virt-ls -l -d <domain> <file>
# Mostrar el contenido de ficheros
virt-cat -d <domain><file_path>
# Editar ficheros
virt-edit -d <domain> <file>
# Mostrar espacio en disco
virt-df -d <domain>
# Listar sistema de ficheros
virt-filesystems --all --long --uuid -h -d <domain>
# Monitorear el uso de recursos
virt-top
# Mostrar logs
virt-log -d <domain> | less
```

#### virt-clone
Clonar dominio.

```shell
# Clonar dominio (debe estar parado)
virt-clone --original test --name test_clone --file /var/lib/libvirt/images/test_clone.qcow2 
```

#### virt-install
Crear una nueva máquina virtual.

```shell
# Listar todas las variantes de sistemas operativos que se pueden usar
virt-install --os-variant list
# Ejemplo de creación de VM de Fedora 37
virt-install \
    # Nombre
    --name fedora37 \
    # RAM
    --memory 2048 \
    # CPU
    --vcpus 2 \
    # Crear disco duro virtual de 30 GB
    --disk size=30 \
    # Especificar el sistema operativo
    --os-variant fedora37 \
    # Ubicación de la imagen
    --cdrom /ruta/fichero.iso \
    # Red a la que se conectará
    --network default \
    # Visualizar usando el protocolo spice con protección por contraseña
    --graphics spice,password=secret \

    # Instalación desatendida (automática)
    --install fedora37 --unattended 
    # Ruta de la contraseña para el administrador
    admin-password-file=/path/to/password
    # Usuario principal
    user-login=<user>
    # Contraseña del usuario principal
    user-password-file=/path/to/password \
    # Establecer hipervisor al que conectarse
    --connect qemu:///system \
    # Ubicación de la imagen
    --location [<url>|<iso>] \
    # Arquitectura del huesped
    --arch armv71 \
    # Establecer el orden de arranque
    --boot cdrom,hd \
    # Forzar apagado cuando se cierre la ventana
    --destroy-on-exit
    # Solicitar un dispositivo TPM emulado
    --tpm emulator \
    # Redirigir dispositivo USB mediante un canal de spice
    --redirdev usb,type=spicevmc
    # Redirigir tarjetas inteligentes
    --smartcard passthrough,type=spicevmc
    # Mountar un directorio del anfitrión en el invitado
    --filesystem /source/on/host,/target/point/in/guest \
    # Impedir que se cierre virt-viewer cuando se reinicie
    --wait \
    # Evitar que se abra una consola
    --noautoconsole \
    # Probar configuración
    --dry-run
```
De no especificar alguna opción durante la creación de la VM, coge el valor por defecto.


#### qemu-img
Manipular imágenes de disco. Las máquinas virtuales asociadas al disco deben estar apagadas.

```shell
# Expandir un disco virtual a 50 GB
qemu-img resize /path/to/kvm-harddisk-file.qcow2 +50G
# Convertir una imagen RAW en QCOW2
qemu-img convert -f raw -O qcow2 imagen.img nombre_nuevo.qcow2 -p
```

#### Problemas frecuentes

##### Error de permisos durante la creación de una VM
Tras seleccionar una ISO dentro de **virt-manager** durante la creación de una máquina virtual, aparece un error similar al siguiente: "El emulador podría no tener permisos de búsqueda para la ruta. ¿Desea corregir esto ahora?".
La opción "Sí" funciona a la perfección, pero aprenderemos a solucionarlo por nuestra cuenta creando una ACL para el usuario correspondiente que necesita acceso a nuestro directorio.
Para ello, deberemos ejecutar el siguiente comando en cada directorio a partir del $HOME hasta llegar a la ubicación donde se almacena la ISO, en este caso en Descargas:

```shell
setfacl -m u:<user>:x $HOME
setfacl -m u:<user>:x $HOME/Descargas
```

Nota: según la distribución que estés usando, el usuario a modificar puede ser `libvirt-qemu` o `qemu`. Comprueba en el fichero **/etc/passwd** cual de estos dos usuarios existen.

### SELinux
Security-Enhanced Linux (SELinux) es una arquitectura de seguridad para los sistemas GNU/Linux que otorga a los administradores mayor control sobre quién puede tener acceso a los recursos del sistema, así como qué acciones pueden realizar. Esto se logra mediante el uso de políticas de acceso que definen quién puede acceder a qué recursos y qué acciones pueden realizar. Estas políticas pueden ser muy precisas, permitiendo que los administradores controle con precisión quién puede hacer qué en el sistema.

#### Cambiar y visualizar contexto de seguridad para un fichero
En este ejemplo, cambiamos el contexto de seguridad para autorizar el acceso a los contenedores (virtualización) al fichero especificado recursivamente.

```shell
# Activar
chcon -R -t container_file_t /ruta
# Desactivar contexto de seguridad previamente modificado
# user_home_t significa acceso exclusivo para el usuario al que le pertenece
chcon -R -t user_home_t /ruta
# Comprobar el contexto de seguridad de un fichero
ls -Z
```

### Cambiar atributos de un fichero
"+" para agregar, "-" para eliminar y "=" para establecer un único atributo.
No todos los atributos son compatibles o utilizados por todos los sistemas de archivos

|Atributo|Descripción
|-|-|
| **a** | anexar solo
| **A** | sin actualizaciones temporales de acceso. Ahorra numerosas I/O del disco
| c | comprimido
| C | sin copia al escribir
| d | sin volcado
| D | actualizaciones de directorio sincrónicas
| e | formato de extensión
| E | cifrado
| F | las búsquedas de directorio no distingue entre mayúsculas y minúsculas
| **i** | inmutable. No se puede renombrar, eliminar o crear un enlace
| I | indexado usando árboles de hash
| j | toda la información se actualiza en el diario ext3 antes que el archivo en sí
| P | jerarquía del proyecto
| m | Excluir de compresión
| S | los cambios se actualizarán sincrónicamente en el disco
| t | sin fusión de cola
| T | parte superior de la jerarquía de directorios

```shell
# Bloquear recursivamente el borrado y modificación
chattr -R +i ~/Documentos
```

### Listar atributos de un fichero
Para verificar qué atributos se han establecido, use el comando `lsattr`.

```shell
# Mostrar recursivamente todos los ficheros ocultos
lsattr -Ra /path
```

### Parámetros Firefox
Podemos enviar tantas URL como queramos.

| Parámetro | Descripción
|-|-|
| --kiosk | Abrir una URL sin que esté presente ninguna de las interfaces de usuario de Firefox. Es como un modo de pantalla completa permanente
| --search "gnu" | Realizar una búsqueda con el motor de búsqueda establecido
| --setDefaultBrowser | Establecer firefox como navegar predeterminado del sistema
| --new-window URL | Abrir URL nueva ventana
| --new-tab URL | Abrir URL en nueva pestaña
| --private-window URL | Abrir URL en nueva ventana privada
| --safe-mode | Abrir en modo seguro. Se deshabilitan las extensiones y temas
| --ProfileManager | Usar el Administrador de perfiles de Firefox para crear, eliminar o cambiar el nombre de los perfiles.
| -P "john" | Iniciar Firefox bajo un perfil específico
| --preferences | Abrir las preferencias

### El fichero /var/log/syslog
Es uno de los ficheros más importantes de registro en el sistema. Está diseñado para almacenar los mensajes de errores y advertencias generados por los procesos del sistema. Estos mensajes pueden ser enviados por el kernel, los procesos de sistema o aplicaciones de usuario, y contienen información sobre cualquier cosa que pueda estar fallando en el sistema, como problemas de hardware, errores de software o problemas de red. Es una herramienta valiosa para los administradores de sistemas para diagnosticar problemas.
Para visualizarlo en tiempo real usamos el comando `tail -f /var/log/syslog`.

## Productividad

### Herramientas gráficas para copias de seguridad

**Deja-dup**: programa muy fácil de usar que divide la copia en muchos ficheros usando el formato .diffpart. Permite el cifrado del resguardo (con GNUPG) y restaurar copias previas. Puede realizar copias remotas o en la nube, programar copias periódicas y realizar copias incrementales.

**Back In Time**: front-end de rsync. Permite tomar o restaurar backups, excluir ficheros o por patrones. Programar copias. Copias locales o remotas.

**Grsync** (recomendada): es un front-end de rsync. Muestra la explicación de cada opción al situar encima el ratón. Al iguar que rsync, permite simular que pasaría antes de hacer nada. Muy recomendado.

### Atajos de teclado del sistema operativo

* **Super:** Mostrar menú
* **Super + n.º:** Abrir aplicaciones ancladas al panel o ejecutándose
* **Super + Mayus + n.º:** Abrir una nueva ventana de las aplicaciones del panel
* **Super + D / Ctrl + Alt + D:** Mostrar el Escritorio
* **Super + E:** Abrir el Explorador de ficheros
* **Super + S:** Mostrar miniaplicaciones del Escritorio
* **Alt + F2:** Ejecutar aplicaciones o abrir directorios
* **Alt + F4:** Cerrar ventana
* **Alt + F5:** Desmaximizar ventana
* **Alt + F7:** Mover ventana
* **Alt + F8:** Cambiar tamaño ventana
* **Alt + F9:** Minimizar ventana
* **Alt + F10:** Maximizar/desmaximizar ventana
* **Alt + Tab:** Navegar entre aplicaciones abiertas
* **Impr Pant:** Tomar captura completa de pantalla
* **Mayus + Impr Pant:** Tomar captura de una zona concreta
* **Alt + Impr Pant:** Tomar captura de la ventana actual
* **Ctrl + Alt + ← o →:** Cambiar entre áreas de trabajo
* **Ctrl + Mayus + Alt + ← o →:** Mover la ventana actual a otro área de trabajo

### Atajos de teclado del terminal

* **Ctrl + A:** Mover el cursor al principio
* **Ctrl + B:** Mover cursor hacia atrás (igual que flecha izquierda)
* **Ctrl + C:** Aborta la ejecución del proceso actual
* **Ctrl + Mayus + C:** Copiar lo seleccionado
* **Ctrl + D:** Salir
* **Ctrl + D:** Borrar el carácter dentro del cursor (igual que suprimir)
* **Ctrl + E:** Mover el cursor al final
* **Ctrl + F:** Mover un carácter hacia delante (igual que flecha derecha)
* **Ctrl + G:** Salir de la búsqueda de comandos inversa
* **Ctrl + H:** Borrar carácter anterior (igual que Retroceso)
* **Ctrl + I:** Mostrar comandos disponibles (igual que Tab)
* **Ctrl + K:** Borrar todo el texto situado después del cursor
* **Ctrl + L:** Limpiar consola
* **Ctrl + N:** Siguiente comando en el historial (igual que flecha abajo)
* **Ctrl + Mayus + N:** Abrir nueva ventana
* **Ctrl + O:** Ejecutar comando (igual que Intro)
* **Ctrl + P:** Ver comandos anteriores (igual que flecha arriba)
* **Crl + Q:** Reanudar proceso en pausa
* **Ctrl + Mayus + Q:** Cerrar ventana
* **Ctrl + R:** Buscar ocurrencias de comandos anteriores
* **Ctrl + S:** Pausar/congelar proceso
* **Ctrl + Mayus + T:** Abrir nueva ventana
* **Ctrl + U:** Cortar todo lo anterior
* **Ctrl + Mayus + V:** Pegar lo seleccionado
* **Ctrl + W:** Borrar todo el texto situado antes del cursor
* **Ctrl + Mayus + W:** Cerrar pestaña
* **Ctrl + Z:** Poner proceso en segundo plano
* **Ctrl + ←:** Mover el cursor una palabra a la derecha
* **Ctrl + →:** Mover el cursor una palabra a la izquierda
* **Ctrl + Re Pág:** Cambiar a la pestaña izquierda
* **Ctrl + Av Pág:** Cambiar a la pestaña derecha
* **Ctrl + +:** Aumentar tamaño de la fuente
* **Ctrl + -:** Reducir tamaño de la fuente
* **Ctrl + 0:** Cambiar al tamaño de fuente predeterminado
* **Alt + B:** Retroceder un bloque
* **Alt + F:** Avanzar un bloque
* **Alt + Número:** Cambiar al terminal número X
* **Alt + .:** Cambiar al último parámetro introducido en el comando anterior
* **Flecha arriba:** Comando anterior
* **Flecha abajo:** Comando siguiente
* **Tab:** Autocompletar búsqueda

### Alias básicos
Un alias es un nombre (generalmente corto) que el shell traduce a otro nombre o comando (generalmente más largo).

```shell
# Actualiza los repositorios e instala las actualizaciones de todos los paquetes
alias actualizar="sudo apt update && sudo apt upgrade"

# Eliminar paquetes huérfanos
alias limpiar="sudo apt autoremove"

# Instalar un paquete
alias instalar="sudo apt install"

# Confirmar eliminación
alias rm="rm -i"

# Listado detallado
alias ls="ls -l"

# Apagar el equipo
alias apagar="systemctl poweroff"

# Reiniciar el equipo
alias reiniciar="systemctl reboot"
```

### Alias avanzados

Copias de seguridad

```shell
alias backup="insertar el comando para copias de seguridad"
```

### Navegar entre directorios usando el navegador navegador web
Accedemos a file:///

## Tareas a realizar después de instalar GNU/Linux

### Activar cortafuegos
Activamos el firewall para protegernos de los ataques informáticos y el malware.

```shell
sudo apt install gufw
```

Perfil `Casa`:

- Entrante: Denegar
- Saliente: Permitir

### Selección personal de software libre de calidad
| Software | Descripción |
|-|-|
| Hardinfo | Muestra muchas estadísticas de tu equipo y componentes
| Gparted | Administra dispositivos y particiones
| Firefox | Navega por la web
| Thunderbird | Gestor de correo electrónico
| LibreOffice | Procesador de textos
| GIMP | Manipular imágenes. **Extra:** instalar el plug-in "resynthesizer" para eliminar objetos y defectos
| gnome-system-monitor o lxtask | Gestor de tareas
| qBitTorrent | Descargar ficheros torrent
| RedShift | Activa un filtro para visualizar la pantalla de noche a gusto
| Rhythmbox | Orquestador de música por grupos
| SimpleScreenRecorder  | Graba tu pantalla
| HandBrake | Conversor de formatos de vídeo
| SoundConverter | Conversor simple de audio
| KeepassXC | Gestor de contraseñas local
| Synaptic | Interfaz gráfica para la gestión de paquetes
| xfce4-notes | Apuntar cosas
| VLC | Reproductor de vídeo y audio
| Evince | Visor PDF ligero
| Nextcloud | Cliente de almacenamiento en la nube
| Telegram | Aplicación de mensajería con muchas funcionalidades
| Lingot | Afinador de instrumentos
| Psensor | Sensores de temperatura del hardware
| Catfish | Buscar en el sistema de archvivos
| MenuLibre | Añadir o eliminar aplicaciones del menú
| vrms | Comprobar si tenemos instalado software privativo en nuestro sistema
| neofetch | Información del sistema en el terminal
| mlocate | Utilidad para buscar ficheros y directorios
| OpenShot | Editor de vídeo simple y poderoso
| KDiskMark | Herramienta de benchmarking de HDD y SDD
| virt-manager | Gestor de máquinas virtuales ultrarápidas gracias a la tecnología KVM/QEMU. [Instalación](https://www.christitus.com/vm-setup-in-linux)
| Tor Browser | Navegación privada usando la red Tor. [Instalación](https://www.howtogeek.com/423866/how-to-install-and-use-the-tor-browser-on-linux/)
| FreeTube | YouTube sin anuncios. [Instalación](https://freetubeapp.io/)
| Signal | Mensajería instantánea privada. [Instalación](https://signal.org/)
| Element | Cliente oficial de Matrix. [Instalación](https://element.io/)
| Librewolf | Navegador web derivado de Firefox. [Instalación](https://librewolf.net/)
| Codium | Visual Studio Code libre. [Instalación](https://github.com/VSCodium/vscodium)
| Eclipse | IDE de Java. [Instalación](https://www.eclipse.org/downloads/)
| PyCharm | IDE de Python. [Instalación](https://www.jetbrains.com/pycharm/)

**Recomendación:** no instales un lector de PDF si tu distribución ya trae uno por defecto (aplicable para otras categorías). Si aún así deseas instalarlo, borra el otro para ahorrar espacio.

### Activar soporte para flatpaks e instalación de software

Flatpak es una tecnología para crear, distribuir, instalar y ejecutar aplicaciones las cuales se actualizan a su última versión con rápidez. Además se ejecutan bajo un sistema aislado lo cual permite modificar los permisos de la misma y mantenerla separada del resto de aplicaciones. Es la mejor opción para aquellos usuarios que desean tener la última versión de un software pero su distribución solo cuenta con una demasiado antigua. Para instalarlo ponemos el comando:

```shell
sudo apt install flatpak
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
# Reiniciamos la máquina
reboot
```

Ejemplo de instalación de un programa usando Flatpak:

```shell
# FlatSeal es un programa para administrar los permisos usados por aplicaciones Flatpak
flatpak install flatseal
```

### Creación de atajos de teclado

* **Abrir el terminal (Ctrl + Alt + T):** xfce4-terminal
* **Reducir volumen (Alt + Z):** pactl set-sink-volume alsa\_output.pci-0000\_00\_1b.0.analog-stereo -10%
* **Aumentar volumen (Alt + X):** pactl set-sink-volume alsa\_output.pci-0000\_00\_1b.0.analog-stereo +10%
* **Activar/Desactivar volumen (Alt + <):** pactl set-sink-mute alsa\_output.pci-0000\_00\_1b.0.analog-stereo toggle
* **Abrir el monitor del sistema (Ctrl + Alt + M):** gnome-system-monitor
* **Imprimir pantalla (Imp Pant):** xfce4-screenshooter -f
* **Imprimir pantalla: Seleccionar rectángulo (Mayus + Imp Pant):** xfce4-screenshooter -r
* **Imprimir ventana actual (Alt + Imp Pant):** xfce4-screenshooter -w
* **Apagar, reiniciar, cerrar sesión (Ctrl + Alt + Supr):** xfce4-session-logout
* **Bloquear pantalla (Ctrl + Alt + L):** xflock4
* **Abrir el explorador de ficheros (Super + E):** exo-open --launch FileManager
* **Navegador prederminado (Ctrl + Alt + I):** exo-open --launch WebBrowser
* **Forzar cierre ventana (Ctrl + Alt + Esc):** xkill
* **Diálogo de ejecución (Alt + Space):** xfrun4
* **Menú de operaciones de ventanas (Mayus + Menú contextual)**
* **Desplegar menú de aplicaciones (Super R):** xfce4-popup-whiskermenu

### Copiar ficheros del dispositivo de respaldo hacia el nuevo equipo
Para tenerlos a mano cuando nos hagan falta.

### Limitar permisos de los ficheros copiados en el paso anterior
A veces los dispositivos de almacenamiento externo les otorgan a los ficheros y directorios todos los permisos (777), algo que normalmente no queremos que haga. Para evitarlo podemos cambiar estos permisos recursivamente por cada directorio una vez ya están en el equipo con el que vamos a trabajar.

```shell
find $HOME/Documentos/ $HOME/Imágenes/ $HOME/Música/ $HOME/Plantillas/ -type d -exec chmod 755 {} \\; && find $HOME/Documentos/ $HOME/Imágenes/ $HOME/Música/ $HOME/Plantillas/ -type f -exec chmod 644 {} \\;
```

### Otros ajustes

* Energía: controlar cuando se apagará la pantalla.
* Establecer las aplicaciones favoritas.
* Autoarranque de aplicaciones: desactivar las aplicaciones o servicios que no queremos que se ejecuten al arrancar (aumentando el rendimiento).
* Apariencia: activar modo oscuro.
* Establecer una imagen de perfil.
* Idiomas del sistema: eliminar otros idiomas indeseados.
* Controladores adicionales: elegir los drivers que mejor se adecúen al sistema.
* Paneles: modificar la apariencia y los elementos de los paneles.
* Gestor de ventas → Opciones avanzadas → Activar ocultar el contenido de la ventana al mover y redimensionar.
* Ajustes del gestor de ventanas → Accesibilidad → Desactivar usar la rueda del ratón en la barra de título de la ventana para enrollarla.
* Cambiar las fuentes de software hacia otros servidores más veloces para mayor velocidad de descarga (se puede hacer durante la instalación). Principal: <https://mirror.cyberbits.eu/> (FR) Base: <http://mirror.tedra.es/> (ES).
* Poner tus programas a punto (iniciar sesión, configurarlos, crear lanzadores, etc.).

### Antes de instalar nuevo sistema operativo...
Lista de acciones a tener en cuenta antes de formatear tu sistema para instalar otra distribución GNU/Linux:

- Navegador web
    - Exportar marcadores
    - Cerrar sesión de todos los sitios importantes
    - Exportar configuración de las extensiones
    - Cerrar sesión en Firefox Accounts
    - Borrar todos los datos (cookies, historial, etc.)
- Sistema de ficheros
    - Comprobar y limpiar descargas, programas y vídeos
- Software
    - Cerrar sesión de todos los programas importantes

**Importante:** Asegurarse antes de formatear que no perderemos ningún fichero y que no olvidaremos ninguna contraseña guardada en el navegador u otro lugar que desaparecerá. Realizar una copia de seguridad antes del procedimiento de borrado. Una vez hecha esa copia mirar cada directorio (de la copia) comprobando que está todo lo necesario para continuar con el proceso sin luego lamentaciones ni enfados.

### ¿Qué no debo copiar en mis copias de seguridad?

- Descargas/ (pesan muchos gigas, sobre todo las películas)
- Escritorio/ (pues solo hay accesos directos a aplicaciones)
- Música/ (usar servicios de streaming o copiar solo una vez en un HDD externo)
- Ficheros pesados que ya estén respaldados
- Programas (se pueden bajar otra vez)
- Vídeos (prescindible)
- Documentos/Copias de seguridad (sería como copiarse a sí mismo)

**Nota:** Si usas Linux Mint, el programa "Herramienta de copia de seguridad" te ahorrará mucho tiempo.

### Elementos que no se te deben olvidar exportar de vez en cuando

- Marcadores del navegador web
- Exclusiones de Privacy Badger
- Dominios bloqueados/permitidos de NoScript
- Reglas de uBlock Origin
- Recetas de GNOME


### Enlaces útiles relacionados con GNU/Linux

- Visualizar la última versión de los paquetes que usan las distribuciones: https://repology.org/
- Revisar las distribuciones más usadas: https://distrowatch.com/
- Nano cheatsheet https://www.nano-editor.org/dist/latest/cheatsheet.html
- Vim cheatsheet https://vim.rtorr.com/

#### Extra
Crear directorio "Copias de seguridad" dentro de Documentos.
