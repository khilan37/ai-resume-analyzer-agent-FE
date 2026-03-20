type RuntimeEnvironment = {
  apiBaseUrl?: string;
  demoUserId?: string;
};

declare global {
  interface Window {
    __env?: RuntimeEnvironment;
  }
}

const runtimeEnvironment = typeof window !== 'undefined' ? window.__env : undefined;

export const environment = {
  production: true,
  apiBaseUrl: runtimeEnvironment?.apiBaseUrl ?? 'http://localhost:8080/api',
  demoUserId: runtimeEnvironment?.demoUserId ?? '2e421edd-ae3d-4206-bf6e-193d1872bf8f'
};
