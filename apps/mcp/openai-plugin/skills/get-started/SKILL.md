---
name: get-started
description: Start a lomi. merchant from chat, including identity and business checks.
---

# Get started with lomi.

A merchant who already has an account connects with OAuth at https://mcp.lomi.africa/mcp.

A new merchant starts at https://mcp.lomi.africa/mcp/guest.

1. Call `lomi_register_agent`.
2. Call `lomi_provision` with `action=create_account`. Leave the password out and send `claim_url` to the person.
3. Ask for a government ID photo. A registered business also needs the RCCM and a proof of address. Upload each file with `action=upload_document`, then `action=extract`, then `action=complete`.
4. Call `action=status` and follow `next_step` until the identity check finishes.
5. Use the test tools in that same chat. Live money stays with the person at https://dashboard.lomi.africa/connect/go-live. Do not ask for a live secret key.
