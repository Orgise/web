# Trucos SQL

## Introducción
SQL (Structured Query Language) es un lenguaje de programación diseñado para interactuar con bases de datos relacionales. Permite realizar operaciones como la creación, consulta, actualización y eliminación de datos en una base de datos.

Para esta guía usaremos MySQL/MariaDB como sistema gestor de base de datos.

Las consultas SQL se dividen ampliamente en cinco categorías:
- DDL (lenguaje de definición de datos): se utilizan para crear un esquema de base de datos y para definir el tipo y la estructura de los datos que se almacenarán en una base de datos.
- DML (lenguaje de manipulación de datos): permiten manipular, consultar, eliminar los datos o registros de las tablas.
- DCL (lenguaje de control de datos): se utilizan para controlar el acceso a los datos en una base de datos.
- TCL (lenguaje de control transaccional): utilizadas para controlar las transacciones en una base de datos.
- DQL (Data Query Language): usadas para realizar consultas a la base de datos.


## Instrucción CREATE
Crear objetos en la base de datos, como tablas, vistas, procedimientos almacenados y esquemas.

```sql
--- Crear base de datos
CREATE DATABASE db;

--- Crear usuario
CREATE USER 'user'@'localhost' IDENTIFIED BY 'usuario1';

--- Crear tabla
CREATE TABLE empleados (
    id INT PRIMARY KEY,
    nombre VARCHAR(255),
    edad INT,
    sueldo DECIMAL(10, 2),
    FOREIGN KEY (id_orden) REFERENCES departamentos(id)
);
--- Crear un rol llamado manager
CREATE ROLE manager;

--- Crear un índice en la columna "nombre" de la tabla "clientes"
CREATE INDEX nombre_index ON clientes (nombre);

--- Crear un disparador que inserta un registro en una tabla de auditoría cada vez que se inserta un registro en la tabla "clientes"
CREATE TRIGGER clientes_insert_trigger
AFTER INSERT ON clientes
FOR EACH ROW
BEGIN
INSERT INTO auditoria (tabla, accion) VALUES ('clientes', 'insert');
END;

--- Crear un procedimiento almacenado llamado "obtener_clientes"
CREATE PROCEDURE obtener_clientes()
BEGIN
SELECT * FROM clientes;
END;

--- Crear una vista llamada "clientes_vista" que selecciona los clientes cuyo nombre empieza con "A"
CREATE VIEW clientes_vista AS
SELECT * FROM clientes
WHERE nombre LIKE 'A%';

--- Crear un tipo de dato enumerado llamado "estado_cliente" con los valores "activo" e "inactivo"
CREATE TYPE estado_cliente AS ENUM ('activo', 'inactivo');

--- Crear una función llamada "edad_promedio" que calcula la edad promedio de los clientes
CREATE FUNCTION edad_promedio() RETURNS FLOAT
BEGIN
RETURN (SELECT AVG(edad) FROM clientes);
END;

--- Crear una tabla temporal llamada "tmp_ventas" con columnas para "id", "producto", "cantidad" y "fecha"
CREATE TEMPORARY TABLE tmp_ventas (
id INT,
producto VARCHAR(255),
cantidad INT,
fecha DATE
);
```


## Instrucción DROP
Eliminar objetos de la base de datos, como tablas, vistas, procedimientos almacenados y esquemas.

```sql
--- Eliminar la tabla "empleados"
DROP TABLE empleados;

--- Eliminar la base de datos "prueba"
DROP DATABASE prueba;

--- Eliminar el índice "nombre_index" de la tabla "empleados"
DROP INDEX nombre_index;

--- Eliminar el trigger "empleados_insert_trigger"
DROP TRIGGER empleados_insert_trigger;

--- Eliminar el procedimiento almacenado "obtener_empleados"
DROP PROCEDURE obtener_empleados;
```


## Instrucción INSERT
Insertar una nueva fila de datos en una tabla de una base de datos. Esta instrucción específica la tabla donde se insertaran los datos y los valores de los datos para cada columna de la tabla.

