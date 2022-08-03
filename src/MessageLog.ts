import { Terminal } from "wglt";
import { TinyColor } from "tinycolor-ts";

class Message {
  constructor(public text: string, public fg: string, public count = 1) {}

  get fullText() {
    if (this.count > 1) return `${this.text} (x${this.count})`;
    return this.text;
  }
}

export default class MessageLog {
  dirty: boolean;
  constructor(private messages: Message[] = []) {
    this.dirty = false;
  }

  add(text: string, fg = "white", stack = true) {
    const top = this.messages.at(-1);

    if (stack && top?.text === text) top.count++;
    else this.messages.push(new Message(text, fg));

    this.dirty = true;
  }

  render(term: Terminal, x: number, y: number, width: number, height: number) {
    let offset = height - 1;

    term.fillRect(x, y, width, height, " ");

    for (const msg of this.messages.slice(-height).reverse()) {
      // TODO wordwrap
      const text = msg.fullText;
      const fg = new TinyColor(msg.fg).toNumber() << 8;

      term.drawString(x, y + offset--, text, fg);
    }

    this.dirty = false;
  }
}
