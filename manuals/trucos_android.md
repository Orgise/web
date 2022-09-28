# Trucos Android

## Ajustes

### Activar modo desarrollador
1. Entrar en **Ajustes**
2. Acerca del teléfono o información del dispositivo
3. Pulsar 7 veces sobre **Número de compilación**.

## Comandos ADB (Android Debug Bridge)

### Instalar adb y conectarse mediante terminal (GNU/Linux)
```
$ sudo apt install adb
```
1. En el ordenador, conectar mediante USB el smartphone.
2. En el teléfono, activar el modo depuración USB.
3. En el teléfono, pulsar *Confiar en este ordenador*.

### Entrar en la consola del teléfono
```
$ adb shell
```

### Listar dispositivos conectados
```
$ adb devices
```

### Ejecutar comandos sin entrar en la terminal del dispositivo
```
$ adb shell comando
```

### Enviar fichero del PC a Android
```
$ adb push local remoto
```

### Recibir fichero de Android al PC
```
$ adb pull remoto local
```

### Reiniciar Android
```
$ adb reboot
```

### Acceder al bootloader
```
$ adb reboot-bootloader
```

### Acceder al modo de recuperación
```
$ adb reboot recovery
```

### Instalar paquetes
```
$ adb install fich.apk
```

### Actualizar paquetes
```
$ adb adb install -r fich.apk
```

### Desinstalar paquetes
```
$ adb uninstall fich.apk
# También se puede con el siguiente comando
# -k: conservar datos y caché
$ pm uninstall -k package_name
```

### Visualizar el registro del dispositivo
```
$ adb logcat
```

## Comandos PM (Package Manager)

### Instalar paquetes
```
$ pm install fich.apk
```
Parámetros:
- -r: Reinstall an existing app, keeping its data.
- -s: Install package on the shared mass storage (such as sdcard).
- -f: Install package on the internal system memory.
- -g: Grant all permissions listed in the app manifest.

### Desinstalar paquetes
```
$ pm uninstall -k --user 0 <package name>
```

### Desinstalar datos asociados a un paquete
```
$ pm clear packageName
```

### Visualizar paquetes instaladas
```
$ pm list packages
```
Parámetros:
- -f: See their associated file.
- -d: Filter to only show disabled packages.
- -e: Filter to only show enabled packages.
- -s: Filter to only show system packages.
- -3: Filter to only show third party packages.
- -i: See the installer for the packages.
- -u: Also include uninstalled packages.
- --user user_id: The user space to query.

### Listar permisos de Android
```
$ pm list permission-groups
```

### Listar las características del sistema
```
$ pm list features
```

### Listar las librerías del sistema
```
$ pm list libraries
```

### Listar los usuarios del sistema
```
$ pm list users
```


### Ver la ruta del .apk del paquete introducido
```
$ pm path packageName
```

### Activar el paquete o componente
```
$ pm enable package_or_component
```

### Desactivar el paquete o componente
```
$ pm disable-user --user 0 package_or_component
```

### Otorgar a un paquete un permiso
```
$ pm grant package_name permission
```

### Revocar a un paquete un permiso
```
$ pm revoke package_name permission
```

### Elegir dispositivo donde instalar las paquetes
```
$ pm set-install-location location
```

Location values:
- 0: Auto: Let system decide the best location.
- 1: Internal: install on internal device storage.
- 2: External: on external media.

### Visualizar el dispositivo donde se instalarán los paquetes por defecto
```
$ pm get-install-location
```

### Crear usuario
```
$ pm create-user user_name
```

### Eliminar usuario
```
$ pm remove-user user_id
```

### Mostrar el número máximo de usuarios que soporta el dispositivo
```
$ pm get-max-users
```

## Software

### Mejores aplicaciones FOSS (fuera de F-Droid):
- Uno Calculator
- lichess
- Filen.io
- FLauncher

### Mejores aplicaciones F-Droid:
- DuckDuckGo
- NewPipe
- Snapdrop (compartir archivos en red local)
- SecScanQR
- Element (cliente de Matrix)
- Geometric Weather por wangdaye
- Aurora Store
- Fritter (Twitter front-end)
- LibreSpeed
- Ning (escáner de red)
- Tutanota
- FairEmail
- K-9 Email
- SimpleMobileTools
- PDF Viewer Plu
- MuPDF viewer
- DroidShows
- lemmur (cliente de Lemmy)
- Fennec
- Mull
- QuickDic
- VLC
- ScreenCam
- NextCloud
- SuperTuxKart
- OpenTracks
- Telegram FOSS
- Clock by qw123wh
- Molly
- xBrowserSync
- Standard Notes
- BatteryBot Pro
- Feeel (entrenar tu cuerpo)
- Open Note Scanner
- App Manager (gestión avanzada de aplicaciones)
- Tunerly (afinador de guitarra)
- Infinity (Reddit front-end)
- Key Mapper
