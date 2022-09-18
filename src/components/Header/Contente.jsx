import React from "react";
import * as S from "./style";
import logo from "../../images/logo.png"
import { Context } from "../../context/Context.jsx";
import { useContext } from "react";

function Contente(props) {
  let { navigate } = useContext(Context);
  return (
    <S.contente>
        
      {/* <S.logo src={logo} onClick={props.onClick}/> */}
      {props.children}

    </S.contente>
  );
}

export default Contente;
