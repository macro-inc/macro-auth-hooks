import { createResource, createSignal, Resource } from "solid-js";
import { render } from "solid-js/web";
import { createClient } from "./index";

const [email, setEmail] = createSignal("");
const client = createClient("http://localhost:8080/graphql");

function formSubmit(
  ref: HTMLFormElement,
  accessor: () => ((ref: HTMLFormElement) => any) | undefined
) {
  const cb = accessor() ?? (() => {})
  ref.setAttribute("novalidate", "");
  ref.onsubmit = async (e) => {
    e.preventDefault();
    return await Promise.resolve(cb(ref));
  };
}

function Result(props: { data: Resource<any> }) {
  return (
    <div>
      <div>result: {JSON.stringify(props.data())}</div>
      <div>loading: {JSON.stringify(props.data.loading)}</div>
      <div>error: {JSON.stringify(props.data.error)}</div>
    </div>
  );
}

function VerifyInput() {
  const [code, setCode] = createSignal("");
  const buttonEnabled = () => code() && email();
  const [params, setParams] = createSignal<null | {
    email: string;
    code: string;
  }>(null);

  const [data] = createResource(params, client.verifyCode);

  return (
    <form use:formSubmit={() => setParams({ email: email(), code: code() })}>
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
      <Result data={data} />
    </form>
  );
}

function Permissions() {
  const [data, { refetch }] = createResource(() => client.permissions({}));

  return (
    <form use:formSubmit={() => refetch()}>
      <button type="submit">Refetch</button>
      <Result data={data} />
    </form>
  );
}

function App() {
  return (
    <div>
      <VerifyInput />
      <Permissions />
    </div>
  );
}

render(() => <App />, document.getElementById("app") as HTMLElement);
