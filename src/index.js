const {Command, flags} = require('@oclif/command');
const request = require('request');

class ListOrgRepoCommand extends Command {
  async run() {
    const PER_PAGE = 100;

    const {args, flags} = this.parse(ListOrgRepoCommand);
    let orgName = "nablarch";
    if (flags.org !== undefined) {
      orgName = flags.org;
    }
    let pages = 2;
    if (flags.pages !== undefined) {
      pages = flags.pages;
    }

    try {
      for (let i = 1; i <= pages; i++) {
        let requestOptions = {
          url: "https://api.github.com/orgs/" + orgName + "/repos?per_page=" + PER_PAGE + "&page=" + i,
          headers: {
            'User-Agent': 'node.js'
          }
        };
        const res = await this.doRequest(requestOptions);
        const parsed = JSON.parse(res.body);
        for (let obj of parsed) {
          console.log(obj.clone_url);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  doRequest(options) {
    return new Promise(function (resolve, reject) {
      request(options, function (error, res) {
        if (!error && res.statusCode == 200) {
          resolve(res);
        } else {
          reject([error, res]);
        }
      });
    });
  }

}

ListOrgRepoCommand.description = `Describe the command here
...
Extra documentation goes here
`

ListOrgRepoCommand.flags = {
  help: flags.help({char: 'h', description: 'this'}),
  org: flags.string({char: 'o', description: 'organization'}),
  pages: flags.string({char: 'p', description: 'page number'}),
}

module.exports = ListOrgRepoCommand;
