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
      throw new Error(`🚫 프로젝트 버전(${versionName}) 조회 및 생성 실패!`);
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
