import sys
import json

def main():
    user_token = sys.argv[1]
    
    if user_token == "token":
        first_name = "FN"
        last_name = "LN"
        user_id = "123"
        print(json.dumps(
        {
            "authorized": True,
            "firstName": first_name,
            "lastName": last_name,
            "userID": user_id
        }
        ))

        sys.stdout.flush()
        sys.exit(0)
    
    print(json.dumps(
        {
            "authorized": False
        }
        ))

    sys.stdout.flush()

if __name__ == '__main__':
    main()