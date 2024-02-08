import sys
import json
from tools.snowflake import SnowflakeIDGenerator
from tools.usertoken import UserTokenGenerator


def main():
    user_token = sys.argv[1]
    first_name = sys.argv[2]
    last_name = sys.argv[3]
    email = sys.argv[4]
    password = sys.argv[5]

    result = {"error": "Unable to update account"}

    updated = True

    if updated:
        result = {
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
            "passowrd": password,
        }

    print(json.dumps(result))

    sys.stdout.flush()


if __name__ == "__main__":
    main()
