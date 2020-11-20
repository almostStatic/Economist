# Economist
--------
**__Database Managers__**
> Users with the @🛠️ Database Manager role will have access to the commands listed below.
If you do not have this permission, then all of the information disclosed here will be of no use to you.

**__Jargon__**
- "db" refers to the local database from which the bot operates on.
- "key" refers to the name of what you want to set.
- value" refers to what `<key>` represents in the db.
- "exp" refers to "expires in".
- "static" refers to values that are not edited by the bot (`Dictionary definition: Lacking in movement`).
- "snowflake" refers to a Discord User ID.

**__Commands__**
- `~get <key>` - Retrieve the value of `<key>` from the database. (Comes with Bot Staff), example: `~get bal501710994293129216`
- `~set <key> <value>` - Set `<key>` in the db with value `<value>`, example: `~set bal501710994293129216 10`
- `~delete <key> <value>` - Delete `<key>` from the db, example: `~del bal501710994293129216`

--------

**__Keys__**
**NOTE**: Please take care when editing one of the keys listed here. Although most of them have default values, it can end up instantiating errors. 
Replace `$id` with the ID of the target user whose data you wish to edit.

- `bal$id` - User's Balance
- `pet$id` - Whether or not a user owns a pet (can be anything, delete this value to remove a user's pet)
- `pet_name$id` - Name of User's pet (requires @Supreme)
- `fishc$id` - User's cooldown of `~fish` (exp 20s)
- `chillc$id` - User's cooldown of `~consume chill` (exp 6h) (**DATE**)
- `dialc$id` - User's cooldown on `~dial` (**DATE**)
- `:dolphin:$id` - Amount of :dolphin: a user has (accessible via `~items`)
- `:fish:$id` - Amount of :fish: a user has (accessible via `~items`)
- `:shark:$id` - Amount of :shark: a user has (accessible via `~items`)
- `:tropical_fish:$id` - Amount of :tropical_fish: a user has (accessible via `~items`)
- `:blowfish:$id` - Amount of :blowfish: a user has (accessible via `~items`)
- `chillpills$id` - Amount of :chillpill: a user has (accessible via `~items`)
- `pet_intellect$id` - User's Pet's intellect points
- `pet_affec$id` - User's Pet's affection points (incremented when User uses `~stroke`)
- `pet_endurance$id` - User's Pet's endurance points
- `pet_excitement$id` - User's Pet's excitement points (**NOT IMPLEMENTED**)
- `pet_credits$id` - User's Pet's credits 
- `pet_level$id` - User's Pet's level 
- `pet_energy$id` - User's Pet's energy 
- `pet_xp$id` - User's Pet's experience 
- `pet_health$id` - User's Pet's remaining health 
- `antistun$id` - User's antistun status (**STATIC**)
- `spouse$id` - ID of User's spouse (**SNOWFLAKE**)
- `stun$id` - User's stun data (stunned at and time in MS) (**OBJECT**, properties=2)
- `persist$id` - User's role persistence data (**ROLE SNOWFLAKE, ARRAY**)
- `fk$id` - Whether or not user has FK (**STRING / NULL PROTOTYPE**)

--------
## __Updates__
### September 23rd, 2020:
**__Timed Data [ie. Cooldowns]__**

With Migrating to a MongoDB to safely store balance and pet info and what else, It has been an issue at the moment setting cooldowns to *actually* delete/expire.

__**What Does this mean now?**__
The permanent and less important things (Cooldowns mostly) will stay in the old database type storage since it worked out best and is working still to do that.

**__Ok but what about mongo?__**
That too will still be existent, but only storing the more valuable information like levels and such since those don't really need to be deleted after x time.

**__Why the hell are the staff needing this information if we don't need to add to the code?__**:
As far as Setting data goes, and managing the database is concerned, the only thing you will need to note is that instead of setting the cooldowns with `set`, you would use `setcooldown`, `scd`, or even `setcd`. So it is important for you to know this.

[![Run on Repl.it](https://repl.it/badge/github/NyxrDev/Economist)](https://repl.it/github/NyxrDev/Economist)