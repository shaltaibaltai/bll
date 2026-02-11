# Настройка CORS для VK Cloud S3

## Зачем нужен CORS?

CORS (Cross-Origin Resource Sharing) необходим, чтобы ваше приложение, размещенное на GitHub Pages (или другом домене), могло получать доступ к данным в S3 бакете.

## Настройка через VK Cloud Console

1. Войдите в [VK Cloud Console](https://cloud.vk.com/)
2. Перейдите в Object Storage → Ваш бакет
3. Откройте вкладку "CORS"
4. Добавьте правило CORS

## Пример конфигурации CORS

### Для GitHub Pages:

```json
[
  {
    "AllowedOrigins": [
      "https://YOUR_USERNAME.github.io"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length",
      "Content-Type"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

### Для разработки (localhost):

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

### Универсальная конфигурация (для разработки и production):

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://YOUR_USERNAME.github.io"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length",
      "Content-Type"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

## Настройка публичного доступа

Для того чтобы все пользователи могли читать список турниров:

### Вариант 1: Публичный бакет (НЕ рекомендуется)

1. В настройках бакета включите "Публичный доступ"
2. Это сделает ВСЕ файлы в бакете публичными

### Вариант 2: Публичный файл (рекомендуется)

Сделайте публичным только файл `tournaments.json`:

1. В VK Cloud Console откройте ваш бакет
2. Найдите файл `tournaments.json`
3. Нажмите на три точки → "Изменить ACL"
4. Установите ACL: `public-read`

Или через AWS CLI:
```bash
aws s3api put-object-acl \
  --bucket YOUR_BUCKET \
  --key tournaments.json \
  --acl public-read \
  --endpoint-url https://hb.ru-msk.vkcs.cloud
```

## Bucket Policy (альтернатива)

Вместо изменения ACL можно использовать Bucket Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET/tournaments.json"
    }
  ]
}
```

## Проверка CORS

### Через curl:

```bash
curl -H "Origin: https://YOUR_USERNAME.github.io" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://YOUR_BUCKET.hb.ru-msk.vkcs.cloud/tournaments.json
```

Должен вернуть заголовок:
```
Access-Control-Allow-Origin: https://YOUR_USERNAME.github.io
```

### Через браузер:

1. Откройте DevTools (F12)
2. Перейдите на вкладку Network
3. Обновите приложение
4. Найдите запрос к tournaments.json
5. Проверьте Response Headers:
   - Должен быть `Access-Control-Allow-Origin`

## Типичные ошибки

### Ошибка: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Решение**: Добавьте CORS правило в S3 бакет

### Ошибка: "Access to fetch blocked by CORS policy"

**Решение**: Проверьте, что origin в CORS правиле совпадает с вашим доменом

### Ошибка: "The request client is not a secure context"

**Решение**: Используйте HTTPS (GitHub Pages всегда HTTPS)

## Безопасность

⚠️ **Важные моменты**:

1. **Не используйте wildcard (`*`)** в AllowedOrigins для production
2. **Ограничьте методы** только необходимыми (GET для чтения, PUT для записи)
3. **Используйте HTTPS** всегда
4. **Не храните секретные данные** в публичных файлах
5. **Настройте bucket policy** для дополнительной защиты

## Проверочный чеклист

- [ ] CORS правило добавлено
- [ ] AllowedOrigins содержит ваш домен
- [ ] AllowedMethods включает нужные методы
- [ ] Файл tournaments.json доступен публично (public-read ACL)
- [ ] CORS проверен через curl или DevTools
- [ ] Приложение загружает данные без ошибок

## Дополнительные ресурсы

- [VK Cloud CORS документация](https://cloud.vk.com/docs/storage/s3/cors)
- [AWS S3 CORS конфигурация](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
- [MDN CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
