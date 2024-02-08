import sys
import json


def main():
    user_token = sys.argv[1]

    first_name = "FN"
    last_name = "LN"
    user_id = 123
    account_type = "company"
    print(
        json.dumps(
            {
                "firstName": first_name,
                "lastName": last_name,
                "userID": user_id,
                "accountType": account_type,
            }
        )
    )

    sys.stdout.flush()


if __name__ == "__main__":
    main()
