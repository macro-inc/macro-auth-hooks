import type { TypedDocumentNode } from "@graphql-typed-document-node/core"

type GqlSuccess<TData = any> = {
  data: TData;
  errors?: Error[];
};

export function createClient(endpoint: string) {
  return async function gqlFetch<TData = any, TVariables = Record<string, any>>(
    operation: TypedDocumentNode<TData, TVariables>,
    variables: TVariables,
    headersInit?: HeadersInit
  ): Promise<GqlSuccess<TData>> {
    const headers = new Headers(headersInit ?? {});
    headers.append("Content-Type", "application/json");
    const req = new Request(endpoint, {
      method: "post",
      body: JSON.stringify({
        query: operation.loc?.source.body,
        variables,
      }),
      headers,
    });
    const res = await fetch(req);
    const json = await res.json();
    if ("data" in json && json.data) {
      return json as GqlSuccess<TData>;
    }
    throw new Error(json)
  };
}
