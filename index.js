const core = require('@actions/core');
const github = require('@actions/github');

async function createCheck(octokit, owner, repo, ref) {
  const { data: {id: checkRunId } } = await octokit.rest.checks.create({
    owner,
    repo,
    name: "Check if Ticket in PR Title",
    head_sha: ref,
    status: 'in_progress',
  })
  return checkRunId;
}

async function updateCheck(octokit, owner, repo, checkRunId, errorMessage) {
  await octokit.rest.checks.update({
    owner,
    repo,
    check_run_id: checkRunId,
    status: 'completed',
    conclusion: 'neutral',
    output: {
      title: 'Check if Ticket in PR Title',
      summary: errorMessage,
      annotations: [{title: 'Missing Ticket in Title'}],
    },
  });
}

async function setAnnotation(token, context, errorMessage) {
  const octokit = github.getOctokit(token);
  const annotation = {title: "Missing Ticket in Title"};
  const checkRunId = await createCheck(
    octokit, context.repo.owner, context.repo.repo, context.payload.pull_request.head.sha
  );
  await updateCheck(octokit, context.repo.owner, context.repo.repo, checkRunId, errorMessage);
  core.warning(errorMessage, annotation);
}

async function runAction({ token, ticketPrefix, fail }) {
  const pullRequest = github.context.payload.pull_request;
  if (!pullRequest) {
    core.setFailed("Action not run in pull_request context.");
    return
  }
  const prTitle = pullRequest.title;

  const re = new RegExp(`${ticketPrefix}-[1-9][0-9]*`);

  if (!re.test(prTitle)) {
    const errorMessage = `No Tickets matching ${ticketPrefix} found in PR Title.`;
    if (fail) {
      core.setFailed(errorMessage);
    } else {
      try {
        await setAnnotation(token, github.context, errorMessage);
      } catch (err) {
        core.setFailed(err);
      }
    }
  }
}

function parseInputs() {
  return {
    token: core.getInput('token'),
    prTitle: core.getInput('pr-title'),
    fail: core.getBooleanInput('fail'),
  }
}

const options = parseInputs()
runAction(options);
