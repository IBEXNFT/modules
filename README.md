# @orbisclub/modules

> Decentralized social modules created with the Orbis SDK

[![NPM](https://img.shields.io/npm/v/@orbisclub/modules.svg)](https://www.npmjs.com/package/@orbisclub/modules) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @orbisclub/modules
```

## Usage

```jsx
import { ChatBox } from '@orbisclub/modules'
import "@orbisclub/modules/dist/index.modern.css";

function App() {
  /** The context parameter in the <ChatBox/> object must be your group or channel id or a custom string */
  return(
    <ChatBox context="kjzl6cwe1jw147b42j1yjoxyzrzeg3czq5mjm1lrmg5eeq43yutje3f2s0s2n5h" poweredByOrbis="black" />
  );
}
```

## License

MIT © [OrbisWeb3](https://github.com/OrbisWeb3)
