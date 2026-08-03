import time
from multiprocessing import shared_memory
from datetime import datetime

class SharedMemoryReader:
    def __init__(self):
        self.sensor_ids = [f"MZ-DSV0{i}" for i in range(1, 8)]
        self.shm_size = 256
        self.sensor_shms = {}

    def connect_to_sensors(self):
        """Connect to all sensor shared memory blocks"""
        for sensor_id in self.sensor_ids:
            try:
                shm = shared_memory.SharedMemory(name=sensor_id, create=False)
                self.sensor_shms[sensor_id] = shm
                print(f"Connected to {sensor_id}")
            except FileNotFoundError:
                print(f"Sensor {sensor_id} SHM not found")

    def read_sensor_data(self, sensor_id):
        """Read data from specific sensor"""
        if sensor_id not in self.sensor_shms:
            return None

        try:
            shm = self.sensor_shms[sensor_id]
            raw_data = bytes(shm.buf[:self.shm_size]).split(b'\x00', 1)[0]

            if not raw_data:
                return None

            content = raw_data.decode('utf-8', errors='ignore')
            lines = content.strip().split('\n')

            data = {}
            for line in lines:
                if ':' in line:
                    key, value = line.split(':', 1)
                    data[key.strip()] = value.strip()
            
            return data
        except Exception as e:
            print(f"Error reading {sensor_id}: {e}")
            return None

    def read_all_sensors(self):
        """Read data from all sensors"""
        all_data = {}
        for sensor_id in self.sensor_ids:
            try:
                sensor_data = self.read_sensor_data(sensor_id)
                all_data[sensor_id] = sensor_data if sensor_data else {}
            except Exception as e:
                print(f"Error in {sensor_id}: {e}")
                all_data[sensor_id] = {}
        return all_data

    def close_connections(self):
        """Close all shared memory connections"""
        for shm in self.sensor_shms.values():
            shm.close()

if __name__ == "__main__":
    reader = SharedMemoryReader()
    reader.connect_to_sensors()

    try:
        while True:
            all_data = reader.read_all_sensors()
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"\n=== Sensor Data @ {timestamp} ===")
            for sensor_id, data in all_data.items():
                print(f"\n[{sensor_id}]")
                if data:
                    for k, v in data.items():
                        print(f"  {k}: {v}")
                else:
                    print("  (no data)")
            time.sleep(1)  # update every 1 second
    except KeyboardInterrupt:
        print("\nStopped by user")
    finally:
        reader.close_connections()
