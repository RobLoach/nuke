# nuke (Better name welcome)
Batch editing tools for repos under jstransformers organization.

## clone.js

Clones all interesting repos under the jstransformers org to current directory
or a specified directory. If a directory with the name of the repo already
exists and is not empty then it is skipped.

## david.js

Checks the dependency status of all packages, and outputs a nice table to the
console. This does not require cloning all the repos first.

## list.js

List all interesting repos under the jstransformers organization. This does not
require to cloning all the repos first.

## test.sh

Installs and tests all cloned repos, and log the failed ones to file `bad` in
the current working directory.

The root directory of the cloned repos can be specified in `config.sh`.
