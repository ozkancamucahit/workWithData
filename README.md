# workWithData

Developed by following *Youtube series from Daniel Shiffman : [link](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X)*

Added api end points for ESP32 Arduino board.

ESP32 can subscribe to youtube notifications from specific channel id.
When channel uploads a new video or changes videos description a notification is sent with MQTT protocol.
MQTT message payload includes : video title, upload time, updated time and video owner.

Can be deployed to azure web services and logs can be streamed or viewed.

