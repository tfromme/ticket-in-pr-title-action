# ticket-in-pr-title-action
Github Action to Check if a JIRA Ticket is mentioned in the PR Title

Inspired by https://github.com/yuzutech/annotations-action

## Inputs
  ticket-prefix - Ticket Prefix to search for

  fail - Whether to fail (default) or just warn

  token - Token to Auth to Github with (default ${{ secrets.GITHUB_TOKEN }})

## To Build
You must have ncc installed `npm i -g @vercel/ncc`
Then run `bash build.sh`
