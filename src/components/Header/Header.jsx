import React from "react";
import * as S from "./style";
import logo from "../../images/logo.png"
import { Context } from "../../context/Context.jsx";
import { useContext } from "react";

function Header(props) {
  let { navigate } = useContext(Context);
  return (
    <S.header>
      <S.h1>
        Investimento
      </S.h1>
      {/* <S.logo src={logo} onClick={props.onClick}/> */}
      {props.children}

    </S.header>
  );
}

export default Header;
