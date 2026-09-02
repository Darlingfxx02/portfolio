import { z } from 'zod'

export const PRESET_VERSION = 'dresser-preset/v1'
export const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/

const closedObject = (shape) => z.object(shape).strict()
const hexColor = z.string().regex(HEX_COLOR_PATTERN)
const finiteNumber = z.number().finite()

export const dresserPresetSchema = closedObject({
  version: z.literal(PRESET_VERSION),
  device: closedObject({
    modelId: z.string().min(1),
    colorId: z.string().min(1).nullable(),
  }),
  background: z.discriminatedUnion('mode', [
    closedObject({ mode: z.literal('solid'), color: hexColor }),
    closedObject({ mode: z.literal('mesh'), colors: z.tuple([hexColor, hexColor, hexColor]) }),
    closedObject({ mode: z.literal('transparent') }),
    closedObject({
      mode: z.literal('picture'),
      packId: z.string().min(1),
      imageIndex: z.number().int().min(1),
    }),
  ]),
  layout: closedObject({
    aspectRatioId: z.string().min(1),
    padding: finiteNumber,
    deviceScale: finiteNumber,
    x: finiteNumber,
    y: finiteNumber,
  }),
})

export const renderInputSchema = closedObject({
  sourcePath: z.string().min(1),
  preset: dresserPresetSchema,
})

const idLabelSchema = closedObject({ id: z.string(), label: z.string() })
const numericCapabilitySchema = closedObject({
  default: finiteNumber,
  min: finiteNumber,
  max: finiteNumber,
  step: finiteNumber,
})

export const capabilitiesSchema = closedObject({
  version: z.literal(PRESET_VERSION),
  mirror: closedObject({
    manifest: z.literal('MANIFEST.sha256'),
    sha256: z.string().regex(/^[0-9a-f]{64}$/),
    route: z.literal('/tools/mockup'),
  }),
  source: closedObject({
    acceptedMimeTypes: z.tuple([z.literal('image/png'), z.literal('image/jpeg')]),
    maxBytes: z.number().int().positive(),
    fitMode: z.literal('contain'),
  }),
  deviceModels: z.array(closedObject({
    id: z.string(),
    label: z.string(),
    colors: z.array(idLabelSchema),
  })),
  backgrounds: closedObject({
    modes: z.array(z.enum(['solid', 'mesh', 'transparent', 'picture'])),
    solid: closedObject({ defaultColor: hexColor }),
    mesh: closedObject({ colorCount: z.literal(3), defaultColors: z.tuple([hexColor, hexColor, hexColor]) }),
    picturePacks: z.array(closedObject({ id: z.string(), label: z.string(), imageCount: z.number().int().positive() })),
  }),
  layout: closedObject({
    aspectRatios: z.array(idLabelSchema),
    padding: numericCapabilitySchema,
    deviceScale: numericCapabilitySchema,
    x: numericCapabilitySchema,
    y: numericCapabilitySchema,
  }),
  defaults: dresserPresetSchema,
})

export const artifactSchema = closedObject({
  version: z.literal(PRESET_VERSION),
  path: z.string(),
  mimeType: z.literal('image/png'),
  byteSize: z.number().int().positive(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
})

export class PresetValidationError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'PresetValidationError'
    this.code = code
  }
}

function requireBounded(value, capability, field) {
  if (value < capability.min || value > capability.max) {
    throw new PresetValidationError('INVALID_PRESET', `${field} is outside the supported range`)
  }
}

export function validatePreset(input, capabilities) {
  const parsed = dresserPresetSchema.safeParse(input)
  if (!parsed.success) throw new PresetValidationError('INVALID_PRESET', 'Preset does not match dresser-preset/v1')
  const preset = parsed.data
  const model = capabilities.deviceModels.find((item) => item.id === preset.device.modelId)
  if (!model) throw new PresetValidationError('UNKNOWN_DEVICE_MODEL', 'Device model is not supported')
  const colorIds = model.colors.map((item) => item.id)
  if (colorIds.length === 0 && preset.device.colorId !== null) {
    throw new PresetValidationError('UNKNOWN_DEVICE_COLOR', 'This device model has no color variants')
  }
  if (colorIds.length > 0 && !colorIds.includes(preset.device.colorId)) {
    throw new PresetValidationError('UNKNOWN_DEVICE_COLOR', 'Device color is not supported for this model')
  }
  if (!capabilities.layout.aspectRatios.some((item) => item.id === preset.layout.aspectRatioId)) {
    throw new PresetValidationError('UNKNOWN_ASPECT_RATIO', 'Aspect ratio is not supported')
  }
  requireBounded(preset.layout.padding, capabilities.layout.padding, 'layout.padding')
  requireBounded(preset.layout.deviceScale, capabilities.layout.deviceScale, 'layout.deviceScale')
  requireBounded(preset.layout.x, capabilities.layout.x, 'layout.x')
  requireBounded(preset.layout.y, capabilities.layout.y, 'layout.y')
  if (preset.background.mode === 'picture') {
    const pack = capabilities.backgrounds.picturePacks.find((item) => item.id === preset.background.packId)
    if (!pack) throw new PresetValidationError('UNKNOWN_PICTURE_PACK', 'Picture pack is not supported')
    if (preset.background.imageIndex > pack.imageCount) {
      throw new PresetValidationError('UNKNOWN_PICTURE_IMAGE', 'Picture image index is not supported')
    }
  }
  return preset
}
