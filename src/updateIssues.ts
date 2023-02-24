import { info } from '@actions/core';
import { Version3Client } from 'jira.js';
import { colors } from './const';
import getVariables from './getVariables';

export default async function updateIssues(jiraClient: Version3Client, issueKeys: string[] = []) {
  const { versionName, doneStatusName } = getVariables();

  if (!issueKeys.length) {
    info(`${colors.yellow}업데이트할 이슈가 없습니다!`);
    return;
  }

  info(`${colors.white}⏳ 관련 JIRA 이슈를 업데이트하는 중...`);

  await Promise.all(
    issueKeys.map(async (issueKey) => {
      info(`${colors.white}  👉 ${issueKey} 업데이트 중...`);
      try {
        const issue = await jiraClient.issues.getIssue({ issueIdOrKey: issueKey });
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
            fields: { fixVersions: [...issue.fields.fixVersions, { name: versionName }] },
          }),
        ]);
      } catch (error) {
        info(`${colors.red}  🚫 ${issueKey} 업데이트 실패!`);
      }
    }),
  );

  info(`${colors.green}✅ ${issueKeys.length}개의 이슈 업데이트 완료!`);
}
