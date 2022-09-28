# Software usado para recordarte felicitar a tus conocidos que cumplen durante el mes seleccionado.
# Ejemplo del formato del fichero .txt necesario: nombre_pesona:dia:mes:info_extra

from datetime import datetime

dia_actual = datetime.now().day  # 1-31
mes_actual = datetime.now().month  # 1-12

meses = ('enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
                  'agosto', 'septiempre', 'octubre', 'noviembre', 'diciembre')
print('Consultar cumpleaños')
mes_usuario = 0
while mes_usuario not in range(1, 13):
    mes_usuario = int(input('Mes: '))
print()

with open('../cumples.txt', 'r') as fich:
    cumpleanos = fich.readlines()

cumples_proximos = []
cumples_pasados = []

for persona in cumpleanos:
    nombre = persona.split(':')[0]
    dia = int(persona.split(':')[1])
    mes = int(persona.split(':')[2])
    desc = persona.split(':')[3].strip()
    if mes_usuario == mes == mes_actual:
        if dia == dia_actual:
            print(f'Felicidades {nombre} ({desc}), hoy día {dia} es tu cumpleaños.\n')
        elif dia > dia_actual:
            cumples_proximos.append([nombre, dia, mes, desc])
        else:
            cumples_pasados.append([nombre, dia, mes, desc])
    else:
        if mes_usuario == mes:
            cumples_proximos.append([nombre, dia, mes, desc])

if len(cumples_proximos) == 0:
    print('Nadie va a cumplir años en lo que queda de mes\n')
else:
    print(f'En el mes de {meses[mes_usuario - 1]} cumplen años:')
    print('-'*36)
    for i in range(0, len(cumples_proximos)):
        print(f'Día {cumples_proximos[i][1]}: {cumples_proximos[i][0]} ({cumples_proximos[i][3]})')
    print()

if len(cumples_pasados) == 0:
    if mes_usuario == mes_actual:
        print('Nadie ha cumplido aún')
else:
    print(f'Ya han cumplido:')
    print('-' * 16)
    for i in range(0, len(cumples_pasados)):
        print(f'Día {cumples_pasados[i][1]}: {cumples_pasados[i][0]} ({cumples_pasados[i][3]})')
