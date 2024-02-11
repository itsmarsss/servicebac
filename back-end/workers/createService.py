import sys
import json
from tools.snowflake import SnowflakeIDGenerator


def main():
    service_id = SnowflakeIDGenerator(0, 0).generate_id()

    service_data = {
        "serviceId": service_id,
    }

    print(json.dumps(service_data))

    sys.stdout.flush()


if __name__ == "__main__":
    main()
