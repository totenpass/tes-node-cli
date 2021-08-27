import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs'
import * as path from 'path'
import * as tes from '@totenpass/tes'

export default class Encrypt extends Command {
  static description = `Uses a passphrase to encrypt a file to base64 using the Total Encryption Standard`

  static usage = `$ tescli encrypt <file>`

  static examples = [
    `$ tescli encrypt ./test.txt -m 2`,
    `$ tescli encrypt ./test.txt -o 4`,
    `$ tescli encrypt ./test.txt -d ./encrypted-test.tsx`,
    `$ tescli encrypt ./test.txt -d ./encrypted-test.tsx -m 2 -o 4`,
  ]

  static flags = {
    help: flags.help({ char: 'h', description: 'Shows help' }),
    memory: flags.integer({ char: 'm', description: 'Memory multiplier' }),
    operations: flags.integer({ char: 'o', description: 'Number of operations' }),
    dest: flags.string({ char: 'd', description: 'Encryption destination file' }),
  }

  static args = [{ name: 'fileOrText' }]

  async run() {
    const { args, flags } = this.parse(Encrypt)
    const { fileOrText } = args;
    const file = fileOrText ?? await cli.prompt("Enter a file path or some text to encrypt");
    const mem = flags.memory ?? 2;
    const ops = flags.operations ?? 4;
    const dest = flags.dest ?? `./tes-enc-${Date.now()}.txt`;
    const password = await cli.prompt("Enter the encryption passphrase");
    const passwordconfirm = await cli.prompt("Confirm the encryption passphrase");
    const destpath = path.isAbsolute(dest) ? dest : path.join(process.cwd(), dest);

    switch (true) {
      case file === '':
      case typeof file === 'undefined':
        this.error("No file or text specified", { exit: 1 })
      case password !== passwordconfirm:
        this.error("Passphrase do not match", { exit: 1 })
      case mem < 0:
        this.error("Invalid memory multiplier", { exit: 1 })
      case ops < 1:
        this.error("Invalid number of operations", { exit: 1 })
      case fs.existsSync(destpath):
        this.error("Destination file already exists", { exit: 1 })
    }

    const filepath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
    const encryptedcontent = await this.encrypt(filepath, password, ops, mem, file);

    fs.writeFileSync(destpath, encryptedcontent, 'utf8');

    this.log("File encrypted successfully")
  }

  private encrypt(filepath: any, password: any, mem: number, ops: number, file: any) {
    if (fs.existsSync(filepath)) {
      return this.encryptfile(filepath, password, mem, ops)
    } else {
      return this.encrypttext(file, password, mem, ops)
    }
  }

  private encrypttext(file: any, password: any, mem: number, ops: number) {
    return tes.encrypt(file, password, mem, ops)
  }

  private encryptfile(filepath: any, password: any, mem: number, ops: number) {
    const filename = path.basename(filepath)
    const filestat = fs.statSync(filepath)

    switch (true) {
      case filestat.isDirectory():
        this.error("Cannot encrypt a directory", { exit: 1 })
      case filestat.isSymbolicLink():
        this.error("Cannot encrypt a symbolic link", { exit: 1 })
      case filestat.isSocket():
        this.error("Cannot encrypt a socket", { exit: 1 })
      case filestat.isFIFO():
        this.error("Cannot encrypt a FIFO", { exit: 1 })
      case filestat.isBlockDevice():
        this.error("Cannot encrypt a block device", { exit: 1 })
      case filestat.isCharacterDevice():
        this.error("Cannot encrypt a character device", { exit: 1 })
    }

    const filecontent = fs.readFileSync(filepath, 'utf8')

    return tes.encrypt(filecontent, password, mem, ops, filename)
  }
}
