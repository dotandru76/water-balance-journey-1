
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a26073b59f5f4705861366b7bad50c8b',
  appName: 'water-balance-journey',
  webDir: 'dist',
  server: {
    url: 'https://a26073b5-9f5f-4705-8613-66b7bad50c8b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  android: {
    minSdkVersion: 23,
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      releaseType: "APK"
    },
    iconBackground: '#ffffff'
  },
  bundledWebRuntime: false
};

export default config;
