# import time
# import struct
# from datetime import datetime, timezone, timedelta
# from multiprocessing import shared_memory

# SOURCE_SHM = "M01-Z01"
# SOURCE_SHM_SIZE = 4096
# SENSOR_COUNT = 7
# SENSOR_BLOCK_SIZE = 19
# ENV_BLOCK_SIZE = 10
# SENSOR_SHM_SIZE = 512


# def start_splitter_and_viewer():
#     try:
#         source_shm = shared_memory.SharedMemory(name=SOURCE_SHM)
#         print(f"[INFO] Sensor Splitter started. Watching SHM: {SOURCE_SHM}")
#     except FileNotFoundError:
#         print(f"[ERROR] Source SHM {SOURCE_SHM} not found.")
#         return

#     created_shms = {}

#     try:
#         while True:
#             data = bytes(source_shm.buf[:SOURCE_SHM_SIZE]).split(b'\x00', 1)[0]
#             if not data:
#                 print("[!] No data yet. Waiting...")
#                 time.sleep(1)
#                 continue

#             lines = data.decode('utf-8', errors='ignore').split('\n')
#             device_lines = [line for line in lines if line.startswith("DeviceID:")]
#             temp_q_line = next((line for line in lines if "Temperature_Quality:" in line), "Temperature_Quality: NaN")
#             temp_line   = next((line for line in lines if "Temperature:" in line), "Temperature: NaN")
#             hum_q_line  = next((line for line in lines if "Humidity_Quality:" in line), "Humidity_Quality: NaN")
#             hum_line    = next((line for line in lines if "Humidity:" in line), "Humidity: NaN")
#             ts_line     = next((line for line in lines if "Timestamp:" in line), "Timestamp: Unknown")

#             if not device_lines:
#                 print("[!] No sensor data found in SHM.")
#                 time.sleep(1)
#                 continue

#             sensor_data_list = eval(device_lines[0].split("DeviceID:")[1].strip())

#             for sensor_str in sensor_data_list:
#                 sid = sensor_str.split(":")[0].strip()
#                 content = (
#                     f"{sensor_str}\n"
#                     f"{temp_q_line}\n"
#                     f"{temp_line}\n"
#                     f"{hum_q_line}\n"
#                     f"{hum_line}\n"
#                     f"{ts_line}"
#                 )
#                 encoded = content.encode('utf-8')

#                 if sid not in created_shms:
#                     try:
#                         shm = shared_memory.SharedMemory(name=sid, create=True, size=SENSOR_SHM_SIZE)
#                         print(f"[+] Created SHM: {sid}")
#                     except FileExistsError:
#                         shm = shared_memory.SharedMemory(name=sid)
#                     created_shms[sid] = shm
#                 else:
#                     shm = created_shms[sid]

#                 # Write to sensor SHM
#                 shm.buf[:len(encoded)] = encoded
#                 shm.buf[len(encoded):] = b'\x00' * (SENSOR_SHM_SIZE - len(encoded))
#                 print(f"[→] Wrote to SHM: {sid}")

#                 # Also immediately read back and print
#                 content_bytes = bytes(shm.buf[:SENSOR_SHM_SIZE]).split(b'\x00', 1)[0]
#                 content_str = content_bytes.decode('utf-8', errors='ignore')
#                 print(f"{sid} [→] SHM Content:\n{content_str}\n{'-'*50}")

#             time.sleep(1)

#     except KeyboardInterrupt:
#         print("\n[EXIT] Sensor Splitter stopped.")
#     finally:
#         source_shm.close()
#         for shm in created_shms.values():
#             shm.close()

# if __name__ == "__main__":
#     start_splitter_and_viewer()




# # def convert_time_to_ist(timestamp):
# #     if len(timestamp) != 6:
# #         return "Invalid"
# #     epoch = int.from_bytes(timestamp, byteorder='big')
# #     gmt_time = datetime.fromtimestamp(epoch, timezone.utc)
# #     ist = gmt_time.astimezone(timezone(timedelta(hours=5, minutes=30)))
# #     return ist.strftime('%Y-%m-%d %H:%M:%S')



import ast
import time
from datetime import datetime
from multiprocessing import shared_memory

# Constants
SOURCE_SHM_NAME = "M01-Z01"
SOURCE_SHM_SIZE = 1024
SENSOR_IDS = [f"MZ-DSV0{i}" for i in range(1, 8)]
SENSOR_SHM_SIZE = 256

# Dictionary to hold per-sensor SHM objects
sensor_shms = {}

# -----------------------------
# Parse raw bytes from source SHM into sensor + environment dicts
# -----------------------------
def parse_source_data(raw_bytes):
    try:
        text = bytes(raw_bytes).split(b'\x00', 1)[0].decode()
        lines = text.strip().splitlines()

        sensors = {}
        env = {
            "Temperature": "0",
            "Temperature_Quality": "NA",
            "Humidity": "0",
            "Humidity_Quality": "NA",
            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        for line in lines:
            if line.startswith("DeviceID:"):
                sensor_list = ast.literal_eval(line.split("DeviceID:")[1])
                for entry in sensor_list:
                    sensor_id, kv_str = entry.split(":", 1)
                    kv_pairs = kv_str.split(",")
                    data_dict = {}
                    for pair in kv_pairs:
                        if "=" in pair:
                            k, v = pair.split("=")
                            data_dict[k.strip()] = v.strip()

                    sensors[sensor_id] = {
                        "Type": data_dict.get("Type", "NA"),
                        "Q": data_dict.get("Q", "NA"),
                        "PM_Status": data_dict.get("PM_Status", "NA"),
                        "PM10": data_dict.get("PM10", "0"),
                        "PM2.5": data_dict.get("PM2.5", "0"),
                    }

            elif "Temperature_Quality:" in line:
                env["Temperature_Quality"] = line.split(":", 1)[1].strip()
            elif "Temperature:" in line:
                env["Temperature"] = line.split(":", 1)[1].strip()
            elif "Humidity_Quality:" in line:
                env["Humidity_Quality"] = line.split(":", 1)[1].strip()
            elif "Humidity:" in line:
                env["Humidity"] = line.split(":", 1)[1].strip()
            elif "Timestamp:" in line:
                env["Timestamp"] = line.split(":", 1)[1].strip()

        # Merge environment data into each sensor entry
        for sensor_id in sensors:
            sensors[sensor_id].update(env)

        return sensors

    except Exception as e:
        print(f"[ERROR] Failed to parse source data: {e}")
        return {}

# -----------------------------
# Create or attach to sensor SHMs
# -----------------------------
def init_shms():
    for sensor_id in SENSOR_IDS:
        try:
            shm = shared_memory.SharedMemory(name=sensor_id, create=True, size=SENSOR_SHM_SIZE)
        except FileExistsError:
            shm = shared_memory.SharedMemory(name=sensor_id)
        sensor_shms[sensor_id] = shm

# -----------------------------
# Write dictionary to SHM
# -----------------------------
def write_sensor_shm(sensor_id, data_dict):
    shm = sensor_shms.get(sensor_id)
    if not shm:
        return

    lines = [f"{k}:{v}" for k, v in data_dict.items()]
    content = "\n".join(lines)
    encoded = content.encode()

    if len(encoded) >= SENSOR_SHM_SIZE:
        encoded = encoded[:SENSOR_SHM_SIZE - 1]  # Leave room for null terminator

    buf = shm.buf
    buf[:SENSOR_SHM_SIZE] = bytearray(SENSOR_SHM_SIZE)  # zero-fill
    buf[:len(encoded)] = encoded

# -----------------------------
# View SHM content for debugging
# -----------------------------
def view_shm(name, size):
    try:
        shm = shared_memory.SharedMemory(name=name)
        raw = bytes(shm.buf[:size]).split(b'\x00', 1)[0].decode()
        print(f"[{name}] SHM:\n{raw}\n{'-'*50}")
    except FileNotFoundError:
        print(f"[{name}] SHM not found")

# -----------------------------
# Main loop
# -----------------------------
def start_unified_splitter():
    print("[INFO] Unified Sensor Splitter started.\n")

    init_shms()

    try:
        source_shm = shared_memory.SharedMemory(name=SOURCE_SHM_NAME)
    except FileNotFoundError:
        print(f"[ERROR] Source SHM '{SOURCE_SHM_NAME}' not found.")
        return

    try:
        while True:
            raw = bytes(source_shm.buf[:SOURCE_SHM_SIZE]).split(b'\x00', 1)[0]
            if not raw:
                print("[!] No data yet. Waiting...")
                time.sleep(1)
                continue

            sensor_data = parse_source_data(raw)
            if not sensor_data:
                time.sleep(1)
                continue

            for sensor_id in SENSOR_IDS:
                data = sensor_data.get(sensor_id, {})
                write_sensor_shm(sensor_id, data)
                view_shm(sensor_id, SENSOR_SHM_SIZE)

            time.sleep(1)

    except KeyboardInterrupt:
        print("\n[INFO] Unified Sensor Splitter stopped.")
    finally:
        source_shm.close()
        for shm in sensor_shms.values():
            shm.close()

# -----------------------------
if __name__ == "__main__":
    start_unified_splitter()
