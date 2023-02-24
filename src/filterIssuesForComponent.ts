import { info } from '@actions/core';
import { Version3Client } from 'jira.js';
import { colors } from './const';
import getVariables from './getVariables';

export default async function filterIssuesForComponent(
  jiraClient: Version3Client,
  issueKeys: string[] = [],
): Promise<string[]> {
  const { componentName } = getVariables();

  if (!issueKeys.length) {
    info(`${colors.yellow}업데이트할 이슈가 없습니다!`);
    return [];
  }

  info(`${colors.white}⏳${componentName}에 속한 이슈를 필터링 중...`);

  const relatedIssues = await Promise.all(
    issueKeys.map(async (issueKey) => {
      try {
        const issue = await jiraClient.issues.getIssue({
          issueIdOrKey: issueKey,
        });
        const components = issue?.fields?.components ?? [];

        if (!components.length || components.some(({ name }) => name === componentName)) {
          return issue;
        }
        return null;
      } catch (error) {
        return null;
      }
    }),
  );

  const filteredIssues = relatedIssues.map((issue) => issue?.key).filter(Boolean);

  info(
    `${colors.green}✅ 총 ${issueKeys.length}개의 이슈 중 ${filteredIssues.length}개의 관련 이슈 필터링 완료!`,
  );

  return filteredIssues as string[];
}
