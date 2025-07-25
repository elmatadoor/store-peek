import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dcc99d53d9a048e8aa9ba60ee79fd4a9',
  appName: 'WooCommerce Orders',
  webDir: 'dist',
  server: {
    url: 'https://dcc99d53-d9a0-48e8-aa9b-a60ee79fd4a9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f0f23',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#22c55e'
    }
  }
};

export default config;