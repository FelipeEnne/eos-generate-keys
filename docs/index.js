var state
let privateKeyPair = null


var render = ({
 publicKey
}) => <div>
  <p style={{ width: "95%" }}>
    This will generate a private and public key pair for the EOS chain.
  </p>

    <div className="pane">
      <table><tbody>
        <tr>
          <th>EOS public key</th>
          <td style={{ textAlign: "left" }}>
            <span>
              <a href="#" id="generate-link" style={{ float: "right" }}
                 onClick={event => (generate(), event.preventDefault())}>
                Generate EOS key
              </a>
            </span>
          </td>
        </tr>
      </tbody></table>
    </div>
    <div className="hidden pane" id="generate-pane">
      <span id="generate-progress">
        Generating key...
      </span>
      <div id="generate-confirm" className="hidden">
        <h3>{publicKey ? "Change" : "Register"} EOS key</h3>

        {publicKey ? <p>This will replace your EOS claim key:
          <table>
            <tbody>
              <tr>
                <th>Public key</th>
                <td style={{textAlign: 'left'}}>
                  <span style={{width: '30em'}}>{publicKey}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </p> : <span></span>}

        <p>Please back up the private key displayed below in multiple
        safe locations before continuing.  You should make more than
        one copy and keep all copies in separate secure locations.
        If you use an external storage device such as a USB stick,
        make sure to safely eject the device before continuing.</p>

        <table>
          <tbody>
            <tr>
              <th>Description</th>
              <td style={{ textAlign: "left" }}>
                EOS Token Key
              </td>
            </tr>
            <tr>
              <th>Public key</th>
              <td style={{textAlign: 'left'}}>
                <code id="generate-pubkey" style={{ width: "30em" }}></code>
              </td>
              <td style={{textAlign: 'left'}}>
                <code id="generate-pubkey-error" style={{ width: "30em" }}></code>
              </td>
            </tr>
            <tr>
              <th>Private key</th>
              <td style={{ textAlign: "left" }}>
                <code id="generate-privkey" style={{ width: "30em" }}></code>
              </td>
              <td style={{ textAlign: "left" }}>
                <code id="generate-privkey-error" style={{ width: "30em" }}></code>
              </td>
            </tr>

          </tbody>
        </table>

        <p>

          There is no way to recover your private key.  You must save
          it right now or you will be unable to access your EOS tokens
          when the sale ends.

        </p>
      </div>
    </div>
  </div>

state = Object.assign({}, state, 0)
ReactDOM.render(render(state), byId("app"))

function generate() {
    showPane('generate')

    setTimeout(() => {
        privateKeyPair = genKeyPair()
        hide("generate-progress")
        byId("generate-pubkey").innerHTML = privateKeyPair.pubkey
        byId("generate-pubkey-error").innerHTML = privateKeyPair.pubkeyError
        byId("generate-privkey").innerHTML = privateKeyPair.privkey
        byId("generate-privkey-error").innerHTML = privateKeyPair.privkeyError
        show("generate-confirm")
    })
}

function genKeyPair() {
    var {PrivateKey, PublicKey} = eos_ecc
    var d = PrivateKey.randomKey()
    var privkey = d.toWif()
    var pubkey = d.toPublic().toString()

    var pubkeyError = null
    try {
      PublicKey.fromStringOrThrow(pubkey)
    } catch(error) {
      console.log('pubkeyError', error, pubkey)
      pubkeyError = error.message + ' => ' + pubkey
    }

    var privkeyError = null
    try {
      var pub2 = PrivateKey.fromWif(privkey).toPublic().toString()
      if(pubkey !== pub2) {
        throw {message: 'public key miss-match: ' + pubkey + ' !== ' + pub2}
      }
    } catch(error) {
      console.log('privkeyError', error, privkey)
      privkeyError = error.message + ' => ' + privkey
    }

    if(privkeyError || pubkeyError) {
      privkey = 'DO NOT USE'
      pubkey = 'DO NOT USE'
    }

    return {pubkey, privkey, pubkeyError, privkeyError}
}

function showPane(name) {
    hidePanes()
    show(`${name}-pane`)
    hide(`${name}-link`)
}

function hidePanes() {
    for (var x of "generate transfer buy register".split(" ")) {
        try {
            show(`${x}-link`)
            hide(`${x}-pane`)
        } catch (error) {}
    }
}
