import { info } from '@actions/core';
import dayjs from 'dayjs';
import { Version3Client } from 'jira.js';
import { Version } from 'jira.js/out/version3/models';
import { colors } from './const';
import getVariables from './getVariables';

export default async function releaseProjectVersion(
  jiraClient: Version3Client,
  projectVersion: Version,
) {
  const { projectKey } = getVariables();

  info(`${colors.white}⏳ 프로젝트 버전(${projectVersion.name}) 릴리즈 중...`);

  try {
    await jiraClient.projectVersions.updateVersion({
      id: projectVersion.id!,
      project: projectKey,
      released: true,
      releaseDate: dayjs().format('YYYY-MM-DD'),
    });
  } catch (error) {
    info(`${colors.red}🚫 프로젝트 버전(${projectVersion.name}) 릴리즈 실패!`);
  }

  info(`${colors.green}✅ 프로젝트 버전(${projectVersion.name}) 릴리즈 성공!`);
}
