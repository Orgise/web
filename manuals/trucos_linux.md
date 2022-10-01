# Trucos GNU/Linux

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
2. Descomenta la línea que dice `GRUB_INIT_TUNE=""`
3. Entre las comillas inserta tu nueva melodía
4. Comando `sudo update-grub2`.
5. Reinicia la computadora para escuchar tu temazo a todo volumen

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
3. Mover la carpeta extraída a `/home/tu_usuario/.icons` o `/home/tu_usuario/.themes`.
4. Ir a las opciones de apariencia y marcar el estilo deseado.

**Nota:** la instalación de un tema para todos los usuarios del sistema se hace moviendo la carpeta descomprimida a /usr/share/icons o /usr/share/themes.

**Extra:** también puedes aplicar el tema o los iconos para tu gestor de inicio de sesión como lightdm. Un tema que a mi me gusta es Arc que se puede instalar escribiendo el comando:

```shell
sudo apt install arc-theme
```

### Mostrar información de un paquete

```shell
sudo apt-cache show nombre_paquete
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

### Herramienta para buscar archivos

```shell
sudo apt install catfish
```

### Personalizar LightDM (gestor de inicio de sesión)

Editamos el archivo `/etc/lightdm/lightdm-gtk-greeter.conf`:

```
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

**Nota:** para dejar un valor por defecto se comenta. Para añadir una foto de tu usuario la debemos ubicar en `/home/usuario/.face`

Editamos el archivo `/etc/lightdm/lightdm.conf`:

```
[Seat:\*]
# Mostrar el nombre de todos los usuarios
greeter-hide-users=false
```

### Añadir tu usuario al grupo sudo para tener permisos de administrador
```shell
sudo usermod -aG sudo nombre_usuario
```

### Restaurar controlador de vídeo abierto (error driver NVIDIA pantalla negra)

Este error se origina cuando en Linux Mint aplicamos desde `Ajustes → Gestor de controladores` los gráficos privativos que nos ofrece Nvidia para nuestra tarjeta gráfica y la pantalla se nos queda en negro tras reiniciar.

```shell
sudo su
apt purge*\*nvidia\**; apt autoremove; reboot
```

### Copias de seguridad con rsync (muy recomendado)

Rsync (Remote Sync) es una herramienta de sincronización para copiar archivos y directorios en un sistema o entre sistemas. La mayor ventaja de rsync es que sólo copia los archivos modificados y, por lo tanto, reduce el consumo de CPU y ahorra el ancho de banda y el tiempo durante la copia de archivos.

**Ejemplo 1:** Copiar los ficheros (solo si se encuentran cambios) del directorio A en el directorio Backup-A. 
```shell
rsync A/ Backup-A/
```

El ejemplo anterior copia los archivos del origen al destino. Pero si el sistema tenía algunos archivos extra que no estaban en el origen, esos no serán eliminados por la sincronización de una vía. Si quieres eso, tendrás que usar la **sincronización bidireccional**.

Para mantener ambos puntos finales (directorios o archivos) en el mismo estado, con los mismos archivos y sin extras en ninguno de los dos lados, basta con añadir la opción `--delete` al comando original.

```shell
rsync --delete A/ Backup-A/
```

**Ejemplo 2:** Copia de seguridad local de nuestra carpeta personal omitiendo ficheros y directorios ocultos usando un dispositivo externo como destino.

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
> Un **fichero FIFO** es un tipo especial de archivo en el almacenamiento local que permite que dos o más procesos se comuniquen entre sí leyendo/escribiendo en/desde este archivo.
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

### Comando tar

El comando tar permite empaquetar y comprimir un archivo o serie de archivos, incluso hasta el sistema de archivos completo. Compatible con copias incrementales.

**Ejemplo:** copia total de nuestro directorio personal excluyendo los ficheros y directorios ocultos, además de usar un fichero con más exclusiones.

```shell
tar -X exclusiones-backup.txt --exclude="$HOME/.*" -czvf destino.tar.gz /home_tu_usuario
```

**Parámetros:**

- **-X exclusiones:** una lista de ficheros o directorios que deseo omitir
- **-exclude="$HOME/.\*":** ignorar los archivos ocultos situados en esa ruta (los ficheros ocultos de los directorios hijos sí se copiarán)
- **-czvf origen destino:** c de comprimir, z de formato gzip (gz), v de mostrar detalles, y f para darle un nombre al comprimido

### Solucionar el problema Redshift (Trying location provider \`geoclue2\`…)

Lo que haremos será crear y editar el archivo de configuración de redshift.

```shell
mkdir ~/.config/redshift && nano ~/.config/redshift/redshift.conf
```

Y pegaremos lo siguiente:
```
[redshift]

location-provider=manual

[manual]

; Madrid, Spain

lat=31.10

lon=-5.61
```

Deberás cambiar la latitud y longitud a la adecuada para ti. Reabrimos Redshift y ya estará arreglado.

### Ejecutar lanzadores al iniciar sesión

Crear los lanzadores y moverlos al directorio `/home/tu_usuario/.config/autostart/`

### Instalar SmartPSS en GNU/Linux con Wine

[Descargar el programa](https://dahuawiki.com/SmartPSS)

Añadir soporte para 32 bits:

```shell
sudo dpkg --add-architecture i386
```

Instalar Wine y otras dependencias:

```shell
sudo apt update && sudo apt install wine wine32 wine64 libwine libwine:i386 fonts-wine
```

Instalamos el programa:

```shell
wine DH\_SMARTPSS-Win64\_En\_IS\_V2.003.0000004.0.R.201021.exe
```

Nota: dejamos marcada la casilla “Generate shorcuts” para que cree un lanzador automáticamente en el escritorio.

### Como usar el DNI electrónico (DNIe) en GNU/Linux

1. Introducimos el lector pero no el DNI. Ponemos el comando lsusb para ver que lo detecte.
2. Instalamos los paquetes necesarios para trabajar con el DNIe: sudo apt install opensc-pkcs11 pcsc-tools pcscd pinentry-gtk2 libccid.
3. Escribimos pcsc\_scan y metemos el DNI. Se actualizará la pantalla y al final pondrá DNI Electrónico español (si tu tarjeta es compatible). Si no saliera, instalar los drivers de la página web dnielectronico.es correspondientes.
4. Abrimos Firefox. Preferencias -> Privacidad y Seguridad -> Dispositivos de seguridad -> Cargar -> Nombre: DNIe (o el que sea). Archivo: /usr/lib/x86\_64-linux-gnu/opensc-pkcs11.so
5. Comprobamos buscando "dnielectronico verificar que funciona" en el buscador y pinchamos en el último enlace de los prestadores de servicio de validación. El que dice "FNMT". Nos pedirá la contraseña de nuestro DNIe.

Probado en Debian 11 usando Firefox 94

### Como activar el autocompletado del terminal

sudo apt install bash-completion

### Desactivar IPv6

Abrimos el fichero de configuración `/etc/sysctl.conf`:

Dentro del fichero, insertamos al final:

```shell
net.ipv6.conf.all.disable\_ipv6 = 1
net.ipv6.conf.default.disable\_ipv6 = 1
```

Reiniciamos la máquina y comprobamos que está desactivado:

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
```

### Ocultar GRUB al inicio

Editamos el fichero de configuración `/etc/default/grub`:

Asignamos el valor `0` a la variable `GRUB_TIMEOUT`.

```shell
# Recargamos la configuración de grub
sudo update-grub
```

### Recuperar archivos con Photorec

```shell
sudo apt install testdisk
sudo photorec
```

1. Seleccionamos la unidad, luego la partición.
2. En `file opt` elegimos los formatos a recuperar.
3. Pulsamos `search` y elegimos el sistema de archivos de la partición.
4. Elegimos la opción `Whole` para que lo escanee todo.
5. Elegimos un directorio donde guardar los archivos recuperados (hay que entrar en él y luego pulsar `c`).

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

### Exportar todos los Writer a PDF

```shell
lowriter --headless --convert-to pdf \*.odt
```

**Nota:** habrá tantos *.pdf* como *.odt* haya en el directorio actual.

### Convertir múltiples PDF en uno solo

```shell
pdftk mypdf1.pdf mypdf2 cat output salida.pdf
```

### Visualizar los detalles de nuestra RAM
```shell
sudo dmidecode --type memory
```

### Descargar paquete y sus dependencias
```shell
sudo apt install --download-only pkg_name
```
**Nota:** los empaquetados se guardarán en `/var/cache/apt/archives/`.

### Instalar paquetes .deb
```shell
sudo dpkg -i programa.deb
```

### Instalar entorno de desarrollo (LAMP) en Debian
[Tutorial completo](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mariadb-php-lamp-stack-on-debian-10)

### Crear 10 ficheros rápidamente
```shell
touch test{1..10}.txt
```

### Visualizar el tamaño del directorio actual
```shell
du -sh .
```

### Ver los 20 comandos más usados
```shell
history | awk 'BEGIN {FS="[ \t]+|\\|"} {print $3}' | sort | uniq -c | sort -rn | head -n 20
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

### Imprimir con efecto arcoíris la salida de los comandos
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
```bash
unzip '*.zip'
unzip \*.zip
for z in *.zip; do unzip "$z"; done
```

## Productividad

### Herramientas gráficas para copias de seguridad

**Deja-dup**: programa muy fácil de usar que divide la copia en muchos ficheros usando el formato .diffpart. Permite el cifrado del resguardo (con GNUPG) y restaurar copias previas. Puede realizar copias remotas o en la nube, programar copias periódicas y realizar copias incrementales.

**Back In Time**: front-end de rsync. Permite tomar o restaurar backups, excluir archivos o por patrones. Programar copias. Copias locales o remotas.

**Grsync** (recomendada): es un front-end de rsync. Muestra la explicación de cada opción al situar encima el ratón. Al iguar que rsync, permite simular que pasaría antes de hacer nada. Muy recomendado.

### Atajos de teclado del sistema operativo

* **Super:** Mostrar menú
* **Super + n.º:** Abrir aplicaciones ancladas al panel o ejecutándose
* **Super + Mayus + n.º:** Abrir una nueva ventana de las aplicaciones del panel
* **Super + D / Ctrl + Alt + D:** Mostrar el Escritorio
* **Super + E:** Abrir el Explorador de archivos
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
* **Ctrl + K:** Borrar todo lo siguiente
* **Ctrl + L:** Limpiar consola
* **Ctrl + N:** Siguiente comando en el historial (igual que flecha abajo)
* **Ctrl + Mayus + N:** Abrir nueva ventana
* **Ctrl + O:** Ejecutar comando
* **Ctrl + P:** Ver comandos anteriores (igual que flecha arriba)
* **Crl + Q:** Reanudar proceso en pausa
* **Ctrl + Mayus + Q:** Cerrar ventana
* **Ctrl + R:** Buscar ocurrencias de comandos anteriores
* **Ctrl + S:** Pausar/congelar proceso
* **Ctrl + Mayus + T:** Abrir nueva ventana
* **Ctrl + U:** Cortar todo lo anterior
* **Ctrl + Mayus + V:** Pegar lo seleccionado
* **Ctrl + W:** Cortar la última palabra
* **Ctrl + Mayus + W:** Cerrar pestaña
* **Ctrl + Z:** Poner proceso en segundo plano
* **Ctrl + ←:** Mover el cursor una palabra a la derecha
* **Ctrl + →:** Mover el cursor una palabra a la izquierda
* **Ctrl + Re Pág:** Cambiar a la pestaña izquierda
* **Ctrl + Av Pág:** Cambiar a la pestaña derecha
* **Ctrl ++:** Aumentar tamaño de la fuente
* **Ctrl +-:** Reducir tamaño de la fuente
* **Ctrl + 0:** Tamaño de fuente predeterminado
* **Alt + B:** Retroceder un bloque
* **Alt + F:** Avanzar un bloque
* **Flecha arriba:** Comando anterior
* **Flecha abajo:** Comando siguiente
* **Tab:** Autocompletar búsqueda

### Alias básicos

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

**Parámetros:**

- **-X:** fichero de exclusión de directorios. Pondremos los directorios que no deseemos guardar en la copia.
- **-c, --create:** crear un nuevo fichero
- **-z, --gzip:** compresión gzip
- **-v, --verbose:** verbosidad
- **-f, --file:** indica que se dará un nombre al archivo tar.

## Tareas a realizar antes de instalar GNU/Linux

### Activar cortafuegos
Activamos el firewall para protegernos de los ataques informáticos y el malware.

```shell
sudo apt install gufw
gufw &
```

Perfil `Casa`:
- Entrante: Denegar
- Saliente: Permitir

### Instalamos diversos programas escogidos entre los mejores de uso frecuente

* **Hardinfo:** Muestra muchas estadísticas de tu equipo y componentes
* **Gparted:** Administra dispositivos y particiones
* **Firefox:** Navega por la web
* **Thunderbird:** Gestor de correo electrónico
* **LibreOffice:** Procesador de textos
* **GIMP:** Manipular imágenes. **Extra:** instalar el plug-in "resynthesizer" para eliminar objetos y defectos
* **gnome-system-monitor o lxtask**: Gestor de tareas
* **qBitTorrent:** Descarga archivos torrent
* **RedShift:** Activa un filtro para visualizar la pantalla de noche a gusto
* **Rhythmbox:** Orquestador de música por grupos
* **Simplescreenrecorder:** Graba tu pantalla
* **Handbrake:** Conversor de formatos de vídeo
* **Soundconverter:** Conversor simple de audio
* **KeepassXC:** Gestor de contraseñas local
* **Synaptic:** Interfaz gráfica para la gestión de paquetes
* **xfce4-notes**: Apuntar cosas
* **VLC:** Reproductor de vídeo y audio
* **Evince:** Visor PDF ligero
* **Nextcloud:** Cliente de almacenamiento en la nube
* **Telegram:** Aplicación de mensajería con muchas funcionalidades
* **Lingot:** Afinador de instrumentos
* **Psensor:** Sensores de temperatura del hardware
* **Catfish:** Buscar en el sistema de archvivos
* **MenuLibre:** Añadir o eliminar aplicaciones del menú
* **vrms:** Comprobar si tenemos instalado software privativo en nuestro sistema
* **neofetch:** Información del sistema en el terminal
* **mlocate:** Utilidad para buscar ficheros y directorios
* **OpenShot:** Editor de vídeo simple y poderoso
* [virt-manager](https://www.christitus.com/vm-setup-in-linux): Gestor de máquinas virtuales veloces gracias a la tecnología KVM/QEMU

**Recomendación:** no instales un lector de PDF si tu distribución ya trae uno por defecto (aplicable para otras categorías). Si aún así deseas instalarlo, borra el otro para ahorrar espacio.

```shell
sudo apt install hardinfo gparted firefox thunderbird libreoffice gimp gnome-system-monitor qbittorrent redshift-gtk rhythmbox simplescreenrecorder handbrake soundconverter keepassxc synaptic xfce4-notes vlc evince nextcloud-desktop telegram-desktop lingot psensor catfish menulibre vrms neofetch mlocate virt-manager
```

Otros programas excelentes que no se encuentran en los repositorios:

* [tor-browser](https://www.howtogeek.com/423866/how-to-install-and-use-the-tor-browser-on-linux/): Navegación privada usando la red Tor
* [FreeTube](https://freetubeapp.io/): YouTube sin anuncios
* [Signal](https://signal.org/): Mensajería instantánea privada
* [Element](https://element.io/): Cliente oficial de Matrix
* [Librewolf](https://librewolf.net/): Navegador web derivado de Firefox
* [Codium](https://github.com/VSCodium/vscodium): Visual Studio Code libre
* [Eclipse](https://www.eclipse.org/downloads/): IDE de Java
* [PyCharm](https://www.jetbrains.com/pycharm/): IDE de Python

### Activar soporte para flatpaks e instalación de software

Flatpak es una tecnología para crear, distribuir, instalar y ejecutar aplicaciones las cuales se actualizan a su última versión con rápidez. Además se ejecutan bajo un sistema aislado lo cual permite modificar los permisos de la misma y mantenerla separada del resto de aplicaciones. Es la mejor opción para aquellos usuarios que desean tener la última versión de un software pero su distribución solo cuenta con una demasiado antigua. Para instalarlo ponemos el comando:

```shell
sudo apt install flatpak
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
# Reiniciamos la máquina
reboot
```

Programas Flatpak recomendados:

* **FlatSeal:** Gestor de permisos de aplicaciones Flatpak.

```shell
flatpak install flatseal
```

### Creación de atajos de teclado

* **Abrir el terminal (Ctrl + Alt + T):** xfce4-terminal
* **Reducir volumen (Alt + Z):** pactl set-sink-volume alsa\_output.pci-0000\_00\_1b.0.analog-stereo -10%
* **Aumentar volumen (Alt + X):** pactl set-sink-volume alsa\_output.pci-0000\_00\_1b.0.analog-stereo +10%
* **Activar/Desactivar volumen (Alt + <):** pactl set-sink-mute alsa\_output.pci-0000\_00\_1b.0.analog-stereo toggle
* **Abrir el monitor del sistema (Ctrl + Alt + M):** gnome-system-monitor
* **Imprimir pantalla (Imp Pant):** xfce4-screenshooter -f
* **Imprimir pantalla -> Seleccionar rectángulo (Mayus + Imp Pant):** xfce4-screenshooter -r
* **Imprimir ventana actual (Alt + Imp Pant):** xfce4-screenshooter -w
* **Apagar, reiniciar, cerrar sesión (Ctrl + Alt + Supr):** xfce4-session-logout
* **Bloquear pantalla (Ctrl + Alt + L):** xflock4
* **Abrir el explorador de archivos (Super + E):** exo-open --launch FileManager
* **Navegador prederminado (Ctrl + Alt + I):** exo-open --launch WebBrowser
* **Matar ventana (Ctrl + Alt + Esc):** xkill
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
- Sistema de archivos
    - Comprobar y limpiar descargas, programas y vídeos
- Software
    - Cerrar sesión de todos los programas importantes

**Importante:** Asegurarse antes de formatear que no perderemos ningún fichero y que no olvidaremos ninguna contraseña guardada en el navegador u otro lugar que desaparecerá. Realizar una copia de seguridad antes del procedimiento de borrado. Una vez hecha esa copia mirar cada carpeta (de la copia) comprobando que está todo lo necesario para continuar con el proceso sin luego lamentaciones ni enfados.

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

#### Extra
Crear directorio "Copias de seguridad" dentro de Documentos.
