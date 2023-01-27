import { error, setFailed } from '@actions/core';
import { colors } from './const';
import filterIssuesForComponent from './filterIssuesForComponent';
import getProjectVersion from './getProjectVersion';
import getVariables from './getVariables';
import initJiraClient from './initJiraClient';
import releaseProjectVersion from './releaseProjectVersion';
import updateIssues from './updateIssues';

(async () => {
  try {
    const { versionName, componentName, issueKeys } = getVariables();
    const jiraClient = initJiraClient();
    const projectVersion = await getProjectVersion(jiraClient);
    if (!projectVersion) {
      throw new Error(`🚫 Failed to find or create project version: ${versionName}`);
    }

    const issueKeysToUpdate = !componentName
      ? issueKeys
      : await filterIssuesForComponent(jiraClient, issueKeys);
    await updateIssues(jiraClient, issueKeysToUpdate);
    await releaseProjectVersion(jiraClient, projectVersion);
  } catch (e: any) {
    error(`${colors.red}${e?.message}`);
    setFailed(e?.message);
  }
})();
