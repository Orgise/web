# Servidor web para subir/descargar ficheros en la red local
# Antes de ejecutarlo debe configurar su IP privada y el puerto deseado

from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
import cgi
import shutil
import os

# Puerto para el servidor web
# Desactivar el cortafuegos si existen problemas de conexión de otros equipos al servidor
PORT = 1234
# Su dirección IP privada
BIND = '192.168.1.2'

PLANTILLA_HTML = f'''<html>
<head>
    <meta charset="UTF-8">
    <title>Subir ficheros</title>
    <meta name="viewport" content="width=device-width, initial-scale=2.0">
</head>
<body>
<form method="post" action="http://{BIND}:{PORT}{{}}" enctype="multipart/form-data">
    <input type="file" name="file" multiple><br><br>
    <input type="submit" value="Enviar archivos">
</form>
</body>
</html>
'''

PLANTILLA_HTML_EXITO = f'''<html>
<head>
    <meta charset="UTF-8">
    <title>Subir ficheros</title>
    <meta name="viewport" content="width=device-width, initial-scale=2.0">
</head>
<body>
<form method="post" action="http://{BIND}:{PORT}{{}}" enctype="multipart/form-data">
    <input type="file" name="file" multiple><br><br>
    <input type="submit" value="Enviar archivos">
</form>
<script>alert('Fichero(s) subido(s) correctamente')</script>
</body>
</html>
'''


class MySimpleHTTPRequestHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path.endswith("/upload"):
            directorio = self.path[:self.path.index("/upload")]
            directorio = urllib.parse.unquote(directorio)
            if os.path.isdir(os.path.realpath('.' + directorio)):
                if os.path.realpath(os.curdir) in os.path.commonpath(
                        [os.path.realpath('.' + directorio), os.path.realpath(os.curdir)]):
                    self.send_response(200)
                    self.send_header("Content-type", "text/html")
                    self.end_headers()
                    self.wfile.write(PLANTILLA_HTML.format(directorio).encode('utf-8'))
                else:
                    self.send_error(403)
            else:
                self.send_error(404)
        else:
            SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        directorio = urllib.parse.unquote(self.path)
        if os.path.isdir(os.path.realpath('.' + directorio)):
            if os.path.realpath(os.curdir) in os.path.commonpath(
                    [os.path.realpath('.' + directorio), os.path.realpath(os.curdir)]):
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={
                        'REQUEST_METHOD': 'POST',
                        'CONTENT_TYPE': self.headers['Content-Type']
                    }
                )
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(PLANTILLA_HTML_EXITO.format(directorio).encode('utf-8'))

                filefield = form["file"]
                if not isinstance(filefield, list):
                    filefield = [filefield]

                for fileitem in filefield:
                    with open(os.path.join(os.path.realpath('.' + directorio), os.path.basename(fileitem.filename)),
                              'wb') as f:
                        shutil.copyfileobj(fileitem.file, f)

                    print('Guardado:', os.path.basename(fileitem.filename))
            else:
                self.send_error(403)
        else:
            self.send_error(404)


def main():
    # Cambiar la ruta base de subida temporal de ficheros
    # os.environ["TMPDIR"] = "/home/user"
    httpd = HTTPServer((BIND, PORT), MySimpleHTTPRequestHandler)
    sa = httpd.socket.getsockname()
    print(f"Servidor web activo ({sa[0]}:{sa[1]})")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
    print("Servidor web cerrado")


if __name__ == '__main__':
    main()
