import React, { useCallback, useEffect } from "react";
import { Delete } from "@mui/icons-material";
import { Button, IconButton, PropTypes } from "@mui/material";
import { Task } from "./Task/Task";
import { FilterValuesType, TodolistDomainType, todolistsActions } from "features/TodolistsList/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/tasks.actions";
import { TaskType } from "features/TodolistsList/todolists.api";
import { TaskStatuses } from "common/enums";
import { useAppDispatch } from "common/hooks";
import { AddItemForm, EditableSpan } from "common/components";
import { useActions } from "common/hooks/useActions";
import { todolistsThunks } from "../todolists.actions";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Todolist = React.memo(function (props: PropsType) {
  const dispatch = useAppDispatch();
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks);
  const { changeTodolistFilter } = useActions(todolistsActions);
  const { addTask, fetchTasks } = useActions(tasksThunks);

  useEffect(() => {
    fetchTasks(props.todolist.id);
  }, []);

  const addTaskCB = useCallback(
    (title: string) => {
      addTask({ title, todolistId: props.todolist.id });
    },
    [props.todolist.id],
  );

  const removeTodolistCB = () => {
    removeTodolist(props.todolist.id);
  };

  const changeTodolistTitleCB = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: props.todolist.id, title });
    },
    [props.todolist.id],
  );

  // const changeTaskStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
  //   dispatch(tasksThunks.updateTask({ taskId, domainModel: { status }, todolistId }));
  // }, []);

  // const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
  //   dispatch(tasksThunks.updateTask({ taskId, domainModel: { title }, todolistId }));
  // }, []);

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValuesType) => changeTodolistFilter({ filter, id: props.todolist.id }),
    [props.todolist.id],
  );

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  const renderFilterButton = (
    buttonFilter: FilterValuesType,
    color: PropTypes.Color | any, //TODO: type
    text: string,
  ) => {
    return (
      <Button
        variant={props.todolist.filter === buttonFilter ? "outlined" : "text"}
        onClick={() => onFilterButtonClickHandler(buttonFilter)}
        color={color}
      >
        {text}
      </Button>
    );
  };

  return (
    <div>
      <h3 style={{ display: "flex", position: "relative" }}>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCB} />
        <IconButton
          onClick={removeTodolistCB}
          disabled={props.todolist.entityStatus === "loading"}
          style={{ position: "absolute", top: "-25px", right: "-10px" }}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCB} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.todolist.id}
            // changeTaskTitle={changeTaskTitle}
            // changeTaskStatus={changeTaskStatus}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        {renderFilterButton("all", "inherit", "All")}
        {renderFilterButton("active", "primary", "Active")}
        {renderFilterButton("completed", "secondary", "Completed")}
      </div>
    </div>
  );
});