```sql
--- Insertar un registro en la tabla "empleados" con valores para todas las columnas
INSERT INTO empleados (nombre, edad, sueldo, departamento_id)
VALUES ('Juan Perez', 30, 50000, 1);

--- Insertar varios registros en una sola consulta a la tabla "empleados"
INSERT INTO empleados (nombre, edad, sueldo, departamento_id)
VALUES ('Maria Rodriguez', 25, 45000, 2), ('Pedro Gonzalez', 35, 55000, 1);

--- Insertar un registro en la tabla "empleados" utilizando una subconsulta para obtener el valor de una columna
INSERT INTO empleados (nombre, edad, sueldo, departamento_id)
VALUES ('Ana Lopez', 28, 48000, (SELECT id FROM departamentos WHERE nombre = 'Ventas'));

--- Insertar un registro en la tabla "empleados" utilizando un valor NULL para una columna
INSERT INTO empleados (nombre, edad, sueldo, departamento_id)
VALUES ('Maria Rodriguez', 25, 45000, NULL);

--- Insertar un registro en la tabla "empleados" utilizando un valor DEFAULT para una columna
INSERT INTO empleados (nombre, edad, sueldo, departamento_id)
VALUES ('Pedro Gonzalez', 35, 55000, DEFAULT);

--- Insertar un registro en la tabla "empleados" utilizando el valor de la fecha actual para una columna
INSERT INTO empleados (nombre, edad, sueldo, departamento_id, fecha_ingreso)
VALUES ('Ana Lopez', 28, 48000, 1, CURRENT_TIMESTAMP);
```


## Instrucción SELECT
Obtener datos de una o varias tablas de una base de datos, se puede especificar la columna de la tabla, filtros, ordenamientos y limitaciones para obtener solo los datos específicos que se necesiten.

```sql
--- Seleccionar todos los campos de la tabla "empleados"
SELECT * FROM empleados;

--- Mostrar todos los usuarios creados en el SGBD
SELECT user FROM mysql.user;

--- Seleccionar solo el campo "nombre" y "sueldo" de la tabla "empleados"
SELECT nombre, sueldo FROM empleados;

--- Seleccionar todos los campos de la tabla "empleados" y ordenarlos por "nombre" de forma ascendente
SELECT * FROM empleados ORDER BY nombre ASC;

--- Seleccionar todos los campos de la tabla "empleados" donde el sueldo sea mayor a 45000
SELECT * FROM empleados WHERE sueldo > 45000;

--- Seleccionar todos los campos de la tabla "empleados" donde el salario se encuentre entre 1200 y 1600 euros
SELECT * FROM empleados WHERE salario BETWEEN 1200 AND 1600;

--- Seleccionar los empleados cuyo nombre contenga "nton"
SELECT * FROM empleados WHERE nombre LIKE '%nton%';

--- Seleccionar los empleados cuyo nombre empiece por "A";
SELECT * FROM empleados WHERE nombre LIKE 'A%';

--- Seleccionar los empleados cuyo nombre empiece por "Antoni" y termina con "a" o con "o"
SELECT * FROM empleados WHERE nombre LIKE 'Antoni%' AND (nombre like '%a' OR nombre like '%o');
SELECT * FROM empleados WHERE nombre IN ('Antonio', 'Antonia');

--- Seleccionar los empleados cuyo nombre empiece por "Antoni" y solo haya un caracter más para alcanzar el final de la cadena
SELECT * FROM empleados WHERE nombre = 'Antoni_';

--- Seleccionar solo los campos "nombre" y "sueldo" de la tabla "empleados" donde el departamento sea "ventas"
SELECT nombre, sueldo FROM empleados JOIN departamentos ON empleados.departamento_id = departamentos.id WHERE departamentos.nombre = 'ventas';

--- Seleccionar todos los campos de la tabla "empleados" limitando a solo 3 resultados
SELECT * FROM empleados LIMIT 3;

--- Seleccionar todos los campos de la tabla "empleados" a partir del segundo resultado limitando a solo 3 resultados
SELECT * FROM empleados LIMIT 3 OFFSET 1;

--- Seleccionar el campo "nombre" y "edad" de la tabla "empleados" y agruparlos por "edad"
SELECT nombre, edad FROM empleados GROUP BY edad;

--- Seleccionar todos los campos de la tabla "empleados" y contar el número de resultados
SELECT COUNT(*) FROM empleados;

--- Seleccionar el campo "nombre" de la tabla "empleados" y contar el número de resultados diferentes
SELECT COUNT(DISTINCT nombre) FROM empleados;

--- Seleccionar el nombre, fecha de nacimiento y edad de la tabla "clientes"
SELECT nombre, f_nac, TIMESTAMPDIFF(YEAR, f_nac, '2013-08-02') AS edad FROM clientes;
```


## Instrucción GRANT
Asignar privilegios a un usuario o grupo de usuarios sobre una base de datos o un objeto específico dentro de una base de datos.

El permiso WITH GRANT OPTION permite que el usuario al que le han concedido permisos pueda a su vez concederlos a otros usuarios. Solo puedes conceder los privilegios que tienes, nunca de un nivel superior.

El nivel de privilegios se refiere a los permisos o accesos que un usuario o grupo de usuarios tiene sobre una base de datos o un objeto específico dentro de una base de datos.

Otorgar todos los privilegios solo afecta el nivel de privilegio dado. Por ejemplo, otorgar todos los privilegios en una tabla no otorga ningún privilegio en la base de datos o globalmente.

El uso de ALL PRIVILEGES no otorga el privilegio especial GRANT OPTION.

```sql
--- Conceder todos los privilegios sobre todas las bases de datos a un nuevo usuario
GRANT ALL ON *.* TO 'user'@'localhost' IDENTIFIED BY 'password1';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' IDENTIFIED BY 'password1';

--- Conceder acceso de lectura a un usuario sobre una tabla específica
GRANT SELECT ON nombre_bd.nombre_tabla TO 'usuario'@'host';

--- Conceder acceso completo (SELECT, INSERT, UPDATE, DELETE) a un usuario sobre una base de datos específica
GRANT ALL PRIVILEGES ON nombre_bd.* TO 'usuario'@'host';

--- Conceder acceso de lectura a un usuario sobre una tabla específica, y permitirle ejecutar consultas con la opción 'WITH GRANT OPTION'
GRANT SELECT ON nombre_bd.nombre_tabla TO 'usuario'@'host' WITH GRANT OPTION;
```


## Instrucción REVOKE
Revocar los permisos otorgados anteriormente a usuarios para acceder a los objetos de la base de datos.

```sql
--- Revocar permisos para actualizar tablas en una base de datos específica
REVOKE UPDATE ON db.* TO 'user'@'localhost';
```

## Instrucción DELETE
Eliminar registros de una tabla específica.
```sql
--- Eliminar un registro
DELETE FROM clientes WHERE id_cliente = 5;

--- Eliminar varios registros
DELETE FROM ordenes WHERE fecha_orden < '2022-01-01';

--- Eliminar todos los registros de una tabla
DELETE FROM productos;

--- Eliminar registros de varias tablas
DELETE FROM detalles_orden, ordenes
WHERE detalles_orden.id_orden = ordenes.id_orden
AND ordenes.fecha_orden < '2022-01-01';

--- Eliminar registros con una subconsulta
DELETE FROM productos
WHERE id_producto IN (SELECT id_producto FROM ordenes WHERE fecha_orden < '2022-01-01');

--- Eliminar registros con una transacción
START TRANSACTION;
DELETE FROM productos WHERE id_producto = 2;
DELETE FROM categorías WHERE id_categoría = 5;
COMMIT;

--- Eliminar registros con un JOIN
DELETE productos, detalles_orden
FROM productos
INNER JOIN detalles_orden ON productos.id_producto = detalles_orden.id_producto
WHERE productos.nombre_producto = 'Libro';

--- Eliminar registros con un LIMIT
DELETE FROM clientes
WHERE pais = 'USA'
ORDER BY id_cliente DESC
LIMIT 10;
```


## Instrucción ALTER
Modificar los objetos de la base de datos, como tablas, vistas, procedimientos almacenados y esquemas, entre otros.

```sql
--- Cambiar el nombre de una tabla
--- Cambiar el nombre de una tabla
ALTER TABLE clientela RENAME TO clientes;

--- Agregar una columna a una tabla
ALTER TABLE ordenes ADD COLUMN total_orden DECIMAL(10,2);

--- Modificar una columna existente
ALTER TABLE productos MODIFY COLUMN precio_producto DECIMAL(10,2) NOT NULL;

--- Cambiar la estructura de una tabla
ALTER TABLE empleados MODIFY COLUMN id_empleado INT(11) NOT NULL AUTO_INCREMENT;

--- Eliminar una columna
ALTER TABLE ordenes DROP COLUMN total_orden;

--- Agregar una restricción a una tabla
ALTER TABLE clientes ADD CONSTRAINT clientes_email UNIQUE (email);

--- Eliminar una restricción de una tabla
ALTER TABLE productos DROP FOREIGN KEY productos_ibfk_1;

--- Agregar un trigger a una tabla
ALTER TABLE ordenes ADD TRIGGER actualizar_total_orden
AFTER INSERT ON detalles_orden
FOR EACH ROW
BEGIN
UPDATE ordenes SET total_orden = total_orden + NEW.cantidad * NEW.precio WHERE id_orden = NEW.id_orden;
END;

--- Eliminar un trigger de una tabla
ALTER TABLE pedidos DROP TRIGGER actualizar_total_pedidos;
```


## Instrucción SHOW
Mostrar información sobre los objetos de la base de datos.
```sql
--- Mostrar todas las bases de datos
SHOW DATABASES;

--- Mostrar tablas en una base de datos específica
SHOW TABLES FROM db;

--- Mostrar estructura de una tabla
SHOW COLUMNS FROM clientes;

--- Mostrar índices de una tabla
SHOW INDEX FROM productos;

--- Mostrar estado de una tabla
SHOW TABLE STATUS FROM clientes;

--- Mostrar estado del motor de una tabla
SHOW ENGINE INNODB STATUS;

--- Mostrar estado del servidor
SHOW STATUS;

--- Mostrar variables de configuración del servidor
SHOW VARIABLES;

--- Mostrar los procesos activos en el servidor
SHOW PROCESSLIST;

--- Mostrar las tablas con las que está relacionada una tabla específica
SHOW CREATE TABLE productos;

--- Mostrar los triggers existentes
SHOW TRIGGERS;

--- Mostrar los privilegios de un usuario
SHOW GRANTS FOR 'user'@'localhost';
```


## Instrucción DESCRIBE
Conocer la estructura de una tabla o un procedimiento almacenado.

```sql
--- Mostrar la estructura de una tabla
DESCRIBE tabla;

--- Mostrar información detallada de una columna
DESCRIBE clientes edad;
```


## Instrucción REPLACE
Insertar o actualizar un registro en una tabla específica. Si el registro ya existe, es actualizado.

- REPLACE funciona igual que la instrucción INSERT, excepto que si la fila anterior en la tabla tiene el mismo valor que una fila nueva para una PK o un índice UNIQUE, la fila nueva se inserta después de eliminar la fila anterior.

```sql
--- Reemplazar un registro existente
REPLACE INTO clientes (id_cliente, nombre_cliente, nombre_contacto, pais)
VALUES (5, 'Cardinal', 'Tom B. Erichsen', 'Suecia');

--- Reemplazar varios registros a la vez
REPLACE INTO productos (id_producto, nombre_producto, id_proveedor, id_categoría, unidad, precio)
VALUES (1, 'Chai', 1, 1, '10 cajas x 20 bolsas', 18.0000),
(2, 'Chang', 1, 1, '24 - 12 oz botellas', 19.0000),
(3, 'Jarabe de anis', 1, 2, '12 - 550 ml botellas', 10.0000);

--- Reemplazar registros con una subconsulta
REPLACE INTO ordenes (id_orden, id_cliente, fecha_orden, total_orden)
SELECT id_orden, id_cliente, fecha_orden, SUM(cantidad*precio)
FROM detalles_orden
GROUP BY id_orden;
```


## Instrucción TRUNCATE
Eliminar todos los registros de una tabla específica.

```sql
--- Vaciar una tabla
TRUNCATE TABLE clientes;

--- Vaciar varias tablas
TRUNCATE TABLE productos, pedidos;

--- Vaciar una tabla con restricciones de clave foránea
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE order_details;
SET FOREIGN_KEY_CHECKS=1;
```


