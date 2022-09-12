import React from 'react';
import * as S from "./style"

function Input(props) {
  return (
    <S.div>
      <S.label>{props.label}</S.label>
      <S.input value={props.value} onInput={props.onInput}/>
      <S.span>{props.error}</S.span>
    </S.div>
  );
}

export default Input;