# Data Model (Draft)

All tenant-scoped tables include `venue_id UUID NOT NULL`.

## users
```
id UUID PRIMARY KEY
venue_id UUID NOT NULL
email TEXT UNIQUE
hashed_password TEXT NULL
display_name TEXT
roles JSONB -- e.g., ["player","staff:operator"]
created_at timestamptz
updated_at timestamptz
```

## devices
```
id UUID PRIMARY KEY
venue_id UUID NOT NULL
name TEXT
type TEXT -- e.g., pc, console, seat
status TEXT -- available,reserved,in_use,offline
last_heartbeat timestamptz
metadata JSONB
```

## bookings
```
id UUID PRIMARY KEY
venue_id UUID NOT NULL
user_id UUID NULL
device_id UUID NULL
start_time timestamptz
end_time timestamptz
status TEXT -- reserved,active,completed,cancelled
price_cents bigint
payment_id UUID NULL
created_at timestamptz
```

## payments
```
id UUID PRIMARY KEY
venue_id UUID NOT NULL
booking_id UUID NULL
user_id UUID NULL
amount_cents bigint
currency TEXT
stripe_charge_id TEXT
status TEXT -- pending,completed,refunded
reconcile_status TEXT
created_at timestamptz
```

## memberships
```
id UUID PRIMARY KEY
venue_id UUID NOT NULL
user_id UUID
tier TEXT -- bronze/silver/gold
stripe_subscription_id TEXT
perks JSONB
starts_at timestamptz
ends_at timestamptz
```

## coins
```
id UUID PRIMARY KEY
user_id UUID
venue_id UUID NOT NULL
balance bigint
ledger JSONB -- append-only entries
```

## events
```
id UUID PRIMARY KEY
venue_id UUID NOT NULL
name TEXT
start_time timestamptz
end_time timestamptz
rules_json JSONB
```

Indices: tenant+id composite indices and time-based indices for queries.
