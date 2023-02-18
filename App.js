import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from './colors';
import Todo from './components/Todo';

const TODO_KEY = '@todos';
const WORKING_KEY = '@WORKING';

export default function App() {
  const [working, setWorking] = useState(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState({});
  const changeCategory = async (working) => {
    setWorking(working);
    await AsyncStorage.setItem(WORKING_KEY, JSON.stringify(working));
  };

  const onChangeText = (e) => setText(e);

  const saveTodos = (toSave) => {
    return AsyncStorage.setItem(TODO_KEY, JSON.stringify(toSave));
  };

  const addTodo = async () => {
    if (!text) {
      return;
    }
    const newTodos = { ...todos, [Date.now()]: { text, working, done: false } };
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText('');
  };

  const loadTodos = async () => {
    const prevTodos = await AsyncStorage.getItem(TODO_KEY);
    setTodos(JSON.parse(prevTodos));
  };

  const deleteTodo = (key) => {
    console.log(key);
    Alert.alert('Delete Todo?', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[key];
          setTodos(newTodos);
          await saveTodos(newTodos);
        },
      },
    ]);
  };

  const editText = (key, text) => {
    console.log(text);
    const todo = todos[key];
    const newTodo = { ...todo, text };
    const newTodos = { ...todos, [key]: newTodo };
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const changeDone = (key) => {
    console.log(key);
    const todo = todos[key];
    const newTodo = { ...todo, done: !todo.done };
    const newTodos = { ...todos, [key]: newTodo };
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const loadWorking = async () => {
    const prevWorking = await AsyncStorage.getItem(WORKING_KEY);
    setWorking(JSON.parse(prevWorking));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    loadWorking();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeCategory(true)}>
          <Text
            style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeCategory(false)}
          style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}
        >
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : 'white' }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          returnKeyType='done'
          placeholder={working ? 'Add a Todo' : 'Where do you want to go'}
          style={styles.input}
          value={text}
        />
      </View>
      <ScrollView>
        {todos &&
          Object.keys(todos).map((key) =>
            todos[key].working === working ? (
              <Todo
                key={key}
                id={key}
                todo={todos[key]}
                deleteTodo={deleteTodo}
                editText={editText}
                changeDone={changeDone}
              />
            ) : null
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 18,
  },

  todoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  btns: {
    flexDirection: 'row',
    flex: 0.4,
    justifyContent: 'space-between',
  },
});
