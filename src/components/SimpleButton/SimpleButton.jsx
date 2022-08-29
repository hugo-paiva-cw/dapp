import React from 'react';
import * as S from "./style"

function SimpleButton(props) {
  return (

    <S.simpleButton type="button" value={props.value} onClick={props.onClick}>

    </S.simpleButton>

  );
}

export default SimpleButton;