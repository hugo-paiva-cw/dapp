import React from "react";
import * as S from "./style";


function BalanceView(props) {
  return (
    <S.div>
      <S.balanceView>{props.children}</S.balanceView>
    </S.div>
  );
}

export default BalanceView;