## Instrucción UPDATE
Modificar uno o varios campos de los registros existentes en una tabla específica.

```sql
--- Actualizar un registro
UPDATE clientes SET nombre='Charlie Brown' WHERE cliente_id=5;

--- Actualizar varios registros
UPDATE productos SET precio = precio + 5 WHERE id_categoria = 1;

--- Actualizar registros con una subconsulta
UPDATE pedidos SET total_pedidos = (SELECT SUM(cantidad * precio) FROM detalles_pedidos WHERE pedidos.id_pedido = detalles_pedidos.id_pedido);

--- Actualizar registros con un JOIN
UPDATE productos
INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria
SET productos.precio = products.precio * 1.1
WHERE categorias.nombre = 'Embutidos';

--- Actualizar registros con una transacción
START TRANSACTION;
UPDATE productos SET stock = stock - 5 WHERE producto_id = 2;
UPDATE productos SET stock = stock + 5 WHERE producto_id = 4;
COMMIT;

--- Actualizar un valor a null
UPDATE clientes SET address = NULL WHERE id_cliente = 5;
```


## Instrucción FLUSH
Se utiliza para vaciar y/o reiniciar ciertos recursos en una base de datos.

```sql
--- Recarga los privilegios de los usuarios, se utiliza para reflejar los cambios realizados en los usuarios y privilegios luego de modificar o crear un nuevo usuario.
FLUSH PRIVILEGES;

--- Vacía la tabla de hosts (ip's y usuarios) bloqueados, se suele utilizar para desbloquear un host que se encuentra bloqueado.
FLUSH HOSTS;

--- Vacía los registros del log de errores de MariaDB, se utiliza para limpiar los registros antiguos que ya no son necesarios.
FLUSH LOGS;

--- Liberar la memoria y recargar las tablas si han sido modificadas en el sistema de archivos.
FLUSH TABLES;

--- Limpiar cualquier consulta guardada en la caché que ya no es necesaria o para actualizar las consultas en caché si los datos han sido modificados.
FLUSH QUERY CACHE;
```


## Instrucciones START, COMMIT y SAVEPOINT (transacciones)
Las transacciones son un conjunto de instrucciones que se ejecutan como si fueran una sola operación, garantizando que el estado de la base de datos sea consistente antes y después de la ejecución de las instrucciones. Esto significa que si una de las instrucciones falla, todas las instrucciones previas se revierten (rollback) a su estado anterior, garantizando que la base de datos no quede en un estado inconsistente.

La instrucción START TRANSACTION inicia una transacción en MariaDB, la cual permite ejecutar varias instrucciones SQL como si fueran una sola operación. Todas las instrucciones SQL ejecutadas después de START TRANSACTION son parte de la transacción en curso.

La instrucción COMMIT hace que las instrucciones ejecutadas en una transacción sean permanentes y que las modificaciones realizadas se apliquen a la base de datos, si no existe ningún problema al aplicar las modificaciones, si existe alguna excepción o problema se ejecutaria un ROLLBACK para deshacer los cambios.

```sql
--- En este ejemplo si ambas instrucciones se ejecutan correctamente, la transacción se confirma mediante el uso de COMMIT y los cambios se aplican permanentemente a la base de datos. En caso contrario, si alguna de las instrucciones falla, la transacción se revierte automáticamente mediante un ROLLBACK y ningún cambio se realiza en la base de datos.
START TRANSACTION;
UPDATE cuentas SET saldo = saldo - 100 WHERE numero_cuenta = '12345';
UPDATE cuentas SET saldo = saldo + 100 WHERE numero_cuenta = '67890';
COMMIT;
```

La instrucción SAVEPOINT se utiliza para establecer puntos de control dentro de una transacción, de forma que se pueden revertir solo los cambios realizados desde ese punto en lugar de revertir toda la transacción. Por ejemplo, si se está realizando una transacción para insertar datos en varias tablas y se desea revertir solo los cambios realizados en una de ellas en caso de error, se puede establecer un punto de control antes de insertar datos en esa tabla específica y revertir solo los cambios desde ese punto.
