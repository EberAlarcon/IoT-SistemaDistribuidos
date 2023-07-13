from mqtt_as import config
from mqtt_as import MQTTClient

# Other imports...

import umongo

# MongoDB connection URI
MONGO_URI = "mongodb+srv://josereyes0215:Teodolinda15@cluster0.frhsy.mongodb.net/?retryWrites=true&w=majority"

# Define MongoDB document model
@umongo.instance.register
class SensorData(umongo.Document):
    temperatura = umongo.FloatField()
    humedad = umongo.FloatField()
    sensor = umongo.StrField()
    latitud = umongo.FloatField()
    longitud = umongo.FloatField()
    timestamp = umongo.IntField()

ledRed = machine.Pin(16, machine.Pin.OUT)
i2c = SoftI2C(scl=Pin(5), sda=Pin(4), freq=100000)
sensor = ahtx0.AHT20(i2c)

config['ssid'] = '.:Wifi-Uleam:.'
config['wifi_pw'] = 'U13aM.2022'

# MQTT configuration...
config['server'] = 'rat.rmq2.cloudamqp.com'  # Change to suit e.g. 'iot.eclipse.org'
config['user'] = 'scecckcu:scecckcu'
config['password'] = 'UBQj1gLTSh-3NucCEbg-i5WhHLvtOiKA'


TOPIC1 = 'uleam/fcvt/grupo6'
TopicState = "hogar/cocina/luz/state"
TopicData = "hogar/cocina/luz/data"

def activaLed(topic, msg):
    if topic == "hogar/cocina/luz/state":
        StringData = str(msg, "utf-8") #quito el caracter del caracter especial
        print(StringData)
        if StringData != "offline":
            mData=json.loads(msg.decode())#Decode the JSON string
            #print(mData)
            if mData == True:
               ledRed.value(1)
            else:
               ledRed.value(0)
def mTimeStamp():
    import utime
    TimeSeconds=utime.time()
    mTimeStamp = 946684800 + TimeSeconds
    return mTimeStamp

def querymessage(nombre):
    latitud = -0.955748 # Manta
    longitud = -80.701301 # Manta
    try:
        temp=float('{0:.2f}'.format(sensor.temperature)) # random.randint(0,50)  
        hum = float('{0:.2f}'.format(sensor.relative_humidity)) 
        message = {
        "temperatura":temp,
        "humedad":hum,
        "sensor":nombre,
        "latitud":latitud,
        "longitud":longitud,
        "timestamp":mTimeStamp()}
    except OSError as e:
        print('Failed to read sensor.')
        message = {
        "temperatura":0,
        "humedad":0,
        "sensor":nombre,
        "latitud":latitud,
        "longitud":longitud,
        "timestamp":mTimeStamp()}
    return message
def callback(topic, msg, retained):
    activaLed(topic, msg)
    print('[Consumidor-Micro] TOPIC: {}; Mensaje: {}'.format(topic, msg))
    
    # Save MQTT message to MongoDB
    data = {
        "topic": topic,
        "message": msg.decode(),
        "timestamp": mTimeStamp()
    }
    asyncio.create_task(save_mqtt_data(data))

async def save_sensor_data(data):
    sensor_data = SensorData(**data)
    await sensor_data.commit()

async def save_mqtt_data(data):
    mqtt_data = MqttData(**data)
    await mqtt_data.commit()

async def conn_han(client):
    await client.subscribe(TOPIC1, 1)
    await client.subscribe(TopicState, 1)
    await client.subscribe(TopicData, 1)

async def main(client):
    await client.connect()
    while True:
        await asyncio.sleep(5)
        
        # Publish sensor data to MQTT
        message = json.dumps(querymessage("WZM"))
        await client.publish(TOPIC1, message, qos=1)
        pixels.fill((255,255,0))
        pixels.write()
        await asyncio.sleep(1)
        pixels.fill((0,0,0))
        pixels.write()
        print('Mensaje publicado')

        # Save sensor data to MongoDB
        sensor_data = querymessage("WZM")
        await save_sensor_data(sensor_data)

        # Query data from MongoDB and publish to MQTT
        mqtt_data = await MqttData.find().to_list(length=None)
        for data in mqtt_data:
            await client.publish(TopicData, data.message, qos=1)

config['subs_cb'] = callback
config['connect_coro'] = conn_han
MQTTClient.DEBUG = True
client = MQTTClient(config)

# MongoDB client setup
mongo_client = umongo.MongoClient(
    MONGO_URI,
    io_loop=asyncio.get_event_loop()
)
db = mongo_client.db

# Set the collection to "sensor"
SensorData = db.sensor

try:
    asyncio.run(main(client))
finally:
    client.close()
