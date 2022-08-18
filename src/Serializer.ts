type TypeSerializer<T, S> = (obj: T) => S;
type TypeDeserializer<T, S> = (data: S, obj: T) => T;

type SerializerEntry<T = unknown, S = unknown> = {
  ser: TypeSerializer<T, S>;
  des: TypeDeserializer<T, S>;
};

const boolean: SerializerEntry<boolean, string> = {
  ser: (b: boolean) => (b ? "T" : "F"),
  des: (data: string) => data === "T",
};

export default class Serializer {
  static instance: Serializer;
  entries: Map<string, SerializerEntry<any, any>>;

  constructor() {
    this.entries = new Map([["n:boolean", boolean]]);
  }

  add<T, S>(
    type: string,
    ser: TypeSerializer<T, S>,
    des: TypeDeserializer<T, S>
  ) {
    this.entries.set(type, { ser, des });
  }

  serialize<T>(type: string, obj: T) {
    const e = this.entries.get(type);
    if (!e) throw new Error(`No serializer for: ${type}`);

    return e.ser(obj);
  }

  deserialize<T, S>(type: string, data: S, obj: T) {
    const e = this.entries.get(type);
    if (!e) throw new Error(`No serializer for: ${type}`);

    return e.des(data, obj);
  }
}
Serializer.instance = new Serializer();

export function getTypeName(o: any) {
  const to = typeof o;
  if (to !== "object") return "n:" + to;

  if ("type" in o) return o.type;
  throw new Error(`Unknown type: ${o}`);
}
