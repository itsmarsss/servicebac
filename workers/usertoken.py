import secrets
import string

class UserTokenGenerator:
    def __init__(self, token_length=128):
        self.token_length = token_length
        self.alphabet = string.ascii_letters + string.digits

    def generate_user_token(self):
        token = ''.join(secrets.choice(self.alphabet) for _ in range(self.token_length))
        return token