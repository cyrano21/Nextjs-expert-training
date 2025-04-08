/// <reference types="vitest" />
/// <reference types="vite/client" />

import type { UserConfig } from 'vitest/config'
import type { PluginOption } from 'vite'

declare module '@vitejs/plugin-react' {
  const pluginReact: () => PluginOption
  export default pluginReact
}
