import base64

with open("images/bistu-logo.png", "rb") as f:
    encoded = base64.b64encode(f.read()).decode("utf-8")

with open("images/bistu-logo-base64.txt", "w") as f:
    f.write(encoded)

print("Done! Base64 saved to images/bistu-logo-base64.txt")
