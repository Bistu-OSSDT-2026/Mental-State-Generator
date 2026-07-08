import base64
f = open('images/bistu-logo.png', 'rb')
data = f.read()
f.close()
encoded = base64.b64encode(data).decode()
print(encoded[:100])
print('Total length:', len(encoded))
