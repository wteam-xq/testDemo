export default {
  namespace: 'todo',
  state: [],
  reducers: {
    'delete'(state, { payload }) {
      let { id } = payload;
      return state.list.filter(item => item.id !== id);
    },
    'add'(state, { payload }) {
      let { list, inputValue } = state;
      let newList = list.slice(0);
      newList.push(inputValue);
      state.list = newList;
      return state;
    },
    'change'(state, { payload }) {
      let { newVal } = payload;
      state.inputValue = newVal;
      return state;
    },
  },
};