import React from "react";
import * as S from "./style";
import { Context } from "../../context/Context.jsx";
import infinitepay from "../../images/infinitepay.png"
import { useContext } from "react";

function Top(props) {
  let { navigate } = useContext(Context);
  return (
    <S.top>
      {/* <S.h1>
        Investimento
      </S.h1> */}
      <S.logoHeader src={infinitepay} onClick={props.onClick}/>
      {props.children}

    </S.top>
  );
}

export default Top;
