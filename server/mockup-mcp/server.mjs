#!/usr/bin/env node
import { pathToFileURL } from 'node:url'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { BrowserSessionManager, DresserError } from './browser-session.mjs'
import { artifactSchema, capabilitiesSchema, renderInputSchema } from './preset-schema.mjs'

function success(value) {
  return {
    content: [{ type: 'text', text: JSON.stringify(value) }],
    structuredContent: value,
  }
}

function failure(error) {
  const safeError = error instanceof DresserError || error?.name === 'PresetValidationError'
    ? { code: error.code, message: error.message }
    : { code: 'INTERNAL_ERROR', message: 'Dresser MCP operation failed' }
  return {
    isError: true,
    content: [{ type: 'text', text: JSON.stringify(safeError) }],
  }
}

export function createDresserMcpServer(manager = new BrowserSessionManager()) {
  const server = new McpServer({ name: 'dresser-browser-mcp', version: '0.1.0' })

  server.registerTool('dresser_get_capabilities', {
    title: 'Get Dresser capabilities',
    description: 'Discover the exact local Dresser mirror preset IDs, defaults, and bounds through its browser UI.',
    inputSchema: {},
    outputSchema: capabilitiesSchema.shape,
  }, async () => {
    try {
      return success(await manager.getCapabilities())
    } catch (error) {
      return failure(error)
    }
  })

  server.registerTool('dresser_render_png', {
    title: 'Render a Dresser PNG',
    description: 'Import one validated local PNG or JPEG, apply dresser-preset/v1 in the browser UI, and return Dresser’s exported PNG artifact.',
    inputSchema: renderInputSchema.shape,
    outputSchema: artifactSchema.shape,
  }, async ({ sourcePath, preset }) => {
    try {
      return success(await manager.render(sourcePath, preset))
    } catch (error) {
      return failure(error)
    }
  })

  return server
}

export async function startServer() {
  const server = createDresserMcpServer()
  await server.connect(new StdioServerTransport())
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch(() => {
    process.stderr.write('Dresser MCP server failed to start.\n')
    process.exitCode = 1
  })
}
