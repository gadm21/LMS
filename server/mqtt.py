#!/usr/bin/env python3

"""
MQTT Client Module

This module provides MQTT client functionality for real-time notifications.
It handles connecting to an MQTT broker and publishing messages.
"""

import logging
import os
import json
from typing import Optional

import paho.mqtt.client as mqtt
import random
import string


# MQTT client configuration
mqtt_client = None
connected = False

# MQTT Broker Configuration - can be overridden with environment variables
MQTT_BROKER_HOST = os.environ.get("MQTT_BROKER_HOST", "localhost")
MQTT_BROKER_PORT = int(os.environ.get("MQTT_BROKER_PORT", "1883"))
MQTT_BROKER_TIMEOUT = int(os.environ.get("MQTT_BROKER_TIMEOUT", "60"))
MQTT_USE_WEBSOCKET = False

logging.info(f"MQTT Broker configured as {MQTT_BROKER_HOST}:{MQTT_BROKER_PORT} with timeout {MQTT_BROKER_TIMEOUT}s")

# Enable Paho MQTT client logging for debugging
# This can be very verbose
mqtt_logger = logging.getLogger('paho')
mqtt_logger.setLevel(logging.DEBUG)

def setup_mqtt():
    """Initialize and connect the MQTT client.

    Attempts to connect to the configured MQTT broker for message publishing.
    Stores the client in a module-level variable.

    Returns:
        bool: True if connection was successful, False otherwise

    Example:
        >>> success = setup_mqtt()
        >>> print(f"MQTT connected: {success}")
    """
    global mqtt_client, connected

    # Create MQTT client if it doesn't exist
    if mqtt_client is None:
        # Generate a unique client ID suffix
        unique_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        client_id = f"ai-chat-bot-server-{unique_suffix}"
        logging.info(f"Initializing MQTT client with ID: {client_id}")
        mqtt_client = mqtt.Client(client_id=client_id, callback_api_version=mqtt.CallbackAPIVersion.VERSION2, transport="websockets" if MQTT_USE_WEBSOCKET else "tcp")
        mqtt_client.enable_logger(mqtt_logger)

    # Connect to the broker if not already connected
    if not connected:
        try:
            logging.info(f"Attempting to connect to MQTT broker at {MQTT_BROKER_HOST}:{MQTT_BROKER_PORT} using {'WebSocket' if MQTT_USE_WEBSOCKET else 'TCP'}...")
            mqtt_client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, MQTT_BROKER_TIMEOUT)
            mqtt_client.on_connect = on_connect
            mqtt_client.on_disconnect = on_disconnect
            mqtt_client.on_message = on_message
            mqtt_client.subscribe("tab/info")
            mqtt_client.loop_start()
            connected = True
            logging.info(f"Successfully connected to MQTT broker at {MQTT_BROKER_HOST}:{MQTT_BROKER_PORT}")
        except Exception as e:
            connected = False
            logging.error(f"Failed to connect to MQTT broker at {MQTT_BROKER_HOST}:{MQTT_BROKER_PORT}: {str(e)}")
            logging.info("Continuing server operation without MQTT connectivity. Some features may be unavailable.")
    return connected


def on_connect(client, userdata, flags, rc, properties=None):
    """Callback for when the client receives a CONNACK response from the server."""
    if rc == 0:
        logging.info("Connected to MQTT broker with result code " + str(rc))
    else:
        logging.error(f"Failed to connect to MQTT broker with result code {rc}")


def on_disconnect(client, userdata, disconnect_flags, reason_code, properties=None):
    """Callback for when the client disconnects from the server."""
    global connected
    connected = False
    logging.info(f"Disconnected from MQTT broker. Reason Code: {reason_code}, Flags: {disconnect_flags}")
    if reason_code != mqtt.MQTT_ERR_SUCCESS and not disconnect_flags.is_disconnect_packet_from_server:
        logging.warning("Unexpected disconnection from MQTT broker.")
    else:
        logging.info("MQTT disconnection was expected or initiated by server.")


def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    """Callback for when the client subscribes to a topic."""
    logging.info(f"Subscription successful with message ID {mid} and granted QoS {granted_qos}")


def on_message(client, userdata, msg, properties=None):
    """Callback for when a PUBLISH message is received from the server."""
    topic = msg.topic
    payload_raw = msg.payload.decode()
    logging.info(f"Received message on topic '{topic}'") # Don't log payload directly in production if sensitive

    if topic == "tab/info":
        try:
            tab_data = json.loads(payload_raw)
            logging.debug(f"Processing tab/info message: {tab_data.get('url', 'N/A')}")
            pass 

        except json.JSONDecodeError:
            logging.error(f"Failed to decode JSON payload on topic '{topic}': {payload_raw}")
        except Exception as e:
            logging.error(f"Error processing message on topic '{topic}': {e}", exc_info=True)

    # Add elif for other topics if needed
    # elif topic == "some/other/topic":
    #     pass

    else:
        logging.debug(f"Ignoring message on unhandled topic: {topic}")


def publish_message(topic, message):
    """Publish a message to an MQTT topic.

    Ensures the MQTT client is connected and then publishes the message
    to the specified topic.

    Args:
        topic (str): The MQTT topic to publish to
        message (str): The message payload to publish

    Returns:
        bool: True if publish was successful, False otherwise

    Example:
        >>> success = publish_message("walnut/status", "Server started")
        >>> print(f"Message published: {success}")
    """
    global mqtt_client

    # Ensure MQTT is set up
    if not connected:
        logging.warning("Cannot publish message: Not connected to MQTT broker")
        try:
            setup_mqtt()
            if not connected:
                logging.error("Failed to reconnect to MQTT broker for message publishing")
                return False
        except Exception as e:
            logging.error(f"Error attempting to reconnect to MQTT broker: {str(e)}")
            return False

    # Publish the message
    try:
        result = mqtt_client.publish(topic, message)
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            logging.info(f"Successfully published message to topic {topic}")
            return True
        else:
            logging.error(f"Failed to publish message to topic {topic}. Return code: {result.rc}")
            return False
    except Exception as e:
        logging.error(f"Exception while publishing message to topic {topic}: {str(e)}")
        return False


def disconnect():
    """Disconnect the MQTT client.

    Properly terminates the MQTT connection if it exists.

    Example:
        >>> disconnect()
        >>> print("MQTT client disconnected")
    """
    global mqtt_client, connected

    if mqtt_client and connected:
        try:
            mqtt_client.loop_stop()
            mqtt_client.disconnect()
            logging.info("MQTT client disconnected")
        except Exception as e:
            logging.warning(f"Error disconnecting MQTT client: {e}")
        finally:
            connected = False
