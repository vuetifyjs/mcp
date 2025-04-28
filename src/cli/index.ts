import { intro } from '../cli/intro.js'

intro('config')

// TODO: use @clack/prompts and ask user to add to global settings for selected IDEs:
/**
  Example:
import { confirm, multiselect } from '@clack/prompts';

const shouldAddGlobally = await confirm({
  message: 'Add to global settings?',
});
  const idesToInstall = []
  if (confirm !== true) { // might be symbol or boolean
    process.exit(0)
  }
  if (confirm && ides.length > 1) {
    // ask to multiselect IDEs to add to global settings
    const idesToInstall = await multiselect({
      message: 'Select IDEs to add to global settings',
      options: ides.map(ide => ({ value: ide.ide, label: ide.ide })),
    });
  } else  {
    // push firstIDE to idesToInstall
  }

  Now we have paths, we have ides, need to read settings.json as jsonc and add to it
 */
