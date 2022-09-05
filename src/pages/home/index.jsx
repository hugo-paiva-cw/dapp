import Header from "../../components/Header/Header";
import HeaderButton from "../../components/headerButton/headerButton";
import { GiFoxHead } from "react-icons/gi";
import { Context } from "../../context/Context.jsx";
import { useContext } from "react";
import Button from "../../components/SimpleButton/SimpleButton";
import Input from "../../components/Input/Input";
import BalanceView from "../../components/BalanceView/BalanceView";
import Placeholder from "../../components/buttonPlaceholder/buttonPlaceholder";

function Home() {
  let {
    navigate,
    inputNumber,
    setInputNumber,
    currentBalance,
    setCurrentBalance,
    currentAccount,
    setCurrentAccount,
    onClickConnect,
    MetaMaskClientCheck,
    makeADeposit,
    makeAWithdraw,
    addCToken,
    isMetaMaskInstalled,
    getMaxWithdrawValue,
  } = useContext(Context);
  return (
    <>
      <Header onClick={() => navigate("/")}>
        {currentAccount}
        <HeaderButton title="Conecte-se" onClick={onClickConnect}>
          <GiFoxHead size={38} />
        </HeaderButton>
      </Header>
      <BalanceView>{currentBalance}</BalanceView>
      <Input
        value={inputNumber}
        label="Insira o valor da transferência"
        onInput={(e) => setInputNumber(e.target.value)}
      ></Input>
      <Placeholder>
        <Button value="Ver Saldo" onClick={getMaxWithdrawValue} />
        <Button value="Adicionar cToken" onClick={addCToken} />
        <Button value="Depositar" onClick={makeADeposit} />
        <Button value="Sacar" onClick={makeAWithdraw} />
        <Button value="Conectar Network" onClick={addNetwork} />
      </Placeholder>
    </>
  );
}

export default Home;
