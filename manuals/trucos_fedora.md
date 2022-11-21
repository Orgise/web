# Trucos Fedora GNU/Linux

## Comandos

###  DNF
DNF es la herramienta para la gestión de paquetes RPM de Fedora.
```shell
# Actualizar paquetes
sudo dnf up
sudo dnf update
sudo dnf upgrade
# Actualizar un único paquete
sudo dnf update package_name
# Instalar paquetes
sudo dnf install package_name
# Desinstalar paquetes
sudo dnf remove package_name
sudo dnf erase package_name
# Mostrar información de un paquete
dnf info package_name
# Buscar un paquete
dnf search package_name
# Eliminar paquetes huérfanos (dependencias sueltas)
sudo dnf autoremove
# Listar paquetes instalados
dnf list installed
# Contar paquetes instalados
dnf list installed | wc -l
# Listar todos los paquetes disponibles
dnf ls
dnf list
dnf list available
# Enumerar todos los repositorios habilitados en el sistema
dnf repolist
# Enumerar todos los repositorios  del sistema
dnf repolist all
# Verificar todas las actualizaciones disponibles
dnf check-update
# Actualizar caché de los repositorios
sudo dnf up --refresh
# Enumerar todos los grupos de paquetes
dnf grouplist
# Instalar un grupo de paquetes
sudo dnf groupinstall "Development Tools"
# Eliminar un grupo de paquetes
sudo dnf groupremove "Development Tools"
# Actualizar un grupo de paquetes
sudo dnf groupupdate "Development Tools"
# Descargar un paquete sin instalarlo
sudo dnf download package_name
# Verificar el historial de transacciones
dnf history
dnf history info 5
# Deshacer operación 2
dnf history undo 2
# Rehacer operación 2
dnf history redo 2
# Reinstalar paquete
sudo dnf reinstall package_name
# Obtener ayuda
dnf help
dnf help install
# Degradar un paquete que actualizaste previamente
sudo dnf downgrade package_name
# Verificar qué paquete está asociado a la función requerida.
# Obtener el nombre del paquete con el que está asociado con un fichero
dnf provides /var/www/html
# Obtener el nombre del paquete con el que está asociado con un comando
dnf provides crontab
```

### Acelerar actualizaciones
Fedora por defecto limita las descargas simultáneas de paquetes y no selecciona por defecto el servidor más rápido para la descarga de los repositorios. Vamos a modificarlo.
Editamos el fichero de configuración de DNF.
```shell
sudo nano /etc/dnf/dnf.conf
```

Agregamos las dos siguientes líneas:
```
# Establecemos el máximo de descargas paralelas. Si tu velocidad de Internet es alta, puedes incrementarlo
max_parallel_downloads=10
# Elegimos el servidor que más rápido nos responda
fastestmirror=True
```
Refrescamos los cambios con `sudo dnf upgrade --refresh`.