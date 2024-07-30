import unittest
from main import encrypt, verify_password
import bcrypt


class TestPasswordManager(unittest.TestCase):

    def test_encrypt(self):
        password = "my_secure_password"
        hashed_password = encrypt(password)
        self.assertTrue(
            bcrypt.checkpw(password.encode('utf-8'), hashed_password)
        )

    def test_verify_password(self):
        password = "my_secure_password"
        hashed_password = encrypt(password)
        self.assertTrue(verify_password(hashed_password, password))
        self.assertFalse(verify_password(hashed_password, "wrong_password"))


if __name__ == '__main__':
    unittest.main()