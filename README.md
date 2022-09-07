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

## Styling
By default, the chat box is going to follow a default orange theme but it's possible to customize it to have the chatbox follow your own style, here is how it works:

```jsx
import { ChatBox } from '@orbisclub/modules'
import "@orbisclub/modules/dist/index.modern.css";

let chat_theme = {
  /** Style for main buttons */
  mainCta: {
    background: 'linear-gradient(135deg, #FF94B4 0%, #AA6AFB 100%)'
  },

  /** Style for the connect button */
  connectBtn: {
    background: 'linear-gradient(135deg, #FF94B4 0%, #AA6AFB 100%)'
  },

  /** Style for the messages sent and received */
  messagesContainer: {
    background: '#DDD'
  },
  messageSent: {
    background: 'linear-gradient(135deg, #FF94B4 0%, #AA6AFB 100%)'
  },
  messageReceived: {
    background: '#fff'
  },

  /** Style for the header and footer (input container) */
  header: {
    background: 'linear-gradient(135deg, #FF94B4 0%, #AA6AFB 100%)',
    color: "#FFF"
  },
  footer: {
    background: "#F2F2F2"
  },

  /** Reply text */
  replyLine: {
    borderColor: "#696969"
  },
  replyText: {
    color: "#696969"
  },

  /** Input style */
  input: {
    background: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD"
  }
};

function App() {
  /** The context parameter in the <ChatBox/> object must be your group or channel id or a custom string */
  return(
    <ChatBox
      context="kjzl6cwe1jw147b42j1yjoxyzrzeg3czq5mjm1lrmg5eeq43yutje3f2s0s2n5h"
      theme={chat_theme}
      title="You can use a custom title"
      poweredByOrbis="white" />
  );
}
```

## License

MIT © [OrbisWeb3](https://github.com/OrbisWeb3)
