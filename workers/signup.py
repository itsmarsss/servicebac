import sys
import json
from snowflake import SnowflakeIDGenerator
from usertoken import UserTokenGenerator

def main():
    first_name = sys.argv[1]
    last_name = sys.argv[2]
    email = sys.argv[3]
    password = sys.argv[4]

    user_id = SnowflakeIDGenerator(0, 0).generate_id()
    user_token = UserTokenGenerator().generate_user_token()

    print(json.dumps(
        {
            "firstName": first_name,
            "lastName": last_name,
            "userID": user_id,
            "userToken": user_token
        }
        ))

    sys.stdout.flush()

if __name__ == '__main__':
    main()