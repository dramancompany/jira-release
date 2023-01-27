import { info } from '@actions/core';
import { Version3Client } from 'jira.js';
import { colors } from './const';
import getVariables from './getVariables';

export default async function getProjectVersion(jiraClient: Version3Client) {
  const { projectKey, versionName } = getVariables();

  info(`${colors.white}Looking for project version ${versionName}...`);

  const projectVersions = await jiraClient.projectVersions.getProjectVersions({
    projectIdOrKey: projectKey,
  });
  const projectVersion = projectVersions.find((v) => v.name === versionName);

  if (projectVersion) {
    return projectVersion;
  }

  info(`${colors.yellow}Version ${versionName} not found, creating new one...`);

  return await jiraClient.projectVersions.createVersion({
    name: versionName,
    project: projectKey,
  });
}
