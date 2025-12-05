# Feature Seed

## 1. Summary (必須・短く)
ログイン機能の統合。src/app/page.tsx上にあるログインボタンからログインを行った人のみが、ログインした人専用のページに遷移できるようにする。
---

## 2. Purpose / 背景
ログイン機能の統合
---

## 3. Requirements (箇条書きでOK)
・ログインした人はlocalstrageにlogin=Trueが保存される。（この機能がない場合はこれも追加しておく）
・それらの確認はmiddlewareで行う
・src/app/page.tsx以外のページに未ログインの人が遷移しようとすると、そこに戻される
・ログイン、サインアップを行った人はsrc/app/home/page.tsxに遷移する
・そのためのsrc/app/home/page.tsxも作成するが、デザインは適当で構わない。
・ただし、サインアウトのボタンを配置しておく
---

## 4. Scope
### In Scope
・ログイン、サインイン、サインアウトの機能の修正、統合
・

### Out of Scope
---

## 5. UI Notes (あれば)


---

## 6. Edge Cases / Constraints



