import { info } from '@actions/core';
import { Version3Client } from 'jira.js';
import { colors } from './const';
import getVariables from './getVariables';

export default async function updateIssues(jiraClient: Version3Client, issueKeys: string[] = []) {
  const { versionName, doneStatusName } = getVariables();

  if (!issueKeys.length) {
    info(`${colors.yellow}No issues to update`);
    return;
  }

  info(`${colors.white}⏳ Updating related issues...`);

  await Promise.all(
    issueKeys.map(async (issueKey) => {
      info(`${colors.white}  👉 Updating ${issueKey}...`);

      const transitions = await jiraClient.issues.getTransitions({ issueIdOrKey: issueKey });
      const doneTransition = transitions.transitions?.find((t) =>
        t.name?.toLocaleLowerCase()?.includes(doneStatusName.toLocaleLowerCase()),
      );
      if (!doneTransition) {
        return;
      }
      return await Promise.all([
        await jiraClient.issues.doTransition({
          issueIdOrKey: issueKey,
          transition: { id: doneTransition.id },
        }),
        await jiraClient.issues.editIssue({
          issueIdOrKey: issueKey,
          fields: { fixVersions: [{ name: versionName }] },
        }),
      ]);
    }),
  );

  info(`${issueKeys.length}✅ issues updated`);
}
