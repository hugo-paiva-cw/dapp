import React from 'react';
import * as S from "./style"

function LegendaButton(props) {
  return (

    <S.legendaButton onClick={props.onClick}>
      {props.children}
    </S.legendaButton>

  );
}

export default LegendaButton;