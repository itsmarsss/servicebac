import sys
import json


def main():
    email = sys.argv[1]
    password = sys.argv[2]

    results = { "result": "Forbidden"}

    authorized = True

    if authorized:
        user_token = "abcdefg"
        results = {"userToken": user_token}

    print(json.dumps(results))

    sys.stdout.flush()


if __name__ == "__main__":
    main()
