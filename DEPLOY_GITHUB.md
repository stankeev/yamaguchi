# Деплой проекта на GitHub

## 1) Создать репозиторий на GitHub
- На GitHub нажмите **New repository**.
- Название, например: `yamaguchi-id-prototype`.
- Не добавляйте README (если пушите уже готовую локальную папку).

## 2) Запушить локальные файлы
Откройте терминал в папке проекта и выполните:

```bash
cd /Users/mikhail/Documents/Codex
git init
git add .
git commit -m "Mobile auth redesign prototype"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/yamaguchi-id-prototype.git
git push -u origin main
```

Если Git попросит логин/пароль, используйте GitHub PAT (Personal Access Token).

## 3) Опубликовать как сайт через GitHub Pages
- Откройте репозиторий на GitHub.
- Зайдите: **Settings → Pages**.
- В `Build and deployment` выберите:
  - `Source`: **Deploy from a branch**
  - `Branch`: **main**
  - `Folder`: **/ (root)**
- Нажмите **Save**.
- Через 1-2 минуты сайт будет доступен по адресу:
  `https://<YOUR_USERNAME>.github.io/yamaguchi-id-prototype/`

## 4) Обновления
После новых изменений:

```bash
git add .
git commit -m "Update auth flow"
git push
```

GitHub Pages обновится автоматически.
