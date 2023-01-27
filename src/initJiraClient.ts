import { info } from '@actions/core';
import { Version3Client } from 'jira.js';
import { colors } from './const';
import getVariables from './getVariables';

export default function initJiraClient() {
  const { host, email, apiToken } = getVariables();

  info(`${colors.white}Initializing Jira client...`);

  return new Version3Client({
    host,
    authentication: {
      basic: {
        email,
        apiToken,
      },
    },
  });
}
