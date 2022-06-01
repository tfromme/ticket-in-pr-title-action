# ticket-in-pr-title-action
Github Action to Check if a JIRA Ticket is mentioned in the PR Title

## Inputs
  ticket-prefix - Ticket Prefix to search for

  fail - Whether to fail (default) or just warn

  pr-title - Title of the PR (default ${{ github.event.pull_request.title }})

## To Build
You must have ncc installed `npm i -g @vercel/ncc`
Then run `bash build.sh`
