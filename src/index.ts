export let api: string;

async function emailCode(email: string): Promise<boolean | null> {
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

  if (res.ok) {
    return (await res.json()).data?.login;
  }

  return null;
}

async function verifyCode(
  email: string,
  code: string,
): Promise<{sessionId: string; permissions: string[]} | null> {
  const res = await fetch(`${api}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      query: `
      mutation {
        verify(input:{email:"${email}",code:"${code}"}){
          permissions
          sessionId
        }
      }`,
    }),
  });

  if (res.ok) {
    return (await res.json()).data?.verify;
  }

  return null;
}

async function permissions(): Promise<string[]> {
  const res = await fetch(`${api}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      query: `{
        permissions
      }`,
    }),
  });
  return await res.json();
}

async function logout(): Promise<boolean> {
  const res = await fetch(`${api}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
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
