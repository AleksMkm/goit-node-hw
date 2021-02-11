import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const argv = yargs(hideBin(process.argv))
  .usage('Usage: --action list|get|add|remove [--help]')
  .alias('h', 'help')
  .alias('a', 'action')
  .demand(['action'])
  .choices('action', ['list', 'get', 'add', 'remove'])
  .default('action', 'list').argv;
