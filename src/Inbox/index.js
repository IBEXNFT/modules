import React, { useState, useEffect, useRef } from "react";
import styles from './ChatBox.module.css';
import { Orbis } from "@orbisclub/orbis-sdk";
import { getAddressFromDid } from "@orbisclub/orbis-sdk/utils/index.js";
import makeBlockie from 'ethereum-blockies-base64';

/** Initialize the Orbis class object */
let _orbis = new Orbis();
let _theme = {};

export function Inbox({orbis, context, theme, poweredByOrbis, title = "Ask your questions to our community."}) {
  /** Save theme passed as prop globally */
  if(theme) {
    _theme = theme;
  }

  /** Return ChatBox */
  if(orbis) {
    return(
      <InboxContent title={title} orbis={orbis} context={context} poweredByOrbis={poweredByOrbis} />
    )
  } else {
    return(
      <InboxContent title={title} orbis={_orbis} context={context} poweredByOrbis={poweredByOrbis} />
    );
  }
}

/** Orbis contact module */
function InboxContent({orbis, context, poweredByOrbis, title}) {
  const [user, setUser] = useState();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState();
  const [replyToText, setReplyToText] = useState();

  /** Used to reply to a specific post */
  function reply(message) {
    if(message) {
      setReplyTo(message.stream_id);
      setReplyToText(message.content.body);
    } else {
      setReplyTo(null);
      setReplyToText(null);
    }
  }

  /** Load messages sent in channel on load */
  useEffect(() => {
    if(expanded) {
      getIsConnected();
      getSupportChannelMessages();
    }

    /** Check if user is connected */
    async function getIsConnected() {
      let res = await orbis.isConnected();

      /** If SDK returns user details we save it in state */
      if(res && res.status == 200) {
        setUser(res.details);
      }
    }

    /** Load messages */
    async function getSupportChannelMessages() {
      setLoading(true);
      let { data, error } = await orbis.getPosts({ context: context });
      setLoading(false);
      setMessages(data);
    }
  }, [expanded])

  /** Show powered by Orbis logo */
  function PoweredByOrbis() {
    switch(poweredByOrbis) {
      /** Show black logo */
      case "black":
        return(
          <a href="https://orbis.club" target="_blank" rel="noreferrer">
            <img src='https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/powered-by-orbis-black.png?t=2022-08-16T15%3A43%3A55.818Z' height="16" />
          </a>
        );
      /** Show white logo */
      case "white":
        return(
          <a href="https://orbis.club" target="_blank" rel="noreferrer">
            <img src='https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/powered-by-orbis-white.png?t=2022-08-16T15%3A44%3A13.487Z' height="16" />
          </a>
        );

      /** Hide logo */
      case null:
        return null;

      /** By default show the black version of the logo */
      default:
        return(
          <a href="https://orbis.club" target="_blank" rel="noreferrer">
            <img src='https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/powered-by-orbis-black.png?t=2022-08-16T15%3A43%3A55.818Z' height="16" />
          </a>
        );
    }
  }

  return(
    <div className={styles.chatBoxContainer}>
      {/** CTA to open the contact module */}
      <div className={styles.chatBoxContainerCta} style={_theme.mainCta} onClick={() => setExpanded(!expanded)}>
        {expanded ?
          <img src="https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/icons/question-close.png?t=2022-08-16T15%3A44%3A35.039Z" height="27" />
        :
          <img src="https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/icons/question-message.png?t=2022-08-16T15%3A44%3A44.696Z" height="27" />
        }
      </div>

      {/** Expanded view of the contact module */}
      {expanded &&
        <div className={styles.chatBoxContainerExpanded}>
          <div className={styles.chatBoxHead} style={_theme.header}>
            {title != null &&
              <p>{title}</p>
            }
            <p style={{marginTop: 5}}>
              <PoweredByOrbis />
            </p>
          </div>
          {/** List messages sent in the group */}
          <div className={styles.chatBoxMessagesContainer} style={_theme.messagesContainer}>
            {loading &&
              <p style={{width: "100%", textAlign: "center" }}><img src="https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/icons/question-spinner-black.png?t=2022-08-16T15%3A45%3A06.071Z" className={styles.loadingSpinner}/></p>
            }
            <Messages
              user={user}
              messages={messages}
              reply={reply}
              replyTo={replyTo} />

          </div>

          {/** Display input */}
          <div className={styles.chatBoxInputContainer} style={_theme.footer}>
          {user ?
            <MessageBox
              orbis={orbis}
              user={user}
              context={context}
              messages={messages}
              setMessages={setMessages}
              reply={reply}
              replyTo={replyTo}
              replyToText={replyToText} />
          :
            <p style={{width: "100%", textAlign: "center", margin: 0}}>
              <ConnectButton orbis={orbis} user={user} setUser={setUser} />
            </p>
          }
          </div>
        </div>
      }
    </div>
  );
}

/** List messages sent in the support channel */
function Messages({user, messages, reply, replyTo}) {
  /** Loop through all messages sent in this channel */
  return messages.map((message, key) => {
    return(
      <Message user={user} message={message} key={key} reply={reply} replyTo={replyTo} />
    )
  });
}

/** Display one message */
function Message({user, message, reply, replyTo}) {
  const [hoverRef, isHovered] = useHover();

  return(
    <div ref={hoverRef} className={user && message.creator == user.did ? styles.chatBoxOneMessageContainerSender : styles.chatBoxOneMessageContainer}>
      {/** Left side PfP */}
      {(!user || user == null || (user && message.creator != user.did)) &&
        <div style={{marginRight: 3}}>
          <PfP did={message.creator} details={message.creator_details} displayBadge={false} />
        </div>
      }

      {/** Message content */}
      <div className={styles.flexColumn}>
        {message.reply_to &&
          <div className={styles.flexRow}>
            <div className={styles.chatBoxOneMessageReplyLine}  style={_theme.replyLine}></div>
            <div className={styles.chatBoxOneMessageReply} style={_theme.replyText}>{message.reply_to_details && message.reply_to_details.body && message.reply_to_details.body.length > 40 ? shortMessage(message.reply_to_details.body, 40) : message.reply_to_details.body }</div>
          </div>
        }
        <div className={styles.chatBoxOneSupportMessage} style={user && message.creator == user.did ? _theme.messageSent : _theme.messageReceived}><p>{message.content.body}</p></div>
      </div>

      {/** Right-side PfP */}
      {user && message.creator == user.did &&
        <div style={{marginLeft: 3}}>
          <PfP did={message.creator} details={message.creator_details} displayBadge={false} />
        </div>
      }

      {/** Display only if user is hovering the message */}
      {isHovered &&
        <div className={styles.hoveredActions}>
          <div className={styles.hoveredAction} onClick={() => reply(message)}>
            <img src="https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/icons/question-replyto.png?t=2022-08-16T15%3A45%3A14.642Z" height="15" />
          </div>
        </div>
      }

      {/** Show if the message is being replied to */}
      {replyTo && replyTo == message.stream_id &&
        <div className={styles.hoveredActions}>
          <div className={styles.hoveredAction} onClick={() => reply(null)}>
            <img src="https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/icons/question-replyto-active.png?t=2022-08-16T15%3A45%3A23.656Z" height="15" />
          </div>
        </div>
      }
    </div>
  )
}

/** Show message box */
function MessageBox({user, orbis, context, messages, setMessages, replyTo, replyToText, reply}) {
  const [message, setMessage] = useState();
  const [sending, setSending] = useState(false);
  const contactInput = useRef(null);

  /** Automatically focus on input when a post is being replied to */
  useEffect(() => {
    if(replyTo) {
      if(contactInput.current) {
        contactInput.current.focus();
      }
    }
  }, [replyTo])

  /** Send message to Cerscan support channel */
  async function sendMessage() {
    /** Make sure message isn't empty. */
    if(!message || message == "") {
      alert("You can't share an empty message.");
      return;
    };

    setSending(true);
    let res = await orbis.createPost({
      body: message,
      context: context,
      reply_to: replyTo ? replyTo : null,
      master: replyTo ? replyTo : null
    });
    console.log("res sharing post: ", res);
    if(res.status == 200) {
      setSending(false);

      /** Reset text box */
      setMessage("");
      if(contactInput.current) {
        contactInput.current.textContent = "";
        contactInput.current.focus();
      }

      /** Generate callback to insert in messages array */
      let nMessage = {
        creator: user.did,
        creator_details: {
          did: user.did,
          profile: user.profile
        },
        stream_id: res.doc,
        content: {
          body: message,
          context: context
        },
        master: replyTo ? replyTo : null,
        reply_to: replyTo ? replyTo : null,
        reply_to_details: replyTo ? { body: replyToText } : null,
        reply_to_creator_details: null
      }

      let _messages = [...messages];

      /** Added the created post to the messages array */
      setMessages([nMessage, ..._messages]);
      reply(null);
    } else {
      alert("Error sharing post.");
    }

  }

  return(
    <div className={styles.chatBoxMessageBoxContainer}>
      {/** Show reply to info if message is replying to someone */}
      {replyTo &&
        <div className={styles.chatBoxContactReplyToInfo}>
          <p><span className={styles.chatBoxContactReplyToInfoLabel}>Replying to:</span> {replyToText && replyToText.length > 30 ? shortMessage(replyToText, 30) : replyToText}</p>
        </div>
      }
      <div className={styles.flexRow} style={{width: "100%"}}>
        <div style={{marginRight: 5, display: "flex"}}>
          <PfP did={user.did} details={user} />
        </div>
        <input
          ref={contactInput}
          className={styles.chatBoxInput}
          style={_theme.input}
          placeholder="Type your message"
          disabled={sending}
          value={message}
          onChange={(e) => setMessage(e.target.value)} />
        <div className={styles.chatBoxSubmitContainer}>
          {sending ?
            <button className={styles.chatBoxSubmit} style={_theme && _theme.mainCta ? _theme.mainCta : null}>
              <img src= "https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/icons/question-spinner-white.png?t=2022-08-16T15%3A44%3A56.022Z" className={styles.loadingSpinner} />
            </button>
          :
            <button className={styles.chatBoxSubmit} style={_theme && _theme.mainCta ? _theme.mainCta : null} onClick={() => sendMessage()}>
              <img src="https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/icons/question-send.png?t=2022-08-16T15%3A45%3A33.759Z" />
            </button>
          }
        </div>
      </div>
    </div>
  )
}

/** Connect button */
export function ConnectButton({orbis, user, setUser}) {
  const [loading, setLoading] = useState(false);

  /** Connect to Ceramic using the Orbis SDK */
  async function connect() {
    setLoading(true);
    let res = await orbis.connect(null, false);

    /** Parse result and update status */
    switch (res.status) {
      case 200:
        /** Save user details returned by the connect function in state */
        setUser(res.details);
        setLoading(false);
        break;
      default:
        console.log("Couldn't connect to Ceramic: ", res.error);
    }
  }

  if(loading) {
    return(
      <div className={styles.btnBlack} style={_theme.connectBtn}>
        <img src= "https://ylgfjdlgyjmdikqavpcj.supabase.co/storage/v1/object/public/orbis-sdk-modules/icons/question-spinner-white.png?t=2022-08-16T15%3A44%3A56.022Z" height="18" className={styles.loadingSpinner} />
      </div>
    )
  }

  return(
    <div>
      {user ?
        <div className={styles.btnBlack} style={_theme && _theme.connectBtn ? _theme.connectBtn : null}>Connected</div>
      :
        <div className={styles.btnBlack} style={_theme && _theme.connectBtn ? _theme.connectBtn : null} onClick={() => connect()}>Connect</div>
      }
    </div>
  )
}

/** Display profile picture of a user */
export function PfP({did, details}) {
  const { address } = useDidToAddress(did);

  const PfpImg = () => {
    if(details && details.profile && details.profile.pfp) {
      return <img src={details.profile?.pfp} className={styles.pfp} />
    } else if(address) {
      return <img src={makeBlockie(address)} className={styles.pfp} />
    } else {
      return <img src="https://arweave.net/zNxzwq2U7nNZnEosK49drVmOom4nFv89nOlSlbsnczg" className={styles.pfp} />;
    }
  }

  return(
    <div className={styles.pfpContainer}>
      <PfpImg />
    </div>
  )
}

function shortMessage(text, length) {
  if(!text) {
    return "-";
  }

  /** Retrieve first and last characters of a stream to display a shortened version of it */
  const _firstChars = text.substring(0, length);
  return _firstChars + "...";
}

/** Turns a did:pkh into a clean address and chain object */
export default function useDidToAddress(did) {
  let res = getAddressFromDid(did);
  return res;
}


/** Hooks to check if a component is being hovered or not */
export function useHover() {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );

  return [ref, value];
}
