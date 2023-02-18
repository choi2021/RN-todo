import React, { useState } from 'react';
import { EvilIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Todo = ({ todo, id, deleteTodo, editText, changeDone }) => {
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState(todo.text);
  const changeEditMode = () => {
    setEditMode((prev) => !prev);
  };
  const onChangeText = (value) => {
    setText(value);
  };

  const onSubmit = (key) => {
    editText(key, text);
    setEditMode(false);
  };

  return (
    <View style={styles.todo}>
      {editMode ? (
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={onChangeText}
        />
      ) : (
        <Text
          style={{
            ...styles.todoText,
            textDecorationLine: todo.done ? 'line-through' : 'none',
          }}
        >
          {todo.text}
        </Text>
      )}

      <View style={styles.btns}>
        <TouchableOpacity style={styles.btn} onPress={() => deleteTodo(id)}>
          <EvilIcons name='trash' size={26} />
        </TouchableOpacity>
        <Checkbox
          onValueChange={() => changeDone(id)}
          value={todo.done}
          style={styles.btn}
        />
        <TouchableOpacity style={styles.btn} onPress={changeEditMode}>
          <Entypo name='pencil' size={26} />
        </TouchableOpacity>
        {editMode && (
          <TouchableOpacity style={styles.btn} onPress={() => onSubmit(id)}>
            <FontAwesome name='envelope-o' size={22} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  todo: {
    backgroundColor: 'white',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1.5,
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  todoText: {
    flex: 1.5,
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  btns: {
    marginLeft: 10,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  btn: {
    fontSize: 15,
    marginRight: 8,
  },
});
