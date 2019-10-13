const {Command, flags} = require('@oclif/command')

class ListOrgRepoCommand extends Command {
  async run() {
    const {flags} = this.parse(ListOrgRepoCommand)

    let options = {
      hostname: 'api.github.com',
      path: '/orgs/nablarch/repos?per_page=200&page=1',
      method: 'GET',
      headers: {
        'User-Agent': 'node.js'
      }
    }
    const req = require('https').get(options).end()
    req.on('response', (res) => {
      let body = ''
      res.on('data', function (chunk) {
        body += chunk
      })
      res.on('end', () => {
        const parsed = JSON.parse(body)
        for (let obj of parsed) {
          console.log(obj.clone_url)
        }
      })
    })
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

module.exports = ListOrgRepoCommand
