# Деплой на GitHub Pages

## Автоматический деплой через GitHub Actions

### Шаг 1: Создание репозитория

1. Создайте новый репозиторий на GitHub
2. Инициализируйте git в папке проекта:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Шаг 2: Настройка GitHub Pages

1. Перейдите в Settings → Pages вашего репозитория
2. В разделе "Source" выберите:
   - Source: **GitHub Actions**

### Шаг 3: Деплой

После push в ветку `main`, GitHub Actions автоматически:
1. Установит зависимости
2. Соберет проект
3. Задеплоит на GitHub Pages

Ваше приложение будет доступно по адресу:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

### Шаг 4: Настройка Telegram бота

1. Откройте [@BotFather](https://t.me/botfather)
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Bot Settings → Menu Button → Configure menu button
5. Введите URL GitHub Pages:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## Ручной деплой (альтернатива)

Если вы хотите деплоить вручную:

```bash
# Установите gh-pages
npm install -D gh-pages

# Добавьте в package.json скрипт
"deploy": "npm run build && gh-pages -d dist"

# Запустите деплой
npm run deploy
```

## Проверка деплоя

После успешного деплоя:

1. ✅ Откройте URL в браузере
2. ✅ Проверьте, что приложение загружается
3. ✅ Откройте через Telegram бота
4. ✅ Проверьте функционал

## Устранение проблем

### Приложение не загружается

**Проблема**: Белый экран или 404
- Проверьте, что GitHub Pages настроен на "GitHub Actions"
- Убедитесь, что workflow запустился (вкладка Actions)
- Проверьте base path в vite.config.ts

### CORS ошибки

**Проблема**: Не загружаются данные из S3
- Настройте CORS в VK Cloud S3 бакете:

```json
[
  {
    "AllowedOrigins": ["https://YOUR_USERNAME.github.io"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### Telegram WebApp не работает

**Проблема**: Приложение не открывается в Telegram
- Убедитесь, что URL использует HTTPS (GitHub Pages всегда HTTPS)
- Проверьте, что скрипт Telegram загружен в index.html
- Попробуйте очистить кэш Telegram

## Обновление приложения

После внесения изменений:

```bash
git add .
git commit -m "Update features"
git push
```

GitHub Actions автоматически задеплоит новую версию через ~2-3 минуты.

## Мониторинг деплоя

Отслеживайте статус деплоя:
1. Перейдите во вкладку **Actions** репозитория
2. Выберите последний workflow run
3. Проверьте логи build и deploy

## Custom Domain (опционально)

Если у вас есть свой домен:

1. В Settings → Pages → Custom domain введите ваш домен
2. Настройте DNS записи у провайдера:
```
Type: CNAME
Host: www (или @)
Value: YOUR_USERNAME.github.io
```

3. Дождитесь проверки домена
4. Включите "Enforce HTTPS"

## Переменные окружения

Для GitHub Pages переменные окружения нужно задавать через vite:

1. Создайте файл `.env.production`:
```
VITE_S3_ENDPOINT=https://hb.ru-msk.vkcs.cloud
VITE_S3_REGION=eu-central-1
VITE_PUBLIC_BUCKET=your-bucket-name
```

2. НЕ коммитьте этот файл (уже в .gitignore)
3. Для публичного чтения настройте бакет с публичным доступом

## Безопасность

⚠️ **Важно**:
- НЕ храните секретные ключи в коде
- НЕ коммитьте `.env` файлы с credentials
- Используйте SecureStorage для токенов администратора
- Настройте bucket policies для ограничения доступа

## Производительность

Для оптимизации:

1. **Включите кэширование** в S3
2. **Минифицируйте ресурсы** (vite делает автоматически)
3. **Используйте CDN** для статики
4. **Lazy loading** для страниц (уже настроено через React Router)

## Checklist перед деплоем

- [ ] Код работает локально (`npm run dev`)
- [ ] Сборка проходит без ошибок (`npm run build`)
- [ ] S3 бакет настроен и доступен
- [ ] CORS настроен правильно
- [ ] GitHub Actions workflow добавлен
- [ ] GitHub Pages настроен на "GitHub Actions"
- [ ] Telegram бот создан
- [ ] Menu button настроен с правильным URL
- [ ] Приложение протестировано в Telegram

## Полезные команды

```bash
# Локальная разработка
npm run dev

# Сборка
npm run build

# Предпросмотр production билда
npm run preview

# Проверка типов
npx tsc --noEmit

# Очистка кэша
rm -rf node_modules dist
npm install
npm run build
```

## Ресурсы

- [GitHub Pages документация](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vite документация](https://vitejs.dev/)
- [Telegram WebApp API](https://core.telegram.org/bots/webapps)
