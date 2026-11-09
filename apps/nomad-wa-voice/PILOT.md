# WhatsApp voice pilot

This line is one Nomad number and one owner number. It is not a launch feature for every merchant.

The sidecar speaks the unofficial WhatsApp linked-device protocol. A WhatsApp update can break calls, and the number can be banned. Keep a spare number. If WhatsApp unlinks the device or blocks the number, stop the service, tell the merchant in the Nomad thread, and do not retry from the same number that day.

Run it under a process supervisor so a crash restarts it:

```
HWV_DATA_DIR=/var/lib/nomad-wa-voice
HWV_OWNER=<merchant number, digits>
HWV_TOKEN=<same as WHATSAPP_VOICE_SIDECAR_TOKEN>
HWV_LISTEN=127.0.0.1:8796
GEMINI_API_KEY=<key>
HERMES_API_URL=<lomi API origin>
HERMES_API_KEY=<same as WHATSAPP_VOICE_API_KEY>
./hermes-wa-voice serve
```

The API only offers the call tools when the person asks to be called, and only the organization in WHATSAPP_VOICE_ORGANIZATION_ID can place the call.

Official WhatsApp Business calling, evaluated 2026-11-09: Meta's Cloud API calling is the path for more than one merchant. It needs a business number and call permissions per user. Do not widen this sidecar past the pilot until that API is wired and the linked-device number has a written ban playbook above.
