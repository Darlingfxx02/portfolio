export type NumericCapability = { default: number; min: number; max: number; step: number }
export type Preset = {
  version: 'dresser-preset/v1'
  device: { modelId: string; colorId: string | null }
  background: { mode: 'solid'; color: string } | { mode: 'mesh'; colors: [string, string, string] } | { mode: 'transparent' } | { mode: 'picture'; packId: string; imageIndex: number }
  layout: { aspectRatioId: string; padding: number; deviceScale: number; x: number; y: number }
}
export type Capabilities = {
  version: 'dresser-preset/v1'
  deviceModels: Array<{ id: string; label: string; colors: Array<{ id: string; label: string }> }>
  backgrounds: { modes: Preset['background']['mode'][]; solid: { defaultColor: string }; mesh: { defaultColors: [string, string, string] }; picturePacks: Array<{ id: string; label: string; imageCount: number }> }
  layout: { aspectRatios: Array<{ id: string; label: string }>; padding: NumericCapability; deviceScale: NumericCapability; x: NumericCapability; y: NumericCapability }
  defaults: Preset
}
export type SelectionContext = { id: string; nonce: number; name: string; width: number; height: number; absoluteX: number; absoluteY: number }
