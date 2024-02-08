import sys
import json
from tools.snowflake import SnowflakeIDGenerator
from tools.usertoken import UserTokenGenerator


def main():
    user_id = SnowflakeIDGenerator(0, 0).generate_id()
    user_token = UserTokenGenerator().generate_user_token()

    user_data = {
        "userId": user_id,
        "userToken": user_token,
    }

    print(json.dumps(user_data))

    sys.stdout.flush()


if __name__ == "__main__":
    main()
