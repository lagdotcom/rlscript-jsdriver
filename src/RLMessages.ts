import { Terminal, wordWrap } from "wglt";

import Serializer from "./Serializer";
import { TinyColor } from "tinycolor-ts";

type SerializedMessage = [text: string, fg: string, count: number];

class Message {
  constructor(public text: string, public fg: string, public count = 1) {}

  get fullText() {
    if (this.count > 1) return `${this.text} (x${this.count})`;
    return this.text;
  }

  serialize(): SerializedMessage {
    const { text, fg, count } = this;
    return [text, fg, count];
  }

  static deserialize([text, fg, count]: SerializedMessage) {
    return new Message(text, fg, count);
  }
}

export default class RLMessages {
  dirty: boolean;
  type: "messages";
  constructor(private messages: Message[] = []) {
    this.dirty = false;
    this.type = "messages";
  }

  get length() {
    return this.messages.length;
  }

  clear() {
    this.dirty = true;
    this.messages.splice(0);
  }

  add(text: string, fg = "white", stack = true) {
    const top = this.messages.at(-1);

    if (stack && top?.text === text) top.count++;
    else this.messages.push(new Message(text, fg));

    this.dirty = true;
  }

  latest(size: number, offset = 0) {
    const start = this.length - offset - size;
    if (start < 0) return this.messages.slice().reverse();

    const end = start + size;

    return this.messages.slice(start, end).reverse();
  }

  render(
    term: Terminal,
    x: number,
    y: number,
    width: number,
    height: number,
    offset = 0
  ) {
    this.dirty = false;
    term.fillRect(x, y, width, height, " ");

    let yOffset = height - 1;
    for (const msg of this.latest(height, offset)) {
      const text = wordWrap(msg.fullText, width).reverse();
      const fg = new TinyColor(msg.fg).toNumber() << 8;

      for (const line of text) {
        term.drawString(x, y + yOffset--, line, fg, 0);

        if (yOffset < 0) return;
      }
    }
  }

  serialize() {
    return this.messages.map((m) => m.serialize());
  }

  deserialize(data: SerializedMessage[]) {
    this.messages = data.map((m) => Message.deserialize(m));
    this.dirty = true;

    return this;
  }
}

Serializer.instance.add(
  "messages",
  (m: RLMessages) => m.serialize(),
  (data: SerializedMessage[], m: RLMessages) => m.deserialize(data)
);
