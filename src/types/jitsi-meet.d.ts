// Type definitions for Jitsi Meet External API
// declare module 'jitsi-meet' {
//   interface JitsiMeetExternalApi {
//     new (domain: string, options: JitsiMeetExternalApiOptions): JitsiMeetExternalApi;
//     dispose: () => void;
//     executeCommand: (command: string, ...args: any[]) => void;
//     on: (event: string, listener: (...args: any[]) => void) => void;
//     off: (event: string, listener: (...args: any[]) => void) => void;
//     [key: string]: any;
//   }
// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: new (domain: string, options: any) => JitsiMeetExternalApi;
//   }
// }
// src/types/jitsi-meet.d.ts
interface JitsiMeetExternalApi {
  new (domain: string, options: any): JitsiMeetExternalApi;
  dispose: () => void;
  executeCommand: (command: string, ...args: any[]) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: any) => JitsiMeetExternalApi;
  }
}
  interface JitsiMeetExternalApiOptions {
    roomName: string;
    parentNode: HTMLElement | null;
    configOverwrite?: Record<string, any>;
    interfaceConfigOverwrite?: Record<string, any>;
    userInfo?: {
      displayName?: string;
      email?: string;
    };
    jwt?: string;
    [key: string]: any;
  }


declare global {
  interface Window {
    JitsiMeetExternalAPI: any; // We'll use type assertion where needed
  }
}
