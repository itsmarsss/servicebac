import sys
import json
import tools.mongodbCommunicator as MongoDB


def main():
    email = sys.argv[1]
    password = sys.argv[2]

    login = {"email": email, "password": password}

    result = MongoDB.query_token_by_email_password(login)

    print(json.dumps(result))

    sys.stdout.flush()


if __name__ == "__main__":
    main()
