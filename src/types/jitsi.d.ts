declare module 'jitsi-meet' {
  interface JitsiMeetExternalAPI {
    new (domain: string, options: {
      roomName: string;
      parentNode: HTMLElement | null;
      width?: string | number;
      height?: string | number;
      configOverwrite?: Record<string, any>;
      interfaceConfigOverwrite?: Record<string, any>;
      noSSL?: boolean;
      jwt?: string;
      onload?: () => void;
      invitees?: any[];
      devices?: {
        audioInput?: string;
        audioOutput?: string;
        videoInput?: string;
      };
      userInfo?: {
        displayName?: string;
        email?: string;
      };
    }): JitsiMeetExternalAPI;

    executeCommand(command: string, ...args: any[]): void;
    addListener(event: string, listener: (...args: any[]) => void): void;
    removeListener(event: string, listener: (...args: any[]) => void): void;
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
    dispose(): void;
    getNumberOfParticipants(): number;
    getDisplayName(): string;
    isAudioMuted(): boolean;
    isVideoMuted(): boolean;
    isAudioAvailable(): boolean;
    isVideoAvailable(): boolean;
    executeCommands(commands: Record<string, any>): void;
    getParticipantsInfo(): any[];
  }
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}
