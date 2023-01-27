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
    info(`${colors.yellow}No issues to update`);
    return [];
  }

  info(`${colors.white}⏳Filtering issues for ${componentName}...`);

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

  info(`${colors.green}✅Found ${filteredIssues.length} issues out of ${issueKeys.length}!`);

  return filteredIssues as string[];
}
