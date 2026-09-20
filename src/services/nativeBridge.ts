// Puente de comunicación entre la aplicación Web y Android nativo
export function triggerAndroidUnlock() {
  // 1. Mensaje en consola (capturado por WebChromeClient de Android)
  console.log('BLOQESCOLAR_UNLOCK');

  // 2. Título de página (capturado 100% confiable por onReceivedTitle en Android)
  try {
    document.title = 'BLOQESCOLAR_UNLOCK';
  } catch (e) {}

  // 3. JavascriptInterface nativo (si fue inyectado en Android)
  try {
    if ((window as any).AndroidBridge?.unlock) {
      (window as any).AndroidBridge.unlock();
    }
  } catch (e) {}

  // 4. Esquema de URL personalizada
  try {
    window.location.hash = '#unlock';
  } catch (e) {}
}

export function triggerAndroidLock() {
  console.log('BLOQESCOLAR_LOCK');
  try {
    document.title = 'BLOQESCOLAR_LOCK';
  } catch (e) {}

  try {
    if ((window as any).AndroidBridge?.lock) {
      (window as any).AndroidBridge.lock();
    }
  } catch (e) {}
}
