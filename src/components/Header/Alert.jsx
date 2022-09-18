import React from "react";
import * as S from "./style";
import informative from "../../images/informative.svg"
import { Context } from "../../context/Context.jsx";
import { useContext } from "react";

function Alert(props) {
  let { navigate } = useContext(Context);
  return (
    <S.alert>
      <S.logo src={informative}/>
      <div>
        <S.warning2>Atenção!</S.warning2>
        <S.warning>Você não poderá fazer depósitos acima de BRLC 10,00.</S.warning>
      </div>
    </S.alert>
  );
}

export default Alert;
