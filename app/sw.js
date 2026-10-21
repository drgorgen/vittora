// Service worker da versão web (iPhone). MODELO: scripts/site.mjs troca os dois marcadores (ARQUIVOS e CACHE, logo
// abaixo) pela lista exata dos arquivos do app e pelo nome do cache da versão, e grava site-dist/app/sw.js.
// Mesmo desenho do Visitas Felice, já testado no iPhone. Script clássico (sem import): todo Safari aceita.
//  - install: guarda todos os arquivos; NÃO pula a espera (a versão nova só assume quando a pessoa toca em Atualizar);
//  - activate: apaga só os caches antigos do Vittora (o domínio github.io é dividido com outros apps);
//  - fetch: arquivos do app pelo cache; navegação recebe o index.html guardado (abre sem internet);
//    pedidos para fora (Supabase) não passam por aqui;
//  - message 'pular-espera': assume agora (a página recarrega no controllerchange).
const ARQUIVOS = ["./","assets/agachamento-livre-DIwjDhAy.webp","assets/base-costas-C8n0hwBq.webp","assets/base-frente-HhEE5XwI.webp","assets/index-BZmPWzTy.js","assets/index-D5Ql5Ql0.css","assets/inter-latin-400-normal-C38fXH4l.woff2","assets/inter-latin-400-normal-CyCys3Eg.woff","assets/inter-latin-500-normal-BL9OpVg8.woff","assets/inter-latin-500-normal-Cerq10X2.woff2","assets/inter-latin-600-normal-CiBQ2DWP.woff","assets/inter-latin-600-normal-LgqL8muc.woff2","assets/inter-latin-700-normal-BLAVimhd.woff","assets/inter-latin-700-normal-Yt3aPRUw.woff2","assets/inter-latin-800-normal-BYj_oED-.woff2","assets/inter-latin-800-normal-D1mf63XC.woff","assets/mascara-abdomen-costas-DQ1HddcS.webp","assets/mascara-abdomen-frente-CBYBpvTf.webp","assets/mascara-adutores-costas-DcyzMt6l.webp","assets/mascara-adutores-frente-C03O6GFY.webp","assets/mascara-antebraco-costas-CZt3w5KV.webp","assets/mascara-antebraco-frente-BlRtr-5F.webp","assets/mascara-biceps-costas-na7EXRd-.webp","assets/mascara-biceps-frente-BCZQNGPy.webp","assets/mascara-costas-costas-MOD_3XMr.webp","assets/mascara-costas-frente-BsRiX4S6.webp","assets/mascara-gluteos-costas-CTeq-713.webp","assets/mascara-gluteos-frente-D-1c0MwQ.webp","assets/mascara-lombar-costas-CeCBrJ7m.webp","assets/mascara-ombros-costas-B43R3OTX.webp","assets/mascara-ombros-frente-DWrj-xrV.webp","assets/mascara-panturrilhas-costas-aDACpSHO.webp","assets/mascara-panturrilhas-frente-bey91l_-.webp","assets/mascara-peito-costas-DHD050pK.webp","assets/mascara-peito-frente-YX53ptka.webp","assets/mascara-posteriores-costas-CqlyzjLX.webp","assets/mascara-posteriores-frente-CXmXvv0D.webp","assets/mascara-quadriceps-costas-cRwgDU7x.webp","assets/mascara-quadriceps-frente-DKtmY8n7.webp","assets/mascara-trapezio-costas-DSqF9Xmw.webp","assets/mascara-trapezio-frente-C-XddSUe.webp","assets/mascara-triceps-costas-C9-IQe_E.webp","assets/mascara-triceps-frente-L6eDiFA4.webp","assets/montserrat-latin-300-normal-BgP24wlQ.woff2","assets/montserrat-latin-300-normal-sTRdVzlf.woff","assets/montserrat-latin-400-normal-BLhwKU8k.woff2","assets/montserrat-latin-400-normal-xItZbAXg.woff","assets/montserrat-latin-800-italic-9p4-1b3s.woff","assets/montserrat-latin-800-italic-DyMN9dWi.woff2","assets/rosca-direta-barra-9is_hQXw.webp","assets/supino-reto-barra-Bbv6l-gV.webp","assets/web-B0oiWVHD.js","assets/web-BctKi3Dr.js","assets/web-o7Ab_UCG.js","icone-180.png","icone-192.png","icone-512.png","index.html","manifest.webmanifest"];
const CACHE = "vittora-0.8.1-6fa11050";
const PREFIXO = 'vittora-';

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil((async () => {
    for (const nome of await caches.keys()) {
      if (nome.startsWith(PREFIXO) && nome !== CACHE) await caches.delete(nome);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (evento) => {
  const pedido = evento.request;
  if (pedido.method !== 'GET' || new URL(pedido.url).origin !== self.location.origin) return;
  evento.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (pedido.mode === 'navigate') return (await cache.match('./index.html')) ?? fetch(pedido);
    return (await cache.match(pedido)) ?? fetch(pedido);
  })());
});

self.addEventListener('message', (evento) => {
  if (evento.data === 'pular-espera') self.skipWaiting();
});
