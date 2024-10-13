interface Window {
  ai?: {
    assistant: {
      create: () => Promise<{
        prompt: (message: string) => Promise<string>;
      }>;
    };
  };
}