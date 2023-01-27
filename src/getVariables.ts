import { getInput } from '@actions/core';

export default function getVariables() {
  const host = getInput('host', { required: true });
  const email = getInput('email', { required: true });
  const apiToken = getInput('apiToken', { required: true });
  const issueKeys = getInput('issueKeys', { required: true });
  const projectKey = getInput('projectKey', { required: true });
  const versionPrefix = getInput('versionPrefix', { required: true });
  const version = getInput('version', { required: true });
  const versionName = `${versionPrefix}${version}`;
  const doneStatusName = getInput('issueDoneStatusName');
  const componentName = getInput('componentName');

  return {
    host,
    email,
    apiToken,
    issueKeys: issueKeys.split(','),
    projectKey,
    versionName,
    componentName,
    doneStatusName,
  };
}
