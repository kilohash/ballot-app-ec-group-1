import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import { useBalance, useSignMessage } from "wagmi";
// import { setData } 

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            create<span>-web3-dapp</span>
          </h1>
          <h3>The ultimate solution to create web3 applications</h3>
        </div>
      </header>
      <p className="{styles.get_started}">
        <PageBody></PageBody>
        </p>
    </div>
  )
};

useEffect(() => {
  fetch("http://localhost:3001/get-address")
    .then((res) => res.json())
    .then((data) => {
      setData(data);
      setLoading(false);
    });
}, []);

function WalletBalance(params: { address: `0x${string}`}) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("My Input Value");

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div>
      <form>
        <label>
          Enter the message to be signed:
          <input
            type="text"
            value={signatureMessage}
            onChange={(e) => setSignatureMessage(e.target.value)}
            />
        </label>
      </form>
      <button
        disabled={isLoading}
        onClick={() =>
        signMessage({
          message: signatureMessage,
        })}
      ></button>
      )
    </div>
  );
}

function PageBody() {
  const a = Math.random();
  return (
  <div>
    <WalletInfo></WalletInfo>
    <RandomFile></RandomFile>
    <></>
  </div>
  );
}

function RequestTokensToBeMinted(params: { address: string}) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  if (isLoading) return <p>Requesting tokens from API...</p>;

  const requestOptions = {
    method: "POST",
    Headers: { "Content-Type": "application/json"},
    body: JSON.stringify({address: params.address}),
  };
  
  if (!data)
  return (
    <button
      disabled={isLoading}
      onClick={() => {
        setLoading(true);
        fetch("http://localhost:3001/mint-tokens", requestOptions)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false);
          });
      }}
    >
      Request Tokens
    </button>
  );
  
  return (
    <div>
      <p> Mint success: {data.success ? "worked" : "failed"} </p>
      <p> Transaction hash: {data.txHash} </p>
    </div>
    );
}
