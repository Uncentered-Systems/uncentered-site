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

  },
  transformers: [
    transformerDirectives()
  ],
}

export default defineConfig(config) as UserConfig<(typeof config)['theme']>
