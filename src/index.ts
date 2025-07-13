#!/usr/bin/env node

import { RedNoteMCPServer } from './server.js';
import logger from './utils/logger.js';

async function main() {
  try {
    const server = new RedNoteMCPServer();
    await server.start();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    logger.error('Unhandled error:', error);
    process.exit(1);
  });
}