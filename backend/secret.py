import secrets

def generate_secret_key():
    return secrets.token_hex(32)

if __name__ == "__main__":
    print("Generated SECRET_KEY:", generate_secret_key())
