# Update JIRA issues and release project version

- This action update JIRA issues as `Done` and release project version

## Inputs

| Name                  | Required | Description                                                   | Default |
| --------------------- | -------- | ------------------------------------------------------------- | ------- |
| `host`                | ✅       | JIRA host address (ex. 'https://dramancompany.atlassian.net') | -       |
| `email`               | ✅       | JIRA email (ex. 'abc@dramancompany.atlassian.net')            | -       |
| `apiToken`            | ✅       | JIRA api token                                                | -       |
| `issueKeys`           | -        | JIRA issue keys to update (ex. 'ABC-1,ABC-2')                 | -       |
| `projectKey`          | ✅       | JIRA project key (ex. 'ABC')                                  | -       |
| `versionPrefix`       | ✅       | version prefix (ex. 'career-v')                               | -       |
| `version`             | ✅       | release version (ex. '1.0.0')                                 | -       |
| `componentName`       | -        | JIRA component name to release (ex. 'career-web')             | -       |
| `issueDoneStatusName` | -        | JIRA issue status name that represents `Done` (ex. 'Done')    | 'Done`  |

## Outputs

N/A

## Example Usage

```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  if: ${{ github.event.pull_request.merged }}
  runs-on: ubuntu-latest
  steps:
    - name: Get new version
      id: get-new-version

    - name: Extract JIRA issue keys
      id: jira-issue-keys
      uses: dramancompany/extract-jira-issue-keys@v1.0.0
      with:
        githubToken: ${{ secrets.GITHUB_TOKEN }}

    - name: Update JIRA issues and release project version
      uses: dramancompany/jira-release@v1.0.0
      with:
        host: ${{ secrets.JIRA_HOST }}
        email: ${{ secrets.JIRA_EMAIL }}
        apiToken: ${{ secrets.JIRA_API_TOKEN }}
        issueKeys: ${{ steps.jira-issue-keys.outputs.issueKeys }}
        projectKey: 'PCWEB'
        versionPrefix: 'career-v'
        version: ${{ steps.get-new-version.outputs.version }}
        componentName: 'career-web'
```

## 배포 순서

### 1. package.json의 버전 수정

### 2. 빌드

```bash
$ pnpm build
```

### 3. main 브랜치에 merge 혹은 push

### 4. 버전 태그 생성

```
$ git tag -am "v1.0.0" v1.0.0
$ git push --follow-tags
```

### 5. Github Release 생성

![image](https://user-images.githubusercontent.com/28733869/226802590-c4e23c60-85ad-4147-b369-c80e30a0f217.png)
![image](https://user-images.githubusercontent.com/28733869/226802836-4ce59161-5254-4fd5-962b-1c2e94771bcb.png)
