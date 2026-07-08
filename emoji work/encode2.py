import base64
f = open('images/bistu-logo.png', 'rb')
data = f.read()
f.close()
encoded = base64.b64encode(data).decode()
f2 = open('output.txt', 'w')
f2.write(encoded)
f2.close()
print('Done')
