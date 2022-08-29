import React from 'react';
import * as S from "./style";


function headerButton(props) {
  return (
    <S.headerButton onClick={props.onClick}>
      <S.title>{props.title}</S.title>
      {props.children}
    </S.headerButton>
  );
}

export default headerButton;