import { tasksThunks } from "./tasks.actions";
import { slice } from "./todolists.reducer";

const todolistsActions = {
  ...tasksThunks,
  ...slice.actions,
};

const tasksActions = {
  ...tasksThunks,
};
