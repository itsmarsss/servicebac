import sys
import json
from usertoken import UserTokenGenerator

def main():
    email = sys.argv[1]
    password = sys.argv[2]

    first_name = "FN"
    last_name = "LN"
    user_id = 1234
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