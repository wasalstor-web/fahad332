# دليل نشر مشروع LogiSa على VPS

## المتطلبات
- Ubuntu 22+ (أو 20) مع صلاحيات sudo
- Node.js 20
- Git
- Nginx
- SQLite (افتراضي داخل الملف)

## 1. إعداد المستخدم والمجلد
```bash
sudo adduser deploy --disabled-password --gecos ""
sudo usermod -aG sudo deploy
sudo mkdir -p /srv/logisa
sudo chown deploy:deploy /srv/logisa
```

## 2. تثبيت الحزم
```bash
sudo apt update
sudo apt install -y curl git sqlite3 nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 3. جلب الكود
```bash
sudo -u deploy bash -c 'cd /srv/logisa && git clone https://github.com/wasalstor-web/fahad332.git .'
cd /srv/logisa
git checkout copilot/add-integration-repository-setup
cp .env.example .env
nano .env  # ضع مفاتيحك
```

## 4. بناء وتشغيل
```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

## 5. خدمة systemd
```bash
sudo cp deploy/logisa.service.example /etc/systemd/system/logisa.service
sudo systemctl daemon-reload
sudo systemctl enable logisa
sudo systemctl start logisa
sudo systemctl status logisa
```

## 6. Nginx
```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/logisa.conf
sudo ln -sf /etc/nginx/sites-available/logisa.conf /etc/nginx/sites-enabled/logisa.conf
sudo nginx -t && sudo systemctl reload nginx
```

## 7. HTTPS (اختياري)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 8. تحديثات سريعة
```bash
cd /srv/logisa
git pull origin copilot/add-integration-repository-setup
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
systemctl restart logisa
```

## 9. نشر تلقائي (GitHub Actions)
أسرار مطلوبة:
- SSH_HOST
- SSH_USER
- SSH_KEY (مفتاح خاص بصيغة نص)
- APP_DIR (مثال /srv/logisa)

Workflow موجود: `.github/workflows/deploy-ssh.yml`

## 10. متغيرات البيئة المهمة
| المتغير | الوصف |
|---------|-------|
| PORT | منفذ الخادم الداخلي (افتراضي 3000) |
| CORS_ORIGIN | نطاق الواجهة للـ CORS |
| DATABASE_URL | مسار قاعدة بيانات SQLite |
| MAPIT_API_KEY / MAPIT_WEBHOOK_SECRET | تكامل MAPIT |
| MYFATORA_API_KEY / MYFATORA_WEBHOOK_SECRET | تكامل الدفع MyFatora |
| GEMINI_API_KEY / API_KEY | مفاتيح Gemini / AI |
| TELEGRAM_BOT_TOKEN | روبوت تيليجرام للإشعارات |

## 11. الويبهوكات
- `https://your-domain.com/api/providers/mapit/webhook`
- `https://your-domain.com/api/payment/webhook`

## 12. أمان أساسي
```bash
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 13. سكربت سريع
استخدم `scripts/quick-start.sh` لإعداد شامل (يفضل مراجعته قبل التنفيذ).

## 14. استرجاع السجلات
```bash
journalctl -u logisa -f
```

## 15. تعديل المنفذ
إذا عدلت المنفذ في `.env` غيّر proxy في `nginx.conf.example` واجعلها متسقة.

انتهى الدليل. تأكد دائماً من إخفاء مفاتيحك وعدم رفع ملف `.env`.
