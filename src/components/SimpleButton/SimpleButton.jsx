import React from 'react';
import * as S from "./style"

function SimpleButton(props) {
  return (

    <S.simpleButton onClick={props.onClick}>
       {props.children}
    </S.simpleButton>

  );
}

export default SimpleButton;