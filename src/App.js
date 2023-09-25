// 로컬에 CRUD
import React, { useState, useEffect, useCallback } from 'react';
import { Text, Pressable, StatusBar, Dimensions, View, StyleSheet, Alert } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Input from './components/Input';
import Task from './components/Task';
// import AllCheckedDeleteButton from './components/DefineDelete';

//로컬에 데이터 관리
import AsyncStorage from '@react-native-async-storage/async-storage';

//앱실행시 로딩화면 제어 : 앱실행전 사전작업이 준비될때까지 로딩화면을 유지시키는 역할
import * as SplashScreen from 'expo-splash-screen';

//사전작업이 준비될때까지 로딩화면 유지
SplashScreen.preventAutoHideAsync();

// 스타일
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
  delButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Container = styled.SafeAreaView.attrs(null)`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.main};
  align-self: flex-start;
  margin: 0 20px;
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;


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


const App = () => {
  //checkedTaskIds 선언
  const [checkedTaskIds, setCheckedTaskIds] = useState([]);

  // const tmp = {
  //   1: { id: '1', text: 'a', completed: false },
  //   2: { id: '2', text: 'b', completed: true },
  //   3: { id: '3', text: 'c', completed: false },
  // };

  //앱 준비상태 여부를 판단하는 상태변수
  const [appIsReady, setAppIsReady] = useState(false);

  // 새로운 작업을 저장하는 상태변수
  const [newTask, setNewTask] = useState('');

  // 작업목록을 저장하는 상태변수
  const [tasks, setTasks] = useState({});

  //로컬파일에 저장
  const saveTasks = async tasks => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // js obj => json포맷의 문자열로 저장
      setTasks(tasks);
    } catch (error) {
      console.log(error.message);
    }
  };

  //로컬파일에서 읽어오기
  const loadTask = async () => {
    try {
      const loadedTasks = await AsyncStorage.getItem('tasks');
      setTasks(JSON.parse(loadedTasks || '{}')); // json포맷의 문자자열 => js obj
    } catch (error) {
      console.log(error.message);
    }
  };

  // 앱 실행전 1회 호출
  useEffect(() => {
    async function prepare() {
      try {
        // 앱 실행전 자원 준비 : 로컬파일의 항목리스트를 읽어와서 task상태 변수에 저장
        await loadTask();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // 앱이 마운트될때 또는 컨테이너 레이아웃이 재계산될때마다 수행
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // 앱실행 준비가 되었을때 로딩 화면을 숨김.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // 앱이 준비상태가 되었을때만 이하로직 수행
  if (!appIsReady) return null;

  // 입력 항목이 수정될때마다 newTask변수에 수정된 내용을 저장
  const h_onChangeText = text => setNewTask(text);

  // 할일 항목 추가
  const h_onSubmitEditing = () => {
    // alert(newTask);
    const key = Date.now().toString(); //중복되지 않는 유일한 임의값
    const newTaskObject = {
      [key]: { id: key, text: newTask, completed: false },
    };
    setNewTask(''); //입력항목 클리어
    //setTasks({ ...tasks, ...newTaskObject }); //기존 tasks에 새로 입력된 항목 추가
    saveTasks({ ...tasks, ...newTaskObject });
  };

  const { width } = Dimensions.get('window');

  // 할일 항목 삭제
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
          const currentTasks = { ...tasks };
          delete currentTasks[id];
          // setTasks(currentTasks);
          saveTasks(currentTasks);
        }
      }
    ]);

  };

  // 할일 항목 완료/미완료
  const h_toggleTask = id => {
    const currentTasks = { ...tasks };
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    // currentTasks[id].completed = !currentTasks[id].completed;
    if (currentTasks[id]['completed']) {
      checkedTaskIds.push(id);
    } else {
      // 체크 해제된 경우 배열에서 제거
      const index = checkedTaskIds.indexOf(id);
      if (index !== -1) {
        checkedTaskIds.splice(index, 1);
      }
    }
    //setTasks(currentTasks);
    saveTasks(currentTasks);
  };

  // 할일 항목 수정
  const h_updateTask = task => {
    const currentTasks = { ...tasks };
    currentTasks[task.id] = task;
    // setTasks(currentTasks);
    saveTasks(currentTasks);
  };

  // 할일 항목 등록취소
  const h_onBlur = () => {
    setNewTask('');
  };

  /////////////////AllCheckedDeleteButton/////////////////
  const AllCheckedDeleteButton = ({ checkedTaskIds, tasks }) => {
    const handlePressOut = () => {

      Alert.alert('완료항목 전체삭제', '삭제하시겠습니까?', [
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


  return (
    <ThemeProvider theme={theme}>
      <Container onLayout={onLayoutRootView}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <Title>TODO List</Title>
        <Input
          placeholder="+ Add a Task "
          value={newTask}
          onChangeText={h_onChangeText}
          onSubmitEditing={h_onSubmitEditing} //추가
          onBlur={h_onBlur} // 항목추가 입력필드가 포커스 벗어나면 호출
        />
        <List width={width}>
          {Object.values(tasks)
            .reverse()
            .map(task => (
              <Task
                key={task.id}
                // text={task.text}
                // id={task.id}
                task={task}
                deleteTask={h_deleteTask} //삭제
                toggleTask={h_toggleTask} //완료/미완료
                updateTask={h_updateTask} //수정
              />
            ))}
        </List>
        <View>
          {/* 체크된거 일괄삭제 버튼 */}
          <AllCheckedDeleteButton
            checkedTaskIds={checkedTaskIds}
            tasks={tasks}
          />
        </View>
      </Container>
    </ThemeProvider>
  )






};

export default App;
