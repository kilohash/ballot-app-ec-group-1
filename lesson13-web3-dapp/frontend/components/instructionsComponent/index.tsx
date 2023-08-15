import styles from "./instructionsComponent.module.css";

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

function PageBody() {
  const a = Math.random();
  return ( 
  <div>
    <p>Something Static</p>
    <p>Something Dynamic: {a}</p>
  </div>
  );
}
