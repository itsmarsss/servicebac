import sys
import json
from tools.snowflake import SnowflakeIDGenerator
from tools.usertoken import UserTokenGenerator
import tools.mongodbCommunicator as MongoDB


def main():
    user_id = SnowflakeIDGenerator(0, 0).generate_id()
    user_token = UserTokenGenerator().generate_user_token()

    first_name = sys.argv[1]
    last_name = sys.argv[2]
    email = sys.argv[3]
    password = sys.argv[4]
    account_type = sys.argv[5]

    user = {
        "userId": user_id,
        "userToken": user_token,
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "password": password,
        "accountType": account_type,
    }

    result = MongoDB.insert_user(user)

    print(json.dumps(result))

    sys.stdout.flush()


if __name__ == "__main__":
    main()
