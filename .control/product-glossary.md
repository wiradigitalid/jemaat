# Product Glossary

**Loaded when:** writing any document in the corpus.

The SSOT for **product** vocabulary — what this product talks about. Every term is defined **once**
here, then used as-is across the corpus.

**Method** vocabulary lives in `.constitution/method/method-glossary.md` and MUST NOT be redefined here. The
split test: does this term still hold if used in another product? Yes → `method-glossary.md`, no →
here.

## Rules

- A new term appearing in any document MUST be added here **in the same pass**.
- A definition MUST name its relationship to other terms and its cardinality where relevant.
- One term MUST NOT have two entries.
- This file is born **empty** and filled from the product. Its first entries are born with the brief at G1.

## Entries

- **Attendance Record** — A logged record of an individual's presence or absence at a specific care group meeting or church service session. Belongs to one meeting session and references one person. (`SRS-caregroups.md` § Why, `FR-10`)
- **Blockout Date** — A date range during which a volunteer marks themselves unavailable to be scheduled for any serving roles across all ministry teams. Belongs to one person. (`SRS-serving.md` § Actor Register, `FR-8`)
- **Care Group** — A localized small group fellowship community of church members and guests meeting regularly for pastoral care and spiritual growth. Managed by one or more care group leaders; contains multiple care group members. (`SRS-caregroups.md` § Why, `FR-9`)
- **Care Group Leader** — A lay leader responsible for shepherding a care group, scheduling meetings, and logging weekly attendance. A role played by a church member. (`SRS-caregroups.md` § Actor Register, `FR-9`)
- **Care Group Member** — An individual enrolled in a specific care group who receives meeting notices and submits RSVPs. References one person and one care group. (`SRS-caregroups.md` § Actor Register, `FR-9`)
- **Church Administrator** — An office staff member or pastoral executive with administrative privileges to manage core church records, user permissions, and master settings. (`brief.md` § Who This Serves, `SRS-membership.md` § Actor Register)
- **Church Code** — A unique 6-digit alphanumeric code used by guests and members to find and join a specific church on the mobile portal. Belongs to one church profile. (`SRS-portal.md` § Actor Register, `FR-13`)
- **Family Relationship** — A typed, directional interpersonal relationship between two persons within or across households (e.g., Parent, Child, Spouse, Sibling, Guardian). Connects exactly two persons. (`SRS-membership.md` § Why, `FR-2`)
- **Guest Intake Entry** — A record representing a first-time or returning visitor who submitted contact details via mobile onboarding or the church greeting desk for follow-up. May be converted into a person record. (`SRS-portal.md` § Why, `FR-16`)
- **Household** — A residential dwelling unit containing one or more persons sharing a physical address, primary phone, and postal mailings. Contains one designated Head of Household. (`SRS-membership.md` § Why, `FR-2`)
- **Meeting Session** — A single scheduled gathering of a care group with an assigned date, time, location/host, and agenda. Belongs to one care group; has many attendance records. (`SRS-caregroups.md` § Why, `FR-9`)
- **Member Standing** — The official membership status of an individual within the church (e.g., Active Member, Regular Attendee, Inactive, Transferred Out, Deceased). Belongs to one person. (`SRS-membership.md` § Why, `FR-4`)
- **Ministry Team** — A functional department or ministry group in the church (e.g., Worship Team, Ushers, Technical & Multimedia, Children's Ministry) that organizes volunteer rosters. Contains multiple serving roles. (`SRS-serving.md` § Why, `FR-5`)
- **Notification Event** — A scheduled or triggered communication message (such as a serving reminder, attendance alert, or pastoral notification) queued for dispatch via push notification or messaging. (`SRS-portal.md` § Why, `FR-15`)
- **Person** — A distinct human record representing an individual known to the church, possessing personal identification, contact channels, and spiritual milestones. May belong to one household. (`SRS-membership.md` § Why, `FR-1`)
- **Roster Assignment** — The scheduling of a specific volunteer to fill a defined serving role for a given service schedule. Has a status of Pending, Confirmed, Declined, or Swapped. Belongs to one service schedule and references one person and one serving role. (`SRS-serving.md` § Why, `FR-6`, `FR-7`)
- **Sermon Bulletin** — A published digital service summary containing sermon title, speaker, Scripture passages, study notes, and order of service. Belongs to one service schedule. (`SRS-portal.md` § Why, `FR-12`)
- **Service Schedule** — An instance of a public church gathering (e.g., Sunday 1st Service, Midweek Prayer, Youth Service) with a specific date, time, and roster requirements. Contains multiple roster assignments. (`SRS-serving.md` § Why, `FR-6`)
- **Serving Role** — A specific duty or position within a ministry team (e.g., Worship Leader, Acoustic Guitar, Front Door Usher, Slide Operator) with defined qualifications. Belongs to one ministry team. (`SRS-serving.md` § Why, `FR-5`)
- **Volunteer** — A church member who offers their time and gifts to serve in one or more serving roles across ministry teams. References one person. (`SRS-serving.md` § Actor Register, `FR-5`)
