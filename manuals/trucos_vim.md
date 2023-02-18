# VIM

# Definición
Vim es un editor de texto muy popular, diseñado para ser rápido y fácil de usar, con una variedad de funciones para ayudar a los programadores a escribir código. Estas incluyen la edición de múltiples archivos al mismo tiempo, compatibilidad con diferentes lenguajes de programación, sintaxis de coloreado para facilitar la lectura, y una variedad de atajos de teclado para realizar tareas comunes de forma rápida y sencilla. Vim también ofrece la capacidad de personalizar el comportamiento del editor para satisfacer sus necesidades individuales.

## Instalación
```shell
sudo apt install vim
```

## Parámetros
|Parámetro|Descripción
|-|-|
| -r | Listar ficheros cerrados sin guardar
| -r fichero | Recuperar fichero cerrado sin guardar

## Abrir el tutor de Vim
Es un programa que ayuda a los iniciantes a aprender a usar el editor.
```shell
vimtutor
```

## Instalar administrador de plugins
Veremos como instalar el gestor de plugins [vim-plug](https://github.com/junegunn/vim-plug) para poder instalar complementos de forma sencilla.
```shell
# Crear directorio de configuración y plugins
mkdir ~/.vim && cd ~/.vim
# Directorio donde se almacenarán los plugins descargados usando vim-plug
mkdir plugged
# Directorio de carga automática de plugins
mkdir autoload && cd autoload
# Descargar vim.plug
wget https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

## Instalar un plugin usando vim-plug
Para este ejemplo, instalamos Emmet, el cual es una herramienta de codificación que permite escribir HTML y CSS de forma rápida y sencilla, con la ayuda de abreviaturas y expresiones. Ideal para desarrollo web.
```shell
# Editar el fichero de configuración de Vim
vim ~/.vimrc
```

.vimrc

    call plug#begin('~/.vim/plugged')
    Plug 'mattn/emmet-vim'
    call plug#end()

Establecemos el inicio y el final de una sección de configuración de plugins para Vim. En la primera línea se especifíca la ruta donde guardar los complementos. Dentro de esta sección indicamos el nombre y el repositorio de GitHub de los plugins que queramos instalar.

Por último abrimos Vim y escribimos `:PlugInstall`. Se instalarán los plugins especificados.

Para comprobar que está instalado, creamos un fichero cualquiera con extensión HTML y escribimos `html:5`. Seguidamente pulsamos la combinación **Ctrl + Y ,** para generar una plantilla HTML5.


### Descargar e instalar diccionario español
Muy útil para corregir faltas ortográficas.
1. Visitamos el siguiente [enlace](http://ftp.vim.org/vim/runtime/spell/).
2. Descargamos el fichero `es.utf-8.spl`.
3. Movemos el fichero a `/usr/share/vim/vim90/spell`.
4. Editamos el fichero `~/.vimrc`
5. Agregamos:
```
set spell
setlocal spell spelllang=es
```

### Guardar parte de un fichero en otro
1. Pulse  v  y mueva el cursor hasta donde desee. Vea que el texto es resaltado.
2. Pulse el carácter  :  . En la parte inferior de la pantalla aparecerá :'<,'>
3. Pulse  w TEST  , donde TEST es el nombre de archivo donde guardar lo seleccionado.
4. Verifique que vea  :'<,'>w TEST  antes de pulsar INTRO.

## Modos de Vim

Muy importante:
- Al escribir un número antes de un movimiento, lo repite esas veces.
- Al escribir un número con un operador lo repite esas veces.
- Todos las configuraciones que se activen con `:set` tienen su contrapartida escribiendo un `no` delante. Por ejemplo, para activar/desactivar los errores gramaticales:
```shell
# Activar
:set spell
# Desactivar
:set nospell
```
- El fichero `.vimrc` se interpreta cada vez que Vim es ejecutado.

### Modo normal
El modo normal de Vim es uno de los tres modos principales de edición de Vim. En él puede navega por el documento, insertar comandos para realizar tareas y modificar el texto. Es el modo en el que se encuentra Vim cuando inicia un documento nuevo.

#### Atajos de teclado
|Atajo|Acción|
|-|-|
| 0 | Colocar el cursor al inicio de la línea
| a | Insertar texto después del cursor
| b | Mover el cursor al inicio de la palabra anterior
| c | Cortar los caracteres seleccionados
| d | Operador para borrar
| e | Mover el cursor al final de la palabra actual
| i | Insertar texto en la posición actual del cursor
| n | Ir al siguiente resultado de la búsqueda
| o | Insertar una nueva línea después de la línea actual y entrar al modo de inserción
| p | Pegar los caracteres borrados o cortados después del cursor
| r | Reemplazar el caracter bajo el cursor
| u | Deshacer la última acción
| y | Copiar los caracteres seleccionados
| v | Entrar al modo de selección
| w | Mover el cursor al inicio de la palabra siguiente
| x | Cortar el carácter bajo el cursor
| A | Insertar texto al final de la línea
| C | Cortar todos los caracteres hasta el final de la línea
| D | Borrar todos los caracteres hasta el final de la línea
| G | Ir al final del documento
| N | Ir al resultado anterior de la búsqueda
| O | Insertar una nueva línea antes de la línea actual y entrar al modo de inserción
| P | Pegar los caracteres borrados o cortados antes del cursor
| R | Entrar al modo de reemplazo, donde cada carácter escrito elimina un carácter ya existente.
| U | Deshacer una línea entera
| V | Entrar al modo de selección de líneas
| X | Borrar el carácter anterior
| Y | Copiar todos los caracteres hasta el final de la línea
| c0 | Cambiar el texto desde la posición actual hasta el inicio de la línea
| cc | Eliminar el contenido de la línea y entrar en modo inserción
| ce | Cambiar el texto desde la posición actual hasta el final de la palabra
| c$ | Cambiar el texto desde la posición actual hasta el final de la línea
| d0 | Borrar hasta el inicio de la línea
| de | Borrar hasta el final de la palabra actual
| dd | Borrar línea actual
| dg | Borras hata el final del fichero
| dw | Borrar hasta el comienzo de la siguiente palabra
| d$ | Borrar hasta el final de la línea
| d) | Borrar hasta el final de la frase
| gg | Mover el cursor a la primera línea del documento
| gu | Intercambiar el texto a minúsculas
| gU | Intercambiar el texto a mayúsculas
| g~ | Intercambiar las mayúsculas por minúsculas y viceversa del texto seleccionado
| yw | Copia una palabra
| yy | Copia una línea
| ciw | Cambiar una palabra sin ignorando la posición en la que nos encontremos
| dgg | Borrar hasta el inicio del fichero
| gg=G | Identar todo el fichero
| . | Repetir la última acción
| / | Buscar texto dentro del documento
| ? | Buscar texto en la dirección opuesta (hacia arriba)
| % | Encontrar la pareja de cierre correspondiente
| ^ | Mover el cursor al primer caracter de la línea
| ( | Mueve el cursor al comienzo del anterior segmento de palabras
| ) | Mueve el cursor al final del siguiente segmento de palabras
| [[ | Mueve el cursor al comienzo del anterior bloque de código
| ]] | Mueve el cursor al final del siguiente bloque de código
| [] | Mueve el cursor al final de la línea anterior
| ][ | Mueve el cursor al comienzo de la siguiente línea


| ESC | Volver al modo Normal, o cancelar una orden no deseada o incompleta
| Ctrl + i | Ir a la línea siguiente
| Ctrl + o | Ir a la línea previa
| Ctrl + r | Rehacer la acción deshecha
| CTRL + f | Desplazarse una pantalla abajo
| CTRL + b | Desplazarse una pantalla arriba
| : + Ctrl + d | Mostrar listado de comandos que empiecen con los caracteres indicados
| CTRL + w | Intercambiar entre ventanas
| CTRL + x + o | Ir al siguiente panel
| CTRL + x + c | Cerrar todas las ventanas
| CTRL + g | Mostrar su situación en el fichero y su estado
| Shift+H | Mover el cursor a principio del fichero
| :r FILE o !COMMAND | Insertar el contenido de un fichero o la salida de un comando
| :w | Guardar el documento
| :q | Salir del documento
| :q! | Salir sin guardar
| :quitall, :qa | Cerrar todos los ficheros abiertos
| :wq | Guardar y salir
| :term | Abre una terminal en una ventana separada dentro de la ventana de Vim
| :set paste | Deshabilitar identación automática cuando se pega un texto
| :set number | Mostrar los números de línea
| :set relativenumber | Mostrar los números de líneas relativos
| :set nonumber | Ocultar los números de línea
| :set hlsearch | Resaltar los resultados de la búsqueda
| :set nohlsearch, :noh | Desactivar el resaltado de los resultados de la búsqueda
| :set ic | Ignorar distinción entre mayúsculas y minúsculas en la búsqueda
| :set wrap | Ajustar el texto al ancho de la pantalla
| :set spelllang=es | Activar la corrección ortográfica en español vim
| :set spell | Activar la corrección ortográfica
| :set spelllang=es | Activar la corrección ortográfica en español
| :set mouse=a | Habilitar el mouse para seleccionar y copiar
| :set mouse= | Deshabilitar el mouse para seleccionar y copiar
| :set readonly, :set ro | Habilitar el modo solo lectura
| :tabnew FILE | Abrir fichero en una nueva pestaña
| :tabn number | Dirigirse a la pestaña especificada
| :tabs | Listar pestañas abiertas
| :retab | Reemplazar los espacios por tabulaciones y viceversa
| :number | Ir a la línea especificada
| 12G | Ir a la línea 12
| :!command | Ejecutar un comando externo (shell)
| :help, F1 | Mostrar la ayuda de Vim
| :help :command | Mostrar la ayuda de un comando de Vim
| :e | Abrir un archivo
| :w file | Guardar los cambios en un fichero
| :write | Guardar el archivo
| :syntax on | Activar la sintaxis
| :%s/old/new/g | Cambiar cada ocurrencia en todo el archivo.
| :%s/old/new/gc | Encontrar cada ocurrencia en todo el archivo, pidiendo confirmación para realizar la sustitución o no.
| :1,7s/viejo/nuevo/g | Cambiar cada ocurrencia entre la línea 1 y la línea 7
| ]s | Siguiente falta ortográfica
| [s | Anterior falta ortográfica
| z= | Mostrar sugerencias para una palabra incorrecta
| zg | Añadir una palabra al diccionario
| zug | Deshacer la adición de una palabra al diccionario
| zw | Eliminar una palabra del diccionario

| d3w | Borrar 3 palabras
