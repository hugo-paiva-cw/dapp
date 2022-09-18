import React from "react";
import * as S from "./style";
import logo from "../../images/logo.png"
import { Context } from "../../context/Context.jsx";
import { useContext } from "react";

function Body(props) {
  let { navigate } = useContext(Context);
  return (
    <S.body>
      {props.children}
    </S.body>
  );
}

export default Body;
