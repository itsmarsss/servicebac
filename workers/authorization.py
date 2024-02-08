import sys
import json


def main():
    user_token = sys.argv[1]

    result = {"authorized": False}

    if user_token == "token":
        first_name = "FN"
        last_name = "LN"
        user_id = 123
        result = {
            "authorized": True,
            "firstName": first_name,
            "lastName": last_name,
            "userID": user_id,
        }

    print(json.dumps(result))

    sys.stdout.flush()


if __name__ == "__main__":
    main()
