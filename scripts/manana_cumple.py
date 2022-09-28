# Software usado para recordarte felicitar a tus conocidos que cumplen al día siguiente.
# Ejemplo del formato del fichero .txt necesario: nombre_pesona:dia:mes:info_extra

from datetime import datetime


def main():
    """ Comprobar de quién es el cumpleaños mañana
		usando un fichero con fechas de cumpleaños y personas."""
    # ~ dia_actual = 31
    # ~ mes_actual = 7
    # ~ ano_actual = 2027
    dia_actual = datetime.now().day
    mes_actual = datetime.now().month
    meses = ('enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
				'julio', 'agosto', 'septiempre', 'octubre',
				'noviembre', 'diciembre')

    # Consideración de días especiales
    if mes_actual in (1, 3, 5, 7, 8, 10, 12):  # Meses de 31 días
        if dia_actual == 31:
            dia_actual = 0
            if mes_actual == 12:
                mes_actual = 1
            else:
                mes_actual += 1
    elif mes_actual == 2:  # Meses de 28 días
        if dia_actual == 28:
            dia_actual = 0
            mes_actual += 1
    else:  # Meses de 30 días
        if dia_actual == 30:
            dia_actual = 0
            mes_actual += 1

    with open('../cumples.txt', 'r') as fich:
        cumpleanos = fich.readlines()

    hay_cumple = False

    for persona in cumpleanos:
        nombre = persona.split(':')[0]
        dia = int(persona.split(':')[1])
        mes = int(persona.split(':')[2])
        desc = persona.split(':')[3].strip()

		# Simplificar cumpleaños en año bisiesto
        if mes == 2 and dia == 29:
            dia = 28

        if mes_actual == mes and dia_actual + 1 == dia:
            print(f'Mañana día {dia} de {meses[mes_actual-1]} '
            f'cumple {nombre} ({desc}).')
            hay_cumple = True
        # print('Día actual', dia_actual)
        # print('Mes actual', mes_actual)
        # print('Día', dia)
        # print('Mes', mes)

    if not hay_cumple:
        print(f'Nadie cumple mañana día {dia_actual+1} de '
				f'{meses[mes_actual-1]}.')


if __name__ == '__main__':
    main()
