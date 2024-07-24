import { defineConfig, presetIcons, presetUno, presetWind, UserConfig, transformerDirectives } from 'unocss'

const config = {
  presets: [presetUno(), presetWind(), presetIcons()],
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-col-center': 'flex flex-col justify-center items-center',
    },
  ],
  rules: [
    
  ],
  theme: {
    colors: {
      white: '#FFFCF5',
      green: '#005d30',
      gray: '#242d25',
      grey: '#242d25',
      black: '#0d1c10',
      yellow: '#fff0af',
    }
  },
  transformers: [
    transformerDirectives()
  ],
}

export default defineConfig(config) as UserConfig<(typeof config)['theme']>
