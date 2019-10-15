const {Command, flags} = require('@oclif/command');

class ListOrgRepoCommand extends Command {
  async run() {
    const {flags} = this.parse(ListOrgRepoCommand);
    const orgName = "nablarch";
    const perPage = 200;
    const page = 1;
    const requestOptions = {
      url: "https://api.github.com/orgs/" + orgName + "/repos?per_page=" + perPage + "&page=" + page,
      headers: {
        'User-Agent': 'node.js'
      }
    };
    require('request')(requestOptions, this.requestCallback);
  }

  requestCallback(error, response, body) {
    if (response.statusCode === 200) {
      const parsed = JSON.parse(body);
      for (let obj of parsed) {
        console.log(obj.clone_url);
      }
    } else {
      console.error(response.statusCode);
    }
  }
}

ListOrgRepoCommand.description = `Describe the command here
...
Extra documentation goes here
`

ListOrgRepoCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ListOrgRepoCommand;
