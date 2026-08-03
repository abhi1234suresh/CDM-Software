import socket
import struct
import time
from datetime import datetime, timezone, timedelta
from multiprocessing import shared_memory

def bytes_to_hex(data):
    return ' '.join(f'{byte:02X}' for byte in data)

def convert_time_to_ist(timestamp):
    if len(timestamp) != 6:
        return "Invalid"
    epoch = int.from_bytes(timestamp, byteorder='big')
    gmt_time = datetime.fromtimestamp(epoch, timezone.utc)
    ist = gmt_time.astimezone(timezone(timedelta(hours=5, minutes=30)))
    return ist.strftime('%Y-%m-%d %H:%M:%S')

def start_client():
    client_ip = '0.0.0.0'
    client_port = 1234
    shm_name = "M01-Z01"
    shm_size = 4096

    # Initialize shared memory
    try:
        shm = shared_memory.SharedMemory(name=shm_name, create=True, size=shm_size)
        print(f"Created shared memory: {shm_name}")
    except FileExistsError:
        shm = shared_memory.SharedMemory(name=shm_name, create=False)
        print(f"Attached to shared memory: {shm_name}")

    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65536)
        sock.bind((client_ip, client_port))
        print(f"Listening on {client_ip}:{client_port}")

        try:
            while True:
                data, addr = sock.recvfrom(65536)
                if len(data) != 190:
                    print(f"Invalid packet size: {len(data)}. Expected 190.")
                    continue

                # Parse header and timestamp
                hdr = data[:2].hex().upper()
                if hdr != "CDAC":
                    print("Invalid header")
                    continue

                packet_len = struct.unpack('>H', data[2:4])[0]
                timestamp_bytes = data[4:10]
                timestamp_str = convert_time_to_ist(timestamp_bytes)

                # Parse sensors
                sensor_offset = 10
                sensor_size = 19
                device_ids = []
                sensor_info = []

                for i in range(7):
                    start = sensor_offset + i * sensor_size
                    end = start + sensor_size
                    sensor_data = data[start:end]

                    try:
                        sid, stype, tqual, pmstat, pm10, pm25 = struct.unpack('<8s B B B f f', sensor_data)
                        sid_str = sid.decode('ascii', errors='ignore').strip('\x00')
                        stype_char = chr(stype)
                        device_ids.append(sid_str)
                        sensor_info.append(f"{sid_str}:Type={stype_char},Q={tqual},PM_Status={pmstat},PM10={pm10:.2f},PM2.5={pm25:.2f}")
                    except Exception as e:
                        print(f"Sensor {i+1} parse error: {e}")

                # Environmental data
                env_offset = sensor_offset + sensor_size * 7
                try:
                    temp_q, temp, hum_q, hum = struct.unpack('<B f B f', data[env_offset:env_offset+10])
                except Exception as e:
                    print("Env data error:", e)
                    continue

                # Compose the string content
                content_lines = []
                #content_lines.append("DeviceIDs: " + ', '.join(device_ids))
                content_lines.append(f"DeviceID:{sensor_info}")
                content_lines.append(f"Temperature_Quality: {temp_q}")
                content_lines.append(f"Temperature: {temp:.2f}")
                content_lines.append(f"Humidity_Quality: {hum_q}")
                content_lines.append(f"Humidity: {hum:.2f}")
                content_lines.append(f"Timestamp: {timestamp_str}")

                final_string = '\n'.join(content_lines)
                final_bytes = final_string.encode('utf-8')

                if len(final_bytes) > shm_size:
                    print("Shared memory too small for this data")
                else:
                    shm.buf[:len(final_bytes)] = final_bytes
                    shm.buf[len(final_bytes):] = b'\x00' * (shm_size - len(final_bytes))
                    print("Shared memory updated:\n", final_string)

        except KeyboardInterrupt:
            print("\nServer shutdown.")
        finally:
            shm.close()

if __name__ == "__main__":
    start_client()
