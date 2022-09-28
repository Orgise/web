#!/bin/bash
# Permite activar un filtro morado/rojizo para proteger la vista en todos los monitores conectados

proteger_vista() {
  for disp in $(xrandr | sed -n 's/^\([^ ]*\).*connected.*/\1/p'); do
    xrandr --output $disp --gamma $1 --brightness $2
  done
}

case $1 in
  off) proteger_vista 1:1:1 1 ;;
  on) proteger_vista 1:0.6:0.7 0.8 ;;
  *) echo "Opciones disponibles: off/on"
esac
