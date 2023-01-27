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

  info(
    `${colors.white}⏳ Releasing project version ${projectVersion.name}(${projectVersion.id})...`,
  );

  await jiraClient.projectVersions.updateVersion({
    id: projectVersion.id!,
    project: projectKey,
    released: true,
    releaseDate: dayjs().format('YYYY-MM-DD'),
  });

  info(
    `${colors.green}✅ Released project version ${projectVersion.name}(${projectVersion.id}) successfully!`,
  );
}
