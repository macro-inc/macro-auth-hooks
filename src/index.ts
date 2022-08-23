import _gql from 'graphql-tag';
import {createClient as _createClient} from './fetchClient';
import type {Gql} from '../generated/main';
import type {TypedDocumentNode} from '@graphql-typed-document-node/core';

const gql = _gql as Gql;

const emailCodeQ = gql(`
  mutation sendCode($email: String!) {
    login(input: { email: $email })
}
`);

const verifyCodeQ = gql(`
mutation verify($email: String! $code: String!) {
  verify(input: { email: $email code: $code }) {
    permissions
    sessionId
  }
}
`);

const permissionsQ = gql(`
  query permissions { permissions }
`);

const logoutQ = gql(`mutation logout { logout }`);

export function createClient(endpoint: string) {
  const client = _createClient(endpoint);

  function wrapQuery<TData, TVars>(q: TypedDocumentNode<TData, TVars>) {
    return (args: TVars) => client(q, args);
  }

  return {
    emailCode: wrapQuery(emailCodeQ),
    verifyCodeQ: wrapQuery(verifyCodeQ),
    permissions: wrapQuery(permissionsQ),
    logoutQ: wrapQuery(logoutQ),
  };
}
