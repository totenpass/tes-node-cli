import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs'
import * as path from 'path'
import * as tes from '@totenpass/tes'

export default class Decrypt extends Command {
  static description = 'Uses a passphrase to decrypt a base64 encrypted with the Total Encryption Standard'

  static flags = {
    help: flags.help({ char: 'h', description: 'Shows help' }),
    dest: flags.string({ char: 'd', description: 'Decryption destination file' }),
  }

  static usage = `$ tescli decrypt <file>`
  
  static args = [{ name: 'fileOrText' }]

  async run() {
    const { args, flags } = this.parse(Decrypt)
    const { fileOrText } = args;
    const file = fileOrText ?? await cli.prompt("Enter a file path or some text to encrypt");
    const password = await cli.prompt("Enter the encryption passphrase");
    const dest = flags.dest;
    const fallbackfilename = `./tes-dec-${Date.now()}.txt`;
    const filepath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);

    switch (true) {
      case file === '':
      case typeof file === 'undefined':
        this.error("No file or text specified", { exit: 1 })
    }

    let encfilecontent = "";

    if (fs.existsSync(filepath)) {
      encfilecontent = fs.readFileSync(filepath, 'utf8');
    } else {
      encfilecontent = file;
    }
    
    const decrypted = await tes.decrypt(encfilecontent, password);

    let filecontent: string | Buffer = "";
    let filename: string = '';
    let kind: 'file' | 'text';

    if (tes.FileDecryptionResult.isFileDecryptionResult(decrypted)) {
      filename = dest ?? decrypted.filename;
      filecontent = Buffer.from(decrypted.filecontent);
      kind = 'file';
    } else if (tes.TextDecryptionResult.isTextDecryptionResult(decrypted)) {
      filename = dest ?? fallbackfilename;
      filecontent = decrypted.text;
      kind = 'text';
    } else {
      this.error("Could not decrypt file", { exit: 1 });
    }

    const destpath = path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);

    if (fs.existsSync(destpath)) {
      const opt = await cli.prompt("A file with the same name already exists. Do you want to override it? (Y/n)", { default: 'n' });
      const shouldoverride = String(opt).toUpperCase() === 'Y';
      
      if (shouldoverride) {
        fs.unlinkSync(destpath);
      } else {
        this.error(`${destpath} already exists`, { exit: 1 });
      }
    }

    fs.writeFileSync(destpath, filecontent);

    this.log(`Decrypted ${kind} to ${destpath}`);
  }
}
