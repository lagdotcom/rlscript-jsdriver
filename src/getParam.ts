import RLFnParam from "./RLFnParam";

export type ParamPredicate = (p: RLFnParam) => boolean;

export default function getParam(
  params: RLFnParam[],
  predicate: ParamPredicate
): [number, RLFnParam | undefined] {
  const i = params.findIndex(predicate);
  return [i, i < 0 ? undefined : params[i]];
}
