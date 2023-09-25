const h_deleteTask = id => {
  //삭제여부체크

  Alert.alert('단건삭제', '삭제하시겠습니까?', [
    {
      text: '아니오',
      // onPress: null,
      style: 'cancel', // ios 스타일 적용
    },
    {
      text: '예',
      onPress: () => {
        const updatedTasks = { ...tasks };
        checkedTaskIds.forEach(Id => {
          delete updatedTasks[Id];
        });
        saveTasks(updatedTasks);
      }
    }
  ]);

};

/////////////////AllCheckedDeleteButton/////////////////
const AllCheckedDeleteButton = ({ checkedTaskIds, tasks }) => {
  const handlePressOut = () => {

    Alert.alert('단건삭제', '삭제하시겠습니까?', [
      {
        text: '아니오',
        // onPress: null,
        style: 'cancel', // ios 스타일 적용
      },
      {
        text: '예',
        onPress: () => {
          const updatedTasks = { ...tasks };
          checkedTaskIds.forEach(Id => {
            delete updatedTasks[Id];
          });
          saveTasks(updatedTasks);
        }
      }
    ]);

  };

  return (
    <Pressable onPressOut={handlePressOut} style={styles.button}>
      <Text style={styles.buttonText}>완료항목 전체삭제</Text>
    </Pressable>
  );
};
//////////////////AllCheckedDeleteButton////////////////