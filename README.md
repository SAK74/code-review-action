# AI Pull-Review

Automated, AI-powered PR summaries and review support for CI/CD, based on PR diffs.

- [Parameters](#parameters)
- [Permissions](#permissions)
- [Important Configuration](#important-configuration)
- [Usage](#usage)
- [Sample Results](#sample-results)

### Parameters

- #### Inputs

  - **`OPENAI_API_KEY`** \* - API key for OpenAI requests
  - **`open_ai_model`** - preferred OpenAI model for interaction (_gpt-3.5-turbo_, _gpt-4_, _gpt-4-turbo_, _o1-preview_, ... **default** _gpt-4o-mini_)
  - **`with-comment`** - _boolean_; if true, adds comments in the PR (**default** _false_)

- #### Env

  - **`GITHUB_TOKEN`** \* - for read/write access to the repository

### Permissions

&nbsp; Ensure the following permissions are set in your workflow to access PR metadata:

```yaml
permissions:
  pull-requests: write
  contents: read
  repository-projects: write
```

### Important Configuration

&nbsp;&nbsp; To enable access to the repository's git history, the checkout action must be configured with **`fetch-depth: 0`**

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

### Usage

- For automatic PR description generation, simply enter _`auto`_ in the description field.

#### Example workflow:

```yaml
name: Test workflow
on:
  pull_request:
    types: [opened, edited, reopened]

jobs:
  test-job:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
      repository-projects: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 #required to git history access
        name: Checkout repository

      - uses: SAK74/code-review-action@v1
        name: Call action
        with:
          OPENAI_API_KEY: ${{secrets.OPENAI_API_KEY}}
          with-comment: true # optional to make comment (default false)
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}} # reqired
```

#### that's it! :relaxed:

### Sample Results
![descr_1](https://github.com/user-attachments/assets/4e1ebb7b-cbc3-4b66-86fb-9fb2039b8d2f)
![comment_1](https://github.com/user-attachments/assets/b75b0c28-33d4-4c8f-9627-ecb514908f65)

