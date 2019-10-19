const {Command, flags} = require('@oclif/command');
const request = require('request');

/**
 * GithubのAPIをキックし、organization配下のリポジトリのURL一覧を取得する。
 */
class ListOrgRepoCommand extends Command {
  /**
   * コマンド実行時に呼ばれる。
   * @returns {Promise<void>}
   */
  async run() {
    //1ページ当たりの取得数。
    const PER_PAGE = 100;

    //実行時に渡された引数及びフラグを取得
    const {args, flags} = this.parse(ListOrgRepoCommand);

    // organizationがフラグで渡されていたらそれを使う。渡されていないない場合は、デフォルト値を使用する。
    let orgName = "nablarch";
    if (flags.org !== undefined) {
      orgName = flags.org;
    }

    // ページ数がフラグで渡されていたらそれを使う。渡されていないない場合は、デフォルト値を使用する。
    let pages = 2;
    if (flags.pages !== undefined) {
      pages = flags.pages;
    }

    try {
      for (let i = 1; i <= pages; i++) {
        const requestOptions = {
          //GithubのAPIをキックするためのURLを組み立てる
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

  /**
   * HTTP通信して応答を取得する。
   * @param options 通信のオプション
   * @returns {Promise<unknown>}
   */
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
