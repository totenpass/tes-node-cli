@totenpass/cli
==============

Cli for encoding and decoding using the Total Encryption Standard

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@totenpass/cli.svg)](https://npmjs.org/package/@totenpass/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@totenpass/cli.svg)](https://npmjs.org/package/@totenpass/cli)
[![License](https://img.shields.io/npm/l/@totenpass/cli.svg)](https://github.com/totenpass/node-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @totenpass/tescli
$ tptes COMMAND
running command...
$ tptes (-v|--version|version)
@totenpass/tescli/1.0.0 darwin-arm64 node-v14.17.0
$ tptes --help [COMMAND]
USAGE
  $ tptes COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`tptes $ tescli decrypt <file>`](#tptes--tescli-decrypt-file)
* [`tptes $ tescli encrypt <file>`](#tptes--tescli-encrypt-file)
* [`tptes help [COMMAND]`](#tptes-help-command)

## `tptes $ tescli decrypt <file>`

Uses a passphrase to decrypt a base64 encrypted with the Total Encryption Standard

```
USAGE
  $ tptes $ tescli decrypt <file>

OPTIONS
  -d, --dest=dest  Decryption destination file
  -h, --help       Shows help
```

_See code: [src/commands/decrypt.ts](https://github.com/totenpass/node-cli/blob/v1.0.0/src/commands/decrypt.ts)_

## `tptes $ tescli encrypt <file>`

Uses a passphrase to encrypt a file to base64 using the Total Encryption Standard

```
USAGE
  $ tptes $ tescli encrypt <file>

OPTIONS
  -d, --dest=dest              Encryption destination file
  -h, --help                   Shows help
  -m, --memory=memory          Memory multiplier
  -o, --operations=operations  Number of operations

EXAMPLES
  $ tescli encrypt ./test.txt -m 2
  $ tescli encrypt ./test.txt -o 4
  $ tescli encrypt ./test.txt -d ./encrypted-test.tsx
  $ tescli encrypt ./test.txt -d ./encrypted-test.tsx -m 2 -o 4
```

_See code: [src/commands/encrypt.ts](https://github.com/totenpass/node-cli/blob/v1.0.0/src/commands/encrypt.ts)_

## `tptes help [COMMAND]`

display help for tptes

```
USAGE
  $ tptes help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
