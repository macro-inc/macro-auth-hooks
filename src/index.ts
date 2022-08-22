export let api: string = 'http://localhost:8080/graphql';

export async function emailCode(email: string): Promise<boolean> {
  const res = await fetch(`${api}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      query: `
        mutation {
          login(input:{email:"${email}"})
        }`,
    }),
  });

  return await res.json();
}

export async function verifyCode(
  email: string,
  code: string,
): Promise<{sessionId: string; permissions: string[]}> {
  const res = await fetch(`${api}`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        mutation {
          verify(input:{email:"${email}",code:"${code}"}) {
            sessionId
            permissions
          }
        }`,
    }),
  });
  return await res.json();
}

export async function permissions(): Promise<string[]> {
  const res = await fetch(`${api}`, {
    method: 'POST',
    body: JSON.stringify({
      query: `{
        permissions
      }`,
    }),
  });
  return await res.json();
}

export async function logout(): Promise<boolean> {
  const res = await fetch(`${api}`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        mutation {
          logout()
        }`,
    }),
  });

  return await res.json();
}

export function useMacroAuth(endpoint: string) {
  api = endpoint;
  return {emailCode, verifyCode, permissions, logout};
}
