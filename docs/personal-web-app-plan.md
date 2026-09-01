# Personal Web Application | แผนงาน

Version: 1.0
Status: **Active** — เคาะขอบเขต v1 เมื่อ 2026-08-31
Owner: ไว (world_wai / waivern)
Last Updated: 2026-08-31
Related: `Decision Log.md` (DL-004, DL-005) · `Tech Stack.md` · `Git Workflow.md` · `Coding Standard.md` · `Learning/MASTER-PLAN.md`
ClickUp: Space `Website` → Folder `Personal web application` → List `Feature`

> ⚠️ โปรเจกต์นี้เป็น **โปรเจกต์หลักของหลักสูตร full-stack** แล้ว (DL-005)
> กฎเหล็กข้อ 1 ของ `MASTER-PLAN.md` มีผลกับที่นี่: **ในชั่วโมงเรียน AI ห้ามพิมพ์โค้ดคำตอบให้**
> AI อธิบายได้ · ใบ้ได้ (ระดับ 1/2/3) · รีวิวได้ · วาดภาพได้ · แต่ไวเป็นคนพิมพ์

---

## 1. เป้าหมาย

| ชั้น | เป้า |
|---|---|
| ผลิตภัณฑ์ | เว็บส่วนตัวของ world_wai ที่มีคนอื่นสมัครสมาชิกได้ และใช้งานได้จริงบนโดเมนของไว |
| ทักษะ | ปิดช่องว่างทั้ง 5 ของ `MASTER-PLAN.md` §1 ในโปรเจกต์เดียว: วางโครงเอง · frontend · test · Docker · cloud |
| หลักฐาน | repo public ที่มี commit สม่ำเสมอ ใช้ตอบคำถามสัมภาษณ์ได้จริง |

**ของเดิมถูกทิ้งทั้งหมด** — เว็บเวอร์ชันที่ Claude Code เขียนให้ และ repo เดิมบน Git ไม่นำมาใช้ต่อ เริ่มจากโฟลเดอร์ว่าง

---

## 2. ขอบเขต

### v1 — สิ่งที่จะสร้าง

> "เว็บที่คนทั่วไปเปิดมาเจอหน้า Home ที่มี avatar + เรื่องเล่าต้นกำเนิด · ล็อกอินด้วย Google แล้วมี to-do list ส่วนตัว · ขึ้นจริงบนโดเมน"

| # | ของ | รายละเอียด |
|---|---|---|
| 1 | หน้า **Home** (มี Lore อยู่ในนั้น) | 🔴 **แก้ 2026-08-31: Lore = เรื่องเล่าต้นกำเนิดของ avatar `waivern` (ฉลามที่ฝันเป็นมังกร → ไวเวิร์น) ไม่ใช่ประวัติการทำงาน และไม่ใช่หน้าแยก — มันอยู่บนหน้า Home** · ประกอบด้วย hero (mascot + ชื่อ + tagline) · การ์ดลิงก์ฟีเจอร์ · origin story แบบพับ/กางได้ · เนื้อหาเขียนในโค้ด รูปเป็นไฟล์ static · สาธารณะ ไม่ต้องล็อกอิน |
| 2 | Login | **Google อย่างเดียว** · OAuth2/OIDC · session ของเราเอง เก็บใน cookie |
| 3 | สมาชิก | สมัครอัตโนมัติตอนล็อกอินครั้งแรก · role = `member` · ไว = `admin` |
| 4 | To-do list | ส่วนตัวของแต่ละคน · CRUD ครบ · **row-level authorization** บังคับทุก endpoint |
| 5 | PDPA ขั้นต่ำ | หน้า Privacy Policy · ปุ่มลบบัญชี (soft delete) · จุดติดต่อ `contact@waivern.org` |
| 6 | Docker | `docker compose up` ขึ้น dev environment ทั้งชุด |
| 7 | Deploy | ขึ้น Cloudflare จริง + โดเมน + CI/CD ผ่าน GitHub Actions |

### v2 — เลื่อนออกไป (ไม่ใช่ยกเลิก)

PWA ติดตั้งลงจอโฮม · Web Push แจ้งเตือน to-do · Oil price (cron + API ภายนอก) · R2 อัปโหลดไฟล์ · หน้า admin แก้ Lore (CMS) · Discord/Twitch SSO · คอมเมนต์

**เหตุผลที่ตัด:** Web Push เป็นงานยากที่สุดในลิสต์ (service worker + VAPID + permission + Cron Trigger + ข้อจำกัด iOS ที่ต้อง Add to Home Screen ก่อน) การเอามาชนกับ OAuth ซึ่งยากรองลงมา ในตอนที่ยังเขียน React ไม่คล่อง = ความเสี่ยงที่โปรเจกต์จะค้าง

---

## 3. สถาปัตยกรรม

```
ผู้ใช้เปิดเว็บ
     │
     ▼
┌──────────────┐   Cloudflare Workers #1
│   Next.js    │   deploy: wrangler deploy
└──────┬───────┘
       │ fetch('/api/...')
       ▼
┌──────────────┐   Cloudflare Workers #2
│    Hono      │
└──┬────────┬──┘
   │        │
env.DB   env.FILES
   │        │
   ▼        ▼
  D1       R2 (v2)
```

**ทำไมไม่ใช้ Nest.js:** ดู `Decision Log.md` DL-004 — สรุปสั้น: D1 คุยได้จาก Worker binding เท่านั้น · Nest เป็น Node server เต็มตัวที่ Cloudflare ไม่ซัพพอร์ตบน Workers · และ Nest สอนสิ่งที่ไวทำเป็นอาชีพมา 9 ปีแล้ว

**Docker อยู่ตรงไหน:** dev environment เท่านั้น ไม่ใช่ runtime ตอน deploy — ใส่เพราะเป็นช่องว่างที่ต้องปิด (`MASTER-PLAN.md` §4A-1) ไม่ใช่เพราะระบบขาดไม่ได้

---

## 4. โครงสร้าง repo

```
waivern-web/                    ← ชื่อ repo (เคาะแล้ว 2026-08-31)
├── apps/
│   ├── web/                    Next.js
│   └── api/                    Hono Worker
├── packages/
│   └── shared/                 type + zod schema ที่ใช้ร่วมกันสองฝั่ง
├── docker/
│   └── docker-compose.yml
├── .github/workflows/ci.yml
├── pnpm-workspace.yaml
└── package.json
```

monorepo + pnpm workspace ตาม `Git Workflow.md` · default branch `main` · protected: `main`, `develop` · ห้าม push ตรง

---

## 5. Data model (v1)

| ตาราง | ฟิลด์ | หมายเหตุ |
|---|---|---|
| `users` | id · email · display_name · avatar_url · **role** · created_at · **deleted_at** | `role` ต้องมีตั้งแต่วันแรก · `deleted_at` = ปุ่มลบบัญชี PDPA |
| `oauth_accounts` | id · user_id · provider · provider_user_id · created_at | แยกตารางตั้งแต่แรก เพื่อวันเพิ่ม Discord/Twitch ไม่ต้องรื้อ `users` |
| `sessions` | id · user_id · expires_at · created_at | session ของเรา ไม่ใช่ของ Google |
| `todos` | id · **user_id** · title · done · **due_at** · **remind_at** · created_at · updated_at | `due_at`/`remind_at` ใส่เผื่อไว้ตั้งแต่ v1 แม้ยังไม่ใช้ — กัน migration บนข้อมูลจริงตอนทำ Push ใน v2 |

**กฎบังคับ:** ทุก endpoint ที่แตะ `todos` ต้องกรอง `user_id` จาก session เสมอ ห้ามรับ `user_id` จาก request body
(ช่องโหว่ OWASP อันดับ 1: Broken Access Control — ใส่เป็นข้อบังคับใน review checklist ของทุก PR ที่แตะ API)

---

## 6. เฟสงาน + Definition of Done

| เฟส | ชื่อ | เสร็จเมื่อ (DoD) |
|---|---|---|
| **0** | Repo + วินัย | repo ใหม่บน GitHub (public) · pnpm workspace ขึ้น · branch protection ตั้งแล้ว · CI เปล่ารันเขียว · commit แรกเป็น Conventional Commits |
| **1** | Figma — wireframe | wireframe **ขาวดำ** ครบทุกหน้าของ v1 (Lore, Login, To-do, Privacy, 404) · ยังไม่มีสี ไม่มีฟอนต์สวย |
| **2** | Figma — UI + token | UI จริงครบทุกหน้า · มี design token (สี/ฟอนต์/ระยะห่าง/รัศมีมุม) เป็นชุดที่แมปลง Tailwind ได้ |
| **3** | Next.js shell | `pnpm dev` ขึ้น · routing ครบทุกหน้า · layout ตรงกับ Figma · หน้า Home เสร็จจริง · มี test อย่างน้อย 1 ตัวและรันเขียวใน CI |
| **4** | D1 + migration | schema ตาม §5 · `wrangler d1 migrations apply` ผ่านทั้ง local และ remote · มีข้อมูล seed |
| **5** | Hono API | endpoint `/api/health` + CRUD `todos` ทำงานกับ D1 จริง · มี integration test · ยังไม่มี auth |
| **6** | Login Google | ล็อกอินได้จริงบน production · สร้าง user อัตโนมัติครั้งแรก · session cookie ทำงาน · logout ได้ |
| **7** | ต่อ FE ↔ BE + สิทธิ์ | ล็อกอินแล้วเห็น to-do ของตัวเองเท่านั้น · **มี test ที่พิสูจน์ว่า user A ดึงของ user B ไม่ได้** |
| **8** | PDPA | หน้า Privacy Policy · ปุ่มลบบัญชีที่ลบจริง (soft delete + ตัดการเข้าถึง) · ทดสอบแล้ว |
| **9** | Docker dev env | `docker compose up` ขึ้นทั้ง web + api + D1 local ด้วยคำสั่งเดียว · **ไวอธิบายได้ทุกบรรทัดใน Dockerfile** (ไม่มีคอมเมนต์ที่ copy มาแล้วไม่เข้าใจ ตามบทเรียนจาก KURMS) |
| **10** | Deploy | ขึ้น production บนโดเมนจริง · CI/CD deploy อัตโนมัติจาก `main` · เปิดจากมือถือได้ |

**กฎที่ฝังทุกเฟส ไม่ใช่เฟสแยก:** เขียน test ตั้งแต่ commit แรก (มาจาก DL M4 ของ MASTER-PLAN — ไวมี 0 test ใน 595 ไฟล์ ถ้าเลื่อนไปท้ายอีกครั้ง มันจะไม่เกิด)

---

## 7. กฎการทำงาน

- 🔴 **ไม่มีตารางเรียน ไม่มี scheduled task** — ไวเปิดคาบเอง · AI ห้ามทวงความคืบหน้า (ดู `Decision Log.md` DL-006)
- ทุกการเปลี่ยนแปลงอยู่บน branch `feature/*` `bugfix/*` `docs/*` `chore/*` — ห้ามแตะ `main`/`develop` ตรง
- commit ตาม Conventional Commits ทุกครั้ง ไม่มีข้อยกเว้น
- ทุก PR ผ่าน review checklist (AI = reviewer #1, ไวอนุมัติคนสุดท้าย)
- การตัดสินใจสำคัญบันทึกลง `Decision Log.md`
- ศัพท์ใหม่ทุกคำบันทึกลง `Learning/glossary.md` ผูกกับโค้ดจริงที่ไวเขียนเอง
- ทุกรอบจบที่จุดที่พักได้ — commit + บันทึกว่าติดอะไร ห้ามทิ้งค้างกลางอากาศ (กฎเหล็กข้อ 5 ฉบับแก้)

---

## 8. ความเสี่ยงที่รู้อยู่แล้ว

| ความเสี่ยง | สัญญาณที่จะเห็น | ทำอะไร |
|---|---|---|
| ติด TypeScript ไม่ใช่ติด Next.js | คาบเรียนหมดชั่วโมงโดยแก้ type error ไม่จบ หลายคืนติดกัน | แทรกโมดูล TS สั้น ๆ ไม่ฝืนไปต่อ |
| เฟส 6 (Login) กินเวลา 2–3 เท่าที่ประเมิน | "callback ไม่กลับมา" / "cookie ไม่ติด" ค้างหลายคืน | แตกเป็นบทเรียนย่อย ไม่ปล่อยให้กัดฟันคนเดียว |
| ทำไม่จบสักฟีเจอร์ | มีมากกว่า 2 branch ค้างเกิน 2 สัปดาห์ | **ตัดฟีเจอร์ ไม่ใช่เพิ่มเวลา** |
| portfolio กลายเป็น TypeScript ล้วน ทิ้งความได้เปรียบ .NET 9 ปี | — | ดู `Decision Log.md` DL-005 · ข้อเสนอเก็บข้อสอบเฟส 9 ไว้เป็น .NET — **ไวจะตัดสินใจตอนใกล้ถึง** |

---

## 9. ยังไม่ตัดสินใจ

- ~~ชื่อ repo · โดเมน~~ → **เคาะแล้ว 2026-08-31: repo `waivern-web` · โดเมน `waivern.org` (root ไม่ใช่ subdomain)**
- path บนเครื่องที่จะวาง repo
- `Learning/MASTER-PLAN.md` Track 1 เฟส 2–9 **ยังเป็นของเดิม (.NET/GearLocker) ต้องเขียนใหม่ทั้งตาราง**
- ข้อสอบเฟส 9 จะเป็น .NET หรือ TypeScript

---

## 10. อ้างอิงเว็บเวอร์ชันเก่า (เพิ่ม 2026-08-31)

`F:\Project\personal-web-application` — Claude Code เขียน · React+Vite + Hono/Workers + D1 + Firebase push · เป็น PWA แล้ว
**ของเก่าไม่ได้เละ** มี `docs/` 11 ไฟล์ รวม `INFORMATION_ARCHITECTURE.md` (site map · nav · user flow · permission matrix) ·
`DESIGN_SYSTEM.md` · `UI_COMPONENTS.md` · migration 14 ตัว · มี `__tests__`
**เหตุผลที่รื้อคือ Claude Code เขียน ไม่ใช่ไวเขียน — ไม่ใช่เพราะคุณภาพ**

🔴 **กติกาการใช้ — แก้ตามคำสั่งไว 2026-08-31:**
ไวยืนยันว่า **นี่คือการ reset และ restart ใหม่ทั้งหมด · หน้าจอทุกหน้าออกแบบใหม่ · อาจไม่ใช้ของเดิมเลย**
จุดประสงค์คือ *ฝึกออกแบบเอง* ด้วย wireframe + UX/UI ที่กำลังจะเรียน

- ❌ **ห้ามใช้ของเก่าเป็นจุดตั้งต้นของการออกแบบ** — ห้ามเอาโครงหน้าเดิม ลำดับส่วนเดิม หรือรายการฟีเจอร์เดิมมาให้ไวเลือก
- ❌ ห้ามลอก layout · ห้ามก๊อปโค้ด
- ✅ เปิดดูได้เมื่อ **ไวขอเอง** หรือเพื่อเช็ค *ข้อเท็จจริง* ที่ไม่เกี่ยวกับดีไซน์ (เช่นข้อความ Lore ที่ไวเขียนเอง · ชื่อไฟล์รูป · migration เดิม)
- ✅ วิธีที่ถูกคือ **สอนวิธีคิดหน้าเว็บจากศูนย์** แล้วให้ไวตอบเอง ไม่ใช่ยื่นตัวเลือกจากของเดิม

**หน้าเดิม 12 หน้า:** Home · About(เรซูเม่) · Login · Register · VerifyEmail · Profile · Todos · Oil · Linda · GDD · Admin · game/*
- **Linda** = ระบบ CMS — อนาคต ไม่ใช่ตอนนี้
- **GDD_AETHORIA** = เกม — อนาคตอันไกล
- **About** (เรซูเม่/ประวัติการทำงาน) — ข้อมูลจะย้ายไปอยู่หน้า Home ไม่ทำเป็นหน้าแยก

**โครงหน้า Home เดิม (ใช้เป็นรายการเนื้อหา ไม่ใช่แบบ layout):**
1. Hero — `mascot.png` + `<h1>waivern` + tagline "แพลตฟอร์มส่วนตัว"
2. การ์ดฟีเจอร์ — Oil Price · Game · Todos (ต้องล็อกอิน) · Admin (admin เท่านั้น) · แต่ละใบมี icon + ชื่อ + คำอธิบาย + ลูกศร
3. Origin Story — ย่อหน้าแรกโชว์เสมอ + ปุ่ม "อ่านต่อ / ย่อ" กางเนื้อที่เหลือ
