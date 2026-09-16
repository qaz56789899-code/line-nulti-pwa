const express = require("express"); 

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(express.json()); 

// 首頁：顯示 LINE 1～20 
app.get("/", (req, res) => { 
  let buttons = ""; 
  
  for (let i = 1; i <= 20; i++) { 
    buttons += ` 
      <a class="line-btn" href="/line/${i}"> 
        LINE ${i} 
      </a>
    `;
  } 
  
  res.send(` 
<!DOCTYPE html> 
<html lang="zh-Hant"> 
<head> 
  <meta charset="UTF-8"> 
  <meta name="viewport" 
        content="width=device-width, initial-scale=1.0"> 
  <title>LINE 多帳號</title> 
  
  <style> 
    body { 
      font-family: Arial, sans-serif; 
      background: #f5f5f5; 
      margin: 0; 
      padding: 24px; 
    } 
    
    h1 { 
      text-align: center; 
    } 
    
    .grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 12px; 
      max-width: 600px; 
      margin: auto; 
    } 
    .line-btn { 
      background: #06c755; 
      color: white; 
      text-decoration: none; 
      padding: 18px; 
      border-radius: 14px; 
      text-align: center; 
      font-size: 20px; 
      font-weight: bold; 
    } 
  </style> 
</head> 

<body> 

<h1>LINE 多帳號</h1> 

<div class="grid"> 
  ${buttons} 
</div> 

</body> 
</html> 
  `); 
}); 

// LINE 1～20 個別 PWA 頁面 
app.get("/line/:id", (req, res) => { 
  
  const id = Number(req.params.id); 
  
  if (!Number.isInteger(id) || id < 1 || id > 20) { 
    return res.status(404).send("找不到這個 LINE 分身"); 
  } 
  
  res.send(` 
<!DOCTYPE html> 
<html lang="zh-Hant"> 

<head> 

<meta charset="UTF-8"> 

<meta name="viewport" 
      content="width=device-width, initial-scale=1.0"> 
      
<meta name="theme-color" 
      content="#06c755"> 

<link rel="manifest" 
      href="/manifest/${id}.json"> 

<title>LINE ${id}</title> 

<style> 

body { 
  font-family: Arial, sans-serif; 
  margin: 0; 
  background: #f5f5f5; 
} 

.header { 
  background: #06c755; 
  color: white; 
  padding: 20px; 
  text-align: center; 
} 

.content { 
  padding: 25px; 
  text-align: center; 
} 

.card { 
  background: white; 
  border-radius: 18px; 
  padding: 30px 20px; 
  max-width: 500px; 
  margin: auto; 
} 

.install { 
  margin-top: 20px; 
  padding: 15px 25px; 
  border: 0; border-radius: 12px; 
  background: #06c755; 
  color: white; 
  font-size: 18px; 
  cursor: pointer; 
} 

</style> 

</head> 

<body> 

<div class="header"> 
  <h1>LINE ${id}</h1> 
</div> 

<div class="content"> 
  
  <div class="card"> 
    
    <h2>LINE 分身 ${id}</h2> 
    
    <p> 
      這是 LINE ${id} 的獨立 PWA 測試入口。 
    </p> 
    
    <button 
      id="installButton" 
      class="install" 
      style="display:none;"> 
      安裝 LINE ${id} 
    </button> 
    
    <p id="installHelp"> 
      若沒有出現安裝按鈕， 
      可使用 Chrome 選單中的 
     「安裝應用程式」或「新增至主畫面」。 
    </p> 
  
  </div> 

</div> 

<script> 

if ("serviceWorker" in navigator) { 
 
 navigator.serviceWorker.register( 
   "/sw.js" 
   ); 
} 

let deferredPrompt; 

const installButton = 
  document.getElementById("installButton"); 

window.addEventListener( 
  "beforeinstallprompt", 
  (event) => { 
    
    event.preventDefault(); 
    
    deferredPrompt = event; 
    
    installButton.style.display = "inline-block"; 
  
  } 
); 

installButton.addEventListener( 
  "click", 
  async () => { 
    
    if (!deferredPrompt) return; 
    
    deferredPrompt.prompt(); 
    
    await deferredPrompt.userChoice; 
    
    deferredPrompt = null; 
    
    installButton.style.display = "none"; 
  
  } 
); 

</script> 

</body> 
</html> 
  `); 
  
}); 

// 動態產生 LINE 1～20 Manifest 
app.get("/manifest/:id.json", (req, res) => { 
  
  const id = Number(req.params.id); 
  
  if (!Number.isInteger(id) || id < 1 || id > 20) { 
    return res.status(404).json({ 
      error: "Invalid LINE ID" 
    }); 
  } 
  
  res.json({ 
    
    id: `/line/${id}`, 
    
    name: `LINE ${id}`, 
    
    short_name: `LINE ${id}`, 
    
    start_url: `/line/${id}?pwa=1`, 
    
    scope: "/", 
    
    display: "standalone", 
    
    background_color: "#ffffff", 
    
    theme_color: "#06c755", 
    
    icons: [ 
      { 
        src: `/icon/${id}.svg`, 
        sizes: "any", 
        type: "image/svg+xml", 
        purpose: "any" 
      } 
    ] 
    
  }); 

}); 

// 產生每個 LINE 的測試圖示 
app.get("/icon/:id.svg", (req, res) => { 
  
  const id = Number(req.params.id); 
  
  if (!Number.isInteger(id) || id < 1 || id > 20) { 
    return res.status(404).send("Not found"); 
  } 
  
  res.type("image/svg+xml"); 
  
  res.send(` 
<svg 
 xmlns="http://www.w3.org/2000/svg" 
 width="512" 
 height="512" 
 viewBox="0 0 512 512"> 
 
 <rect 
  width="512" 
  height="512" 
  rx="100" 
  fill="#06c755"/> 
  
 <text 
  x="256" 
  y="235" 
  text-anchor="middle" 
  font-family="Arial" 
  font-size="90" 
  font-weight="bold" 
  fill="white"> 
  LINE 
 </text> 
 
 <text 
  x="256" 
  y="355" 
  text-anchor="middle" 
  font-family="Arial" 
  font-size="120" 
  font-weight="bold" 
  fill="white"> 
  ${id} 
 </text> 

</svg>
  `); 

}); 

// Service Worker 
app.get("/sw.js", (req, res) => { 
  
  res.type("application/javascript"); 
  
  res.send(` 
self.addEventListener("install", () => { 
  self.skipWaiting(); 
}); 

self.addEventListener("activate", event => { 
  event.waitUntil(clients.claim()); 
}); 

self.addEventListener("fetch", event => { 
  event.respondWith(fetch(event.request)); 
}); 
  `); 

}); 

// Render 健康檢查 
app.get("/health", (req, res) => { 
  res.json({ 
    status: "ok" 
  }); 
}); 

app.listen(PORT, () => { 
  console.log( 
    "LINE Multi PWA running on port " + PORT 
  ); 
});
