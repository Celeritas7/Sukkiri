# Prompt for your cost management app

Copy everything below the line and paste it into the chat of your **cost management app** project.

---

Add a new section called **"Sukkiri Requests"** to my cost management app. My room-cleaning app (Sukkiri) sends purchase requests to it. Requirements:

**Data source.** Sukkiri writes requests to the localStorage key `sukkiri_cost_requests` — a JSON array of objects shaped like:

```json
{
  "source": "sukkiri",
  "type": "purchase_request",
  "status": "pending",
  "id": "req1724500000000123",
  "requestedAt": "2026-08-24T10:30:00.000Z",
  "currency": "JPY",
  "totalYen": 3000,
  "items": [
    {
      "name": "Laundry basket",
      "priceYen": 1800,
      "link": "",
      "reason": "Suggested by Sukkiri room inspection",
      "category": "Room cleaning"
    }
  ]
}
```

**What to build:**
1. A nav item **"Sukkiri Requests"** with a badge showing the count of `status: "pending"` requests.
2. The section lists requests newest first. Each card shows: request date, total in ¥, and every item with name, price, reason, and link (if any).
3. **Approve / Reject** buttons per request:
   - Approve → add each item as an expense in the app under the "Room cleaning" category, dated today, and set the request's `status` to `"approved"` with an `approvedAt` timestamp.
   - Reject → set `status` to `"rejected"`.
   - Write status changes back into the SAME `sukkiri_cost_requests` array (update the object in place, never delete or reorder entries — Sukkiri reads statuses back from this key).
4. Re-read the key on window focus and every few seconds so new requests appear without a reload.
5. Add a small **"Paste request"** fallback: a textarea where I can paste the request JSON (Sukkiri also copies it to my clipboard when I hit "Send to cost app") and import it — for when the two apps don't share localStorage.
6. Match the app's existing visual style — this is a new section, not a redesign.
