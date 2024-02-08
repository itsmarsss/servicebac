import sys
import json
from tools.snowflake import SnowflakeIDGenerator
from tools.usertoken import UserTokenGenerator


def main():
    first_name = sys.argv[1]
    last_name = sys.argv[2]
    email = sys.argv[3]
    password = sys.argv[4]
    account_type = sys.argv[5]

    user_id = SnowflakeIDGenerator(0, 0).generate_id()
    user_token = UserTokenGenerator().generate_user_token()

    result = {"error": "Unable to create account"}

    created = True

    if created:
        result = {
            "firstName": first_name,
            "lastName": last_name,
            "userID": user_id,
            "userToken": user_token,
            "accountType": account_type,
        }

    print(json.dumps(result))

    sys.stdout.flush()


if __name__ == "__main__":
    main()
