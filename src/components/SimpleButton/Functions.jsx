import React from 'react';
import * as S from "./style"

function Functions(props) {
  return (

    <S.functions onClick={props.onClick}>
      {props.children}
    </S.functions>

  );
}

export default Functions;