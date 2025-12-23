import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { Filesystem, Directory } from '@capacitor/filesystem';

export class NativeCapabilities {
  static async takePicture(): Promise<string | null> {
    try {
      // Check if Capacitor Camera is available
      if (!window.Capacitor?.isNativePlatform()) {
        // Fallback to web camera API
        return await this.takePictureWeb();
      }
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      
      return image.dataUrl || null;
    } catch (error) {
      console.error('Camera error:', error);
      // Try web fallback
      return await this.takePictureWeb();
    }
  }

  static async takePictureWeb(): Promise<string | null> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        return null;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      video.srcObject = stream;
      await video.play();
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      stream.getTracks().forEach(track => track.stop());
      
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.error('Web camera error:', error);
      return null;
    }
  }

  static async getCurrentLocation() {
    try {
      if (!window.Capacitor?.isNativePlatform()) {
        // Use web geolocation API
        return await this.getCurrentLocationWeb();
      }
      
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy
      };
    } catch (error) {
      console.error('Geolocation error:', error);
      return await this.getCurrentLocationWeb();
    }
  }

  static async getCurrentLocationWeb() {
    try {
      if (!navigator.geolocation) {
        return null;
      }
      
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          },
          (error) => {
            console.error('Web geolocation error:', error);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    } catch (error) {
      console.error('Web geolocation setup error:', error);
      return null;
    }
  }

  static async scheduleNotification(title: string, body: string, delay: number = 0) {
    try {
      if (!window.Capacitor?.isNativePlatform()) {
        // Use web notifications
        return await this.scheduleWebNotification(title, body, delay);
      }
      
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: delay > 0 ? { at: new Date(Date.now() + delay) } : undefined,
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Notification error:', error);
      // Try web notifications as fallback
      await this.scheduleWebNotification(title, body, delay);
    }
  }

  static async scheduleWebNotification(title: string, body: string, delay: number = 0) {
    try {
      if (!('Notification' in window)) {
        return;
      }
      
      if (Notification.permission === 'granted') {
        if (delay > 0) {
          setTimeout(() => {
            new Notification(title, { body });
          }, delay);
        } else {
          new Notification(title, { body });
        }
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      }
    } catch (error) {
      console.error('Web notification error:', error);
    }
  }

  static async vibrate(style: 'light' | 'medium' | 'heavy' = 'medium') {
    try {
      if (!window.Capacitor?.isNativePlatform()) {
        // Use web vibration API
        if ('vibrate' in navigator) {
          const patterns = { light: 100, medium: 200, heavy: 300 };
          navigator.vibrate(patterns[style]);
        }
        return;
      }
      
      const impactStyle = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy
      }[style];
      
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Haptics error:', error);
      // Try web vibration as fallback
      try {
        if ('vibrate' in navigator) {
          const patterns = { light: 100, medium: 200, heavy: 300 };
          navigator.vibrate(patterns[style]);
        }
      } catch (webError) {
        console.debug('Web vibration not supported');
      }
    }
  }

  static async getDeviceInfo() {
    try {
      const info = await Device.getInfo();
      return {
        platform: info.platform,
        model: info.model,
        operatingSystem: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        isVirtual: info.isVirtual
      };
    } catch (error) {
      console.error('Device info error:', error);
      return null;
    }
  }

  static async getNetworkStatus() {
    try {
      const status = await Network.getStatus();
      return {
        connected: status.connected,
        connectionType: status.connectionType
      };
    } catch (error) {
      console.error('Network status error:', error);
      return { connected: true, connectionType: 'unknown' };
    }
  }

  static async saveFile(data: string, filename: string) {
    try {
      await Filesystem.writeFile({
        path: filename,
        data: data,
        directory: Directory.Documents
      });
      return true;
    } catch (error) {
      console.error('File save error:', error);
      return false;
    }
  }

  static isNative(): boolean {
    return window.location.protocol === 'capacitor:';
  }

  static async requestPermissions() {
    try {
      // Request camera permissions
      await Camera.requestPermissions();
      
      // Request location permissions
      await Geolocation.requestPermissions();
      
      // Request notification permissions
      await LocalNotifications.requestPermissions();
      
      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }
}