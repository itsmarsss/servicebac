import time


class SnowflakeIDGenerator:
    def __init__(self, worker_id, datacenter_id, sequence=0):
        self.epoch = 1420070400000  # Custom epoch for better readability (1st Jan 2015)
        self.worker_id_bits = 5
        self.datacenter_id_bits = 5
        self.max_worker_id = -1 ^ (-1 << self.worker_id_bits)
        self.max_datacenter_id = -1 ^ (-1 << self.datacenter_id_bits)
        self.sequence_bits = 12
        self.worker_id_shift = self.sequence_bits
        self.datacenter_id_shift = self.sequence_bits + self.worker_id_bits
        self.timestamp_shift = (
            self.sequence_bits + self.worker_id_bits + self.datacenter_id_bits
        )
        self.sequence_mask = -1 ^ (-1 << self.sequence_bits)

        if worker_id > self.max_worker_id or worker_id < 0:
            raise ValueError(
                "Worker ID must be between 0 and {}".format(self.max_worker_id)
            )
        if datacenter_id > self.max_datacenter_id or datacenter_id < 0:
            raise ValueError(
                "Datacenter ID must be between 0 and {}".format(self.max_datacenter_id)
            )

        self.worker_id = worker_id
        self.datacenter_id = datacenter_id
        self.sequence = sequence
        self.last_timestamp = -1

    def generate_id(self):
        timestamp = int(time.time() * 1000) - self.epoch

        if timestamp == self.last_timestamp:
            self.sequence = (self.sequence + 1) & self.sequence_mask
            if self.sequence == 0:
                timestamp = self.wait_for_next_timestamp()
        else:
            self.sequence = 0

        self.last_timestamp = timestamp

        new_id = (
            (timestamp << self.timestamp_shift)
            | (self.datacenter_id << self.datacenter_id_shift)
            | (self.worker_id << self.worker_id_shift)
            | self.sequence
        )
        return new_id

    def wait_for_next_timestamp(self):
        timestamp = int(time.time() * 1000) - self.epoch
        while timestamp <= self.last_timestamp:
            timestamp = int(time.time() * 1000) - self.epoch
        return timestamp
