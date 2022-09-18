import React from 'react';
import * as S from "./style"

function MainButton(props) {
  return (

    <S.mainButton onClick={props.onClick}>
      {props.children}
    </S.mainButton>

  );
}

export default MainButton;