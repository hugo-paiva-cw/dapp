import React from "react";
import * as S from "./style";

function buttonPlaceholder(props) {

    return(
        <S.div>
            {props.children}
        </S.div>
    );

}

export default buttonPlaceholder