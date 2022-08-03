import getParam, { ParamPredicate } from "./getParam";

import RLArg from "./RLArg";
import RLEntity from "./RLEntity";
import RLFnParam from "./RLFnParam";
import RLObject from "./RLObject";
import RLObjectType from "./RLObjectType";
import isAssignableTo from "./isAssignableTo";
import isAssignableToAny from "./isAssignableToAny";

export default function resolveArgs(
  args: RLArg[],
  params: RLFnParam[],
  variadic: RLObjectType[]
): RLObject[] {
  const results = params.map((p) => p.default);
  const filled = new Set<number>();

  const get = (predicate: ParamPredicate) => getParam(params, predicate);
  const set = (i: number, value: RLObject) => {
    if (filled.has(i)) throw new Error(`Param #${i} set twice`);

    if (i >= results.length) {
      if (variadic.length === 0)
        throw new Error(`Function only has ${results.length} params`);

      if (!isAssignableToAny(value, variadic))
        throw new Error(
          `Function variadic type is '${variadic.join("|")}', got ${value.type}`
        );
    } else if (!isAssignableTo(value, params[i].typeName))
      throw new Error(
        `Param #${i} expects type '${params[i].typeName}', got ${value.type}`
      );

    results[i] = value;
    filled.add(i);
  };

  let pos = 0;
  for (const a of args) {
    switch (a.type) {
      case "typed": {
        const [i, p] = get((p) => p.typeName === a.typeName);
        if (!p) throw new Error(`No param of type ${a.typeName}`);
        set(i, a.value);
        break;
      }

      case "named": {
        const [i, p] = get((p) => p.name === a.name);
        if (!p) throw new Error(`No param with name ${a.name}`);
        set(i, a.value);
        break;
      }

      case "positional": {
        set(pos, a.value);
        pos++;
        break;
      }
    }
  }

  const entity = args.find((p) => p.value.type === "entity")?.value as
    | RLEntity
    | undefined;
  for (let i = 0; i < results.length; i++) {
    if (typeof results[i] === "undefined") {
      if (entity && entity.has(params[i].typeName)) {
        results[i] = entity.get(params[i].typeName as RLComponentName);
        continue;
      }

      throw new Error(`Param #${i} not filled`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return results as RLObject[];
}
