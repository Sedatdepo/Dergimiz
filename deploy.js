require('dotenv').config();
const { Client } = require('ssh2');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const config = {
  host: process.env.VDS_HOST || '179.61.147.252',
  port: parseInt(process.env.VDS_PORT || '22', 10),
  username: process.env.VDS_USER || 'root',
  password: process.env.VDS_PASSWORD || '',
  remoteDir: process.env.VDS_REMOTE_DIR || '/var/www/dergimiz'
};

console.log('🚀 Dergimiz Platformu Dağıtımı Başlatılıyor...');

const conn = new Client();
conn.on('ready', async () => {
  console.log('📶 VDS bağlantısı sağlandı.');

  try {
    // 1. Arşiv Oluştur (server.js, package.json, public, data, uploads)
    console.log('📦 Uygulama arşivi paketleniyor...');
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });
    if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });
    if (fs.existsSync('deploy.tar.gz')) fs.unlinkSync('deploy.tar.gz');
    execSync('tar -czf deploy.tar.gz server.js package.json public data uploads', { stdio: 'inherit' });

    // 2. SFTP ile Sunucuya Yükle
    conn.sftp((err, sftp) => {
      if (err) throw err;
      console.log('📤 Arşiv VDS sunucusuna yükleniyor...');
      sftp.fastPut('deploy.tar.gz', '/tmp/dergimiz.tar.gz', (uploadErr) => {
        if (uploadErr) throw uploadErr;

        console.log('📁 Sunucuda dosyalar açılıyor, bağımlılıklar kuruluyor ve PM2 başlatılıyor...');
        
        // Nginx Ters Vekil (Reverse Proxy) Ayarları
        const nginxConf = `
server {
    listen 80;
    listen [::]:80;
    server_name dergimiz.com.tr www.dergimiz.com.tr;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name dergimiz.com.tr www.dergimiz.com.tr;

    ssl_certificate /etc/ssl/certs/dergimiz.crt;
    ssl_certificate_key /etc/ssl/private/dergimiz.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }
}
`;
        const confB64 = Buffer.from(nginxConf).toString('base64');

        const cmd = `
          mkdir -p ${config.remoteDir} &&
          tar -xzf /tmp/dergimiz.tar.gz -C ${config.remoteDir} &&
          rm -f /tmp/dergimiz.tar.gz &&
          cd ${config.remoteDir} &&
          npm install --omit=dev &&
          (pm2 restart dergimiz || pm2 start server.js --name dergimiz) &&
          pm2 save &&
          echo '${confB64}' | base64 -d > /etc/nginx/sites-available/dergimiz &&
          ln -sf /etc/nginx/sites-available/dergimiz /etc/nginx/sites-enabled/dergimiz &&
          nginx -t && systemctl reload nginx
        `;

        conn.exec(cmd, (execErr, stream) => {
          if (execErr) throw execErr;
          stream.on('data', d => process.stdout.write(d.toString()));
          stream.stderr.on('data', d => process.stderr.write(d.toString()));
          stream.on('close', (code) => {
            console.log(`\n🎉 Dağıtım Başarıyla Tamamlandı! (Çıkış Kodu: ${code})`);
            console.log('🌐 Web sitesi: https://dergimiz.com.tr');
            console.log('✍️ Editör Masası: https://dergimiz.com.tr/editor');
            if (fs.existsSync('deploy.tar.gz')) fs.unlinkSync('deploy.tar.gz');
            conn.end();
          });
        });
      });
    });
  } catch (error) {
    console.error('❌ Dağıtım Hatası:', error);
    conn.end();
  }
}).connect({
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password
});
