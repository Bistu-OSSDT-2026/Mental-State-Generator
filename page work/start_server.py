import http.server
import socketserver
import os

os.chdir(r'd:\trae\新建文件夹\emoji work')
PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()