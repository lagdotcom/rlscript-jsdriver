type TypeSerializer<T, S> = (obj: T) => S;
type TypeDeserializer<T, S> = (data: S, obj?: T) => T;

type SerializerEntry<T = unknown, S = unknown> = {
  ser: TypeSerializer<T, S>;
  des: TypeDeserializer<T, S>;
};

const boolean: SerializerEntry<boolean, string> = {
  ser: (b: boolean) => (b ? "T" : "F"),
  des: (data: string) => data === "T",
};

const object: SerializerEntry<object, object> = {
  ser: (o: object) =>
    Object.fromEntries(
      Object.entries(o).map(([key, val]) => [
        key,
        Serializer.instance.serialize(getTypeName(val), val),
      ])
    ),
  des: (data: object) =>
    Object.fromEntries(
      Object.entries(data).map(([key, val]) => [
        key,
        Serializer.instance.deserialize(val),
      ])
    ),
};

const string: SerializerEntry<string, string> = {
  ser: (s) => s,
  des: (s) => s,
};

const number: SerializerEntry<number, number> = {
  ser: (n) => n,
  des: (n) => n,
};

const set: SerializerEntry<Set<unknown>, [string, object][]> = {
  ser: (s) =>
    Array.from(s).map((o) => Serializer.instance.serialize(getTypeName(o), o)),
  des: (data) => new Set(data.map((o) => Serializer.instance.deserialize(o))),
};

export default class Serializer {
  static instance: Serializer;
  entries: Map<string, SerializerEntry<any, any>>;

  constructor() {
    this.entries = new Map<string, SerializerEntry<any, any>>([
      ["n:boolean", boolean],
      ["n:number", number],
      ["n:object", object],
      ["n:string", string],
      ["set", set],
    ]);
  }

  add<T, S>(
    type: string,
    ser: TypeSerializer<T, S>,
    des: TypeDeserializer<T, S>
  ) {
    this.entries.set(type, { ser, des });
  }

  alias(type: string, other: string) {
    this.entries.set(type, this.get(other));
  }

  get<T, S>(type: string) {
    const e = this.entries.get(type);
    if (!e) throw new Error(`No serializer for: ${type}`);

    return e as SerializerEntry<T, S>;
  }

  serialize<T, S>(type: string, obj: T): [string, S] {
    return [type, this.get<T, S>(type).ser(obj)];
  }

  deserialize<T, S>([type, data]: [string, S], obj?: T) {
    return this.get<T, S>(type).des(data, obj);
  }
}
Serializer.instance = new Serializer();

export function getTypeName(o: any) {
  const to = typeof o;
  if (to !== "object") return "n:" + to;

  if ("type" in o) return o.type;

  if (o instanceof Set) return "set";
  if (o instanceof Map) return "map";

  return "n:object";
}
