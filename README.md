# Blackboard Learn Ultra Embedded Content
This repo provides a bb-library-ui-components and utilities, as well as a getting started project, for building a Blackboard style content provider to embed content in Learn Ultra.

# NPM Commands

## How to run scripts in all sub-folders

Starting in the root, top-level directory, the following will run scripts at the root level and each "node package" in the `/packages` folder starting first with the library packages

### Install all dependencies
```bash
npm run install:all
```

### Run all tests
```bash
npm run test:all
```

### Run all tests with coverage
```bash
npm run test:coverage:all
```

This command will create a `/coverage` folder. In this folder, there will be a file called `clover.xml`. In addition, Jest also creates an html report in `/coverage/lcov-report/index.html`

### Run all linters
```bash
npm run lint:all
```

# Posting Messages
The enclosing window will accept messages sent from each content provider. See javascript's `postMessage` api for further details.

For example:
```javascript
window.parent.postMessage(message, document.referrer)
```
These messages must follow a specific configuration.

#### Sample Messages
Example 1
```typescript
{
    messageType: 'content_canceled'
}
```

Example 2
```typescript
{
    dataType: 'video', /* Required when type is 'content_ready' */
    dataContent: {
        alt: 'Some alternative text for accessibility', /* Required when type is 'content_ready' */
        src: 'src for embeddable content or links' /* Required when type is 'content_ready' and output is embeddable */
        /* ... dynamic key/value pairs */
        response?: {}
    }, /* Required when type is 'content_ready' */
    messageType: 'content_ready'
}
```
#### accepted values
`messageType`:
>'content_canceled': Close the dialog, canceling any actions,

>'content_ready': Send with content to signal change in ultra and apply to editor

`dataType`:
> 'video' or 'image'

# Receiving Messages
Add an event listener on `componentWillMount` to to handle messages posted from Blackboard Learn.

For example:
```javascript
window.addEventListener('message', receiveMessage, false);

function receiveMessage() {
    receiveMessage(event) {
        // This is a security measure to ensure that we only respond to messages
        // that originated from a parent/referrer that is the window embedding this iFrame
        if (document.referrer !== event.origin) {
            return;
        }

        // Respond to incoming message
    }
}
```
These messages must follow a specific configuration.

#### Sample Messages
Example 1
```typescript
{
    messageType: 'init_content',
    config: {},
    dataToDisplay: {
        mode: 'create',
        content: {
            dataType: 'embedded-app',
            dataContent: {},
        },
    },
}
```

#### accepted values
`messageType`:
>'init_content': Load the iFrame/mashup with respective configuration

`config`:
> 'apiBasePath': 'base api path for server queries'
> 'locale': 'localization string to select current locale'
> 'xsrfToken': 'token for secure server transactions'

`dataToDisplay`:
> 'mode': '"create", "edit", or "view"'
> 'content': 'object containing 'dataContent'
 and 'dataType' for editing existing mashups
# More Info
Check the `packages/bb-ui-getting-started` or `packages/bb-ui-getting-started-typescript` directory for step-by-step instructions to create and develop a new content provider.

## Helper Utilities and Libraries

Find access to some common utilities/libraries that we have included to help match the styling and UX choices found in Ultra UI. We have also included various javascript utilities that we find helpful for our internal development workflow.

### How to Include a component
Simply add an import to the top of a file, ie.
```javascript
import { Spinner } from '../packages/bb-library-ui-components/react'
```
NOTE: Typescript requires a different import format for resolving .js files
```javascript
import { Spinner } from '../packages/bb-library-ui-components/react/index.js'
```

### How to Include a utility
Simply add an import to the top of a file, ie.
```javascript
import { configureTranslator } from '../packages/bb-library-utilities/main'
```
NOTE: Typescript requires a different import format for resolving .js files
```javascript
import { configureTranslator } from '../packages/bb-library-utilities/main/index.js'
```
