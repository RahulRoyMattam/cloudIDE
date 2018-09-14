# CloudIDE

This project is a node.js hosted web app exposing a (Codemirror UI)[https://codemirror.net/index.html].
The project was a means of exploring how to setup a node.js app using express.js for easy templated routing.

As an experiment, the project implements a custom autocomplete feature based on the TRIE data structure and explores sharing code with other users connected to the same server.

For enabling users to share code with other users we tweaked code mirror UI to look out for custom syntax tags that marked a code section in the code mirror editor box as shareable.

