import { createResource, createSignal } from "solid-js";
import { render } from "solid-js/web";
import { createClient } from "./index";

const [email, setEmail] = createSignal("");
const client = createClient("http://localhost:8080/graphql");

function VerifyInput() {
  const [code, setCode] = createSignal("");
  const buttonEnabled = () => code() && email();
  const [params, setParams] = createSignal<null| {email: string; code: string}>(null)

  const [data] = createResource(params, client.verifyCode);

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const param = { email: email(), code: code() }
    console.log(param)
    setParams(param);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="email"
        value={email()}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <input
        type="text"
        placeholder="code"
        value={code()}
        onChange={(e) => setCode(e.currentTarget.value)}
      />
      <button disabled={!buttonEnabled} type="submit">
        Submit
      </button>
      <div>result: {JSON.stringify(data())}</div>
      <div>loading: {JSON.stringify(data.loading)}</div>
      <div>error: {JSON.stringify(data.error)}</div>
    </form>
  );
}

function App() {
  return <div>
    Hello World
    <VerifyInput />
  </div>;
}

render(() => <App />, document.getElementById("app") as HTMLElement);
