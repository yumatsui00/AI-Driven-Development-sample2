# Feature Seed

## 1. Summary (必須・短く)
ログイン、サインアップ、サインアウトの機能を作成する。DBはdb/user.csvで管理する。
フロントは作成する必要がない。
userテーブルに必要なものは
id(uuid)
name(string)
email(string)
password(string)
created_at
updated_at
---

## 2. Purpose / 背景
ログイ機能の実装

---

## 3. Requirements (箇条書きでOK)
・AGENTS.mdを参照すること。
・emailの重複は許さない
・passwordはハッシュ化する必要はない
・サインアップに必要なのは、name, email, password
・ログインに必要なのはemail, password
・timestamp format (UTC ISO-8601)
---

## 4. Scope
### In Scope
・ログイン、サインイン、サインアウトの機能

### Out of Scope
フロントの修正
---

## 5. UI Notes (あれば)


---

## 6. Edge Cases / Constraints



