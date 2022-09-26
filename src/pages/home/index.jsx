import Header from "../../components/Header/Header";
import Top from "../../components/Header/top";
import Body from "../../components/Header/Body";
import Alert from "../../components/Header/Alert";
import Contente from "../../components/Header/Contente";
import HeaderButton from "../../components/headerButton/headerButton";
// import { GiFoxHead } from "react-icons/gi";
import { Context } from "../../context/Context.jsx";
import { useContext } from "react";
// import styled from "styled-components";
import Button from "../../components/SimpleButton/SimpleButton";
import MainButton from "../../components/SimpleButton/mainButton";
import LegendaButton from "../../components/SimpleButton/LegendaButton"
import Functions from "../../components/SimpleButton/Functions";
import Input from "../../components/Input/Input";
import BalanceView from "../../components/BalanceView/BalanceView";
import Legenda from "../../components/BalanceView/legenda";
import Placeholder from "../../components/buttonPlaceholder/buttonPlaceholder";

function Home() {
  let {
    navigate,
    inputNumber,
    setInputNumber,
    currentBalance,
    // setCurrentBalance,
    currentAccount,
    // setCurrentAccount,
    onClickConnect,
    // MetaMaskClientCheck,
    makeADeposit,
    makeAWithdraw,
    addCToken,
    // isMetaMaskInstalled,
    getMaxWithdrawValue,
    addNetwork,
    errorMessage,
    setErrorMessage,
  } = useContext(Context);

  return (
    <>
      <Contente>
        <Top>
        {currentAccount}
        <HeaderButton title="Conecte-se" onClick={onClickConnect} />

        </Top>
        <Header onClick={() => navigate("/")}>
          
          <Legenda />
          <BalanceView>{currentBalance}</BalanceView>
          <LegendaButton>
            Operações secundarias
          </LegendaButton>
          <Functions>
            <Button onClick={addCToken}>Cadastrar Tokens</Button>
            <Button onClick={addNetwork}>Conectar Network </Button>
            <Button onClick={getMaxWithdrawValue}>Ver Saldo</Button>
          </Functions>
        </Header>
        <Body>
          <Input
            value={inputNumber}
            label="Insira o valor da transferência (em centavos)"
            onInput={(e) => {
              setInputNumber(e.target.value);
              setErrorMessage('');
            }}
            error={errorMessage}
          ></Input>
          <Alert />
          <Placeholder>
            <MainButton onClick={makeADeposit}>Depositar</MainButton>
            <MainButton onClick={makeAWithdraw}>Sacar</MainButton>
          </Placeholder>
        </Body>
      </Contente>
    </>
  );
}

export default Home;
