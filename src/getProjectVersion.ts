import { info } from '@actions/core';
import { Version3Client } from 'jira.js';
import { colors } from './const';
import getVariables from './getVariables';

export default async function getProjectVersion(jiraClient: Version3Client) {
  const { projectKey, versionName } = getVariables();

  info(`${colors.white}프로젝트 버전(${versionName}) 찾는중...`);

  const projectVersions = await jiraClient.projectVersions.getProjectVersions({
    projectIdOrKey: projectKey,
  });
  const projectVersion = projectVersions.find((v) => v.name === versionName);

  if (projectVersion) {
    return projectVersion;
  }

  info(`${colors.yellow}프로젝트 버전(${versionName})이 존재하지 않아 새로 생성하는 중...`);

  return await jiraClient.projectVersions.createVersion({
    name: versionName,
    project: projectKey,
  });
}
