import React from "react";
import * as S from "./style";
import brlc from "../../images/brlc.svg"


function BalanceView(props) {
  return (
      <S.balanceView>
      <S.brlc src={brlc}/>   {props.children}
      </S.balanceView>
  );
}

export default BalanceView;
