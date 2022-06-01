const core = require('@actions/core');

async function runAction({ ticketPrefix, prTitle, fail }) {
  const re = new RegExp(`${ticketPrefix}-[1-9][0-9]*`);

  if (!re.test(prTitle)) {
    const errorMessage = `No Tickets matching ${ticketPrefix} found in PR Title.`;
    if (fail) {
      core.setFailed(errorMessage);
    } else {
      core.warning(errorMessage, {title: "Missing Ticket in Title"});
    }
  }
}

function parseBool(str) {
  return str === 'true' || str === true;
}

function parseInputs() {
  return {
    ticketPrefix: core.getInput('ticket-prefix'),
    prTitle: core.getInput('pr-title'),
    fail: parseBool(core.getInput('fail')),
  }
}

const options = parseInputs()
runAction(options);
