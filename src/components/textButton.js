import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledPressable = styled.Pressable`
    background-color: yellow;
`;
const StyledText = styled.Text`
    font-size: 18px;
    font-weight: bold;
`;

const TextButton = ({ btnName }) => {
    return (
        <StyledPressable>
            <StyledText>{btnName}
            </StyledText>
        </StyledPressable>
    )
}


TextButton.PropTypes = {
    btnName: PropTypes.string.isRequired,
};

export default TextButton;