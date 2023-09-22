import { Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { images } from '../Images';


const styles = StyleSheet.create({
    button: {
        padding: 1,
        margin: 15,
    },
    buttonText: {
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',
    },
});


const AllCheckedDeleteButton = ({ checkedTaskIds, tasks }) => {
    const handlePressOut = () => {
        const updatedTasks = { ...tasks };
        checkedTaskIds.forEach(Id => {
            delete updatedTasks[Id]; // 각 항목을 삭제합니다.
        });
        setTasks(updatedTasks); // 모든 항목을 삭제한 후 tasks 상태를 업데이트합니다.
    };

    return (
        <Pressable onPressOut={handlePressOut} style={styles.button}>
            <Text style={styles.buttonText}>완료항목 전체삭제</Text>
        </Pressable>
    );
};


export default AllCheckedDeleteButton; // 수정된 컴포넌트 이름으로 내보내기