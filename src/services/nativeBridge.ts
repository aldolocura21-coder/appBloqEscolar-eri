// Puente de comunicación entre la aplicación Web y Android nativo
import { App } from '@capacitor/app';

export async function triggerAndroidUnlock() {
  console.log('BLOQESCOLAR_UNLOCK');

  // 1. Mensaje en título de página (detectado por WebView de Android)
  try {
    document.title = 'BLOQESCOLAR_UNLOCK';
  } catch (e) {}

  // 2. Capacitor App: minimiza/cierra la app para volver a la pantalla de inicio de Android
  try {
    await App.exitApp();
  } catch (e) {
    console.log('Capacitor App.exitApp no disponible en navegador web:', e);
  }

  // 3. JavascriptInterface nativo (si fue inyectado en MainActivity de Android)
  try {
    if ((window as any).AndroidBridge?.unlock) {
      (window as any).AndroidBridge.unlock();
    }
    if ((window as any).Android?.closeApp) {
      (window as any).Android.closeApp();
    }
    if ((navigator as any).app?.exitApp) {
      (navigator as any).app.exitApp();
    }
  } catch (e) {}

  // 4. Hash de navegación
  try {
    window.location.hash = '#unlock';
  } catch (e) {}
}

export async function triggerAndroidLock() {
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

