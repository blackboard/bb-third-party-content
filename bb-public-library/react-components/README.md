# Common React Component
We have included this helper components to provide common Blackboard structural design patterns, localization/accessibility solutions, and styling to build a content provider that blends in with the Blackboard Learn UI.

## How to Include a component
Simply add an import to the top of a file, ie.
```javascript
import { Spinner } from 'bb-public-library/react-components'
```
NOTE: Typescript requires a different import format for resolving .js files
```javascript
import { Spinner } from 'bb-public-library/react-components/index.js'
```