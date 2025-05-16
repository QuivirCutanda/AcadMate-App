import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  insertTask,
  updateTask,
  getAllTasks,
  deleteTask,
  getSubtasks,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  getAllProjects,
  getAllTags,
  subscribeToTasksUpdates,
  updateTaskTags,
  Task,
  Subtask,
  Project,
  Tag,
} from "@/src/database/todo-list/todolist-query";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Flag,
  Calendar,
  Tag as TagIcon,
  X,
  Star,
  List,
} from "react-native-feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Snackbar } from "react-native-paper";

const TodoListScreen = () => {
  const userId = 1;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [subtasks, setSubtasks] = useState<Record<number, Subtask[]>>({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "today" | "important"
  >("all");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarAction, setSnackbarAction] = useState<"success" | "error">(
    "success"
  );

  // Show snackbar
  const showSnackbar = (
    message: string,
    action: "success" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarAction(action);
    setSnackbarVisible(true);
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedTasks, loadedProjects, loadedTags] = await Promise.all([
          getAllTasks(userId),
          getAllProjects(userId),
          getAllTags(userId),
        ]);

        setTasks(loadedTasks);
        setProjects(loadedProjects);
        setTags(loadedTags);
      } catch (error) {
        showSnackbar("Failed to load tasks", "error");
      }
    };

    loadData();

    const unsubscribe = subscribeToTasksUpdates(async () => {
      try {
        const updatedTasks = await getAllTasks(userId);
        setTasks(updatedTasks);

        if (expandedTaskId) {
          const loadedSubtasks = await getSubtasks(expandedTaskId);
          setSubtasks((prev) => ({
            ...prev,
            [expandedTaskId]: loadedSubtasks,
          }));
        }
      } catch (error) {
        showSnackbar("Failed to refresh tasks", "error");
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter tasks based on active filter
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "today") {
      if (!task.due_date) return false;
      const today = new Date();
      const dueDate = new Date(task.due_date);
      return (
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear()
      );
    } else if (activeFilter === "important") {
      return task.is_important;
    }
    return true;
  });

  // Load subtasks when a task is expanded
  useEffect(() => {
    if (expandedTaskId) {
      const loadSubtasks = async () => {
        const loadedSubtasks = await getSubtasks(expandedTaskId);
        setSubtasks((prev) => ({
          ...prev,
          [expandedTaskId]: loadedSubtasks,
        }));
      };
      loadSubtasks();
    }
  }, [expandedTaskId]);

  // Show delete confirmation dialog
  const showDeleteConfirmation = (taskId: number) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteTask(taskId),
      },
    ]);
  };

  // Show subtask delete confirmation dialog
  const showSubtaskDeleteConfirmation = (subtaskId: number, taskId: number) => {
    Alert.alert(
      "Delete Subtask",
      "Are you sure you want to delete this subtask?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteSubtask(subtaskId, taskId),
        },
      ]
    );
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: number) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        await updateTask(taskId, {
          ...task,
          is_completed: !task.is_completed,
        });
        showSnackbar(
          `Task marked as ${!task.is_completed ? "completed" : "incomplete"}`
        );
      }
    } catch (error) {
      showSnackbar("Failed to update task", "error");
    }
  };

  // Toggle subtask completion
  const toggleSubtaskCompletion = async (subtaskId: number, taskId: number) => {
    const subtask = subtasks[taskId]?.find((s) => s.id === subtaskId);
    if (subtask) {
      await updateSubtask(subtaskId, {
        ...subtask,
        is_completed: !subtask.is_completed,
      });

      const updatedSubtasks = await getSubtasks(taskId);
      setSubtasks((prev) => ({
        ...prev,
        [taskId]: updatedSubtasks,
      }));
    }
  };

  // Add new task
  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        await insertTask({
          user_id: userId,
          title: newTaskTitle,
          priority: 0,
          is_completed: false,
          is_important: false,
        });
        setNewTaskTitle("");
        showSnackbar("Task added successfully");
      } catch (error) {
        showSnackbar("Failed to add task", "error");
      }
    }
  };

  // Add new subtask
  const handleAddSubtask = async () => {
    if (newSubtaskTitle.trim() && currentTask?.id) {
      try {
        await addSubtask({
          task_id: currentTask.id,
          title: newSubtaskTitle,
          is_completed: false,
        });
        setNewSubtaskTitle("");

        const updatedSubtasks = await getSubtasks(currentTask.id);
        setSubtasks((prev) => ({
          ...prev,
          [currentTask.id!]: updatedSubtasks,
        }));
        showSnackbar("Subtask added successfully");
      } catch (error) {
        showSnackbar("Failed to add subtask", "error");
      }
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setShowTaskModal(false);
      setExpandedTaskId(null);
      showSnackbar("Task deleted successfully");
    } catch (error) {
      showSnackbar("Failed to delete task", "error");
    }
  };

  // Delete subtask
  const handleDeleteSubtask = async (subtaskId: number, taskId: number) => {
    try {
      await deleteSubtask(subtaskId);
      const updatedSubtasks = await getSubtasks(taskId);
      setSubtasks((prev) => ({
        ...prev,
        [taskId]: updatedSubtasks,
      }));
      showSnackbar("Subtask deleted successfully");
    } catch (error) {
      showSnackbar("Failed to delete subtask", "error");
    }
  };

  // Toggle task importance
  const toggleTaskImportance = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      await updateTask(taskId, {
        ...task,
        is_important: !task.is_important,
      });
    }
  };

  // Handle date selection
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date && currentTask) {
      setCurrentTask({
        ...currentTask,
        due_date: date.toISOString(),
      });
      setSelectedDate(date);
    }
  };

  // Save task changes
  const handleSaveTask = async () => {
    if (currentTask) {
      try {
        await updateTask(currentTask.id!, currentTask);
        if (currentTask.tags) {
          await updateTaskTags(currentTask.id!, currentTask.tags);
        }
        setShowTaskModal(false);
        showSnackbar("Task updated successfully");
      } catch (error) {
        showSnackbar("Failed to update task", "error");
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Select project
  const selectProject = (projectId: number | null) => {
    if (currentTask) {
      setCurrentTask({
        ...currentTask,
        project_id: projectId,
      });
    }
    setShowProjectDropdown(false);
  };

  // Toggle tag selection
  const toggleTag = (tagId: number) => {
    if (currentTask) {
      const newTags = currentTask.tags || [];
      const updatedTags = newTags.includes(tagId)
        ? newTags.filter((id) => id !== tagId)
        : [...newTags, tagId];

      setCurrentTask({
        ...currentTask,
        tags: updatedTags,
      });
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-indigo-600 p-6 pb-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-white">My Tasks</Text>
          <Pressable
            onPress={() => {
              setCurrentTask({
                user_id: userId,
                title: "",
                priority: 0,
                is_completed: false,
                is_important: false,
                tags: [],
              });
              setShowTaskModal(true);
            }}
            className="bg-white p-2 rounded-full"
          >
            <Plus width={24} height={24} color="#6366f1" />
          </Pressable>
        </View>

        {/* Filter tabs */}
        <View className="flex-row justify-between mb-4">
          <Pressable
            className={`px-4 py-2 rounded-full ${
              activeFilter === "all"
                ? "bg-white"
                : "bg-transparent border border-white"
            }`}
            onPress={() => setActiveFilter("all")}
          >
            <Text
              className={`font-medium ${
                activeFilter === "all" ? "text-indigo-600" : "text-white"
              }`}
            >
              All
            </Text>
          </Pressable>
          <Pressable
            className={`px-4 py-2 rounded-full ${
              activeFilter === "today"
                ? "bg-white"
                : "bg-transparent border border-white"
            }`}
            onPress={() => setActiveFilter("today")}
          >
            <Text
              className={`font-medium ${
                activeFilter === "today" ? "text-indigo-600" : "text-white"
              }`}
            >
              Today
            </Text>
          </Pressable>
          <Pressable
            className={`px-4 py-2 rounded-full ${
              activeFilter === "important"
                ? "bg-white"
                : "bg-transparent border border-white"
            }`}
            onPress={() => setActiveFilter("important")}
          >
            <Text
              className={`font-medium ${
                activeFilter === "important" ? "text-indigo-600" : "text-white"
              }`}
            >
              Important
            </Text>
          </Pressable>
        </View>

     
      </View>

      {/* Task list */}
      <ScrollView
        className="flex-1 px-4 mt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredTasks.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500 text-lg">No tasks found</Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <View
              key={task.id}
              className={`bg-white rounded-xl p-4 mb-3 shadow-sm 
                ${task.is_completed ? "opacity-70" : ""}`}
            >
              {/* Main task item */}
              <View className="flex-row items-start">
                <Pressable
                  onPress={() => toggleTaskCompletion(task.id!)}
                  className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center mt-1
                    ${
                      task.is_completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                >
                  {task.is_completed && (
                    <Check width={16} height={16} color="white" />
                  )}
                </Pressable>

                <View className="flex-1">
                  <View className="flex-row justify-between">
                    <Text
                      className={`text-lg font-medium ${
                        task.is_completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </Text>
                    <Pressable onPress={() => toggleTaskImportance(task.id!)}>
                      <Star
                        width={20}
                        height={20}
                        fill={task.is_important ? "#f59e0b" : "transparent"}
                        stroke={task.is_important ? "#f59e0b" : "#d1d5db"}
                      />
                    </Pressable>
                  </View>

                  {task.due_date && (
                    <View className="flex-row items-center mt-1">
                      <Calendar width={14} height={14} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {formatDate(task.due_date)}
                      </Text>
                    </View>
                  )}

                  {task.project_id && (
                    <View className="flex-row items-center mt-1">
                      <View
                        className="w-3 h-3 rounded-full mr-1"
                        style={{
                          backgroundColor:
                            projects.find((p) => p.id === task.project_id)
                              ?.color || "#6366f1",
                        }}
                      />
                      <Text className="text-gray-500 text-sm">
                        {projects.find((p) => p.id === task.project_id)?.name}
                      </Text>
                    </View>
                  )}
                </View>

                <Pressable
                  onPress={() =>
                    expandedTaskId === task.id
                      ? setExpandedTaskId(null)
                      : setExpandedTaskId(task.id || null)
                  }
                  className="ml-2"
                >
                  {expandedTaskId === task.id ? (
                    <ChevronDown width={20} height={20} color="#6b7280" />
                  ) : (
                    <ChevronRight width={20} height={20} color="#6b7280" />
                  )}
                </Pressable>
              </View>

              {/* Subtasks section */}
              {expandedTaskId === task.id && (
                <View className="mt-4 pl-2">
                  {/* Subtask list */}
                  {(subtasks[task.id!] || []).map((subtask) => (
                    <View
                      key={subtask.id}
                      className="flex-row items-center mb-3 pl-4"
                    >
                      <Pressable
                        onPress={() =>
                          toggleSubtaskCompletion(subtask.id!, task.id!)
                        }
                        className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center 
                          ${
                            subtask.is_completed
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300"
                          }`}
                      >
                        {subtask.is_completed && (
                          <Check width={12} height={12} color="white" />
                        )}
                      </Pressable>

                      <Text
                        className={`flex-1 ${
                          subtask.is_completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {subtask.title}
                      </Text>

                      <Pressable
                        onPress={() =>
                          showSubtaskDeleteConfirmation(subtask.id!, task.id!)
                        }
                        className="ml-2 p-1"
                      >
                        <Trash2 width={16} height={16} color="#ef4444" />
                      </Pressable>
                    </View>
                  ))}

                  {/* Add subtask input */}
                  <View className="flex-row items-center mt-2 pl-4">
                    <TextInput
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm mr-2 bg-gray-50"
                      placeholder="Add a subtask..."
                      value={newSubtaskTitle}
                      onChangeText={setNewSubtaskTitle}
                      onSubmitEditing={handleAddSubtask}
                    />
                    <Pressable
                      className="bg-indigo-500 p-2 rounded-lg"
                      onPress={handleAddSubtask}
                    >
                      <Plus width={16} height={16} color="white" />
                    </Pressable>
                  </View>

                  {/* Task actions */}
                  <View className="flex-row justify-between mt-4">
                    <Pressable
                      className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full"
                      onPress={() => {
                        setCurrentTask(task);
                        setSelectedDate(
                          task.due_date ? new Date(task.due_date) : null
                        );
                        setShowTaskModal(true);
                      }}
                    >
                      <Text className="text-gray-600 text-sm font-medium">
                        Edit Task
                      </Text>
                    </Pressable>

                    <Pressable
                      className="bg-red-100 px-4 py-2 rounded-full"
                      onPress={() => showDeleteConfirmation(task.id!)}
                    >
                      <Text className="text-red-500 text-sm font-medium">
                        Delete
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Task detail modal */}
      <Modal
        visible={showTaskModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View className="flex-1 bg-gray-50">
          <View className="bg-indigo-600 p-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-white">
                Task Details
              </Text>
              <Pressable onPress={() => setShowTaskModal(false)}>
                <X width={24} height={24} color="white" />
              </Pressable>
            </View>
          </View>

          <ScrollView
            className="flex-1 p-6"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {currentTask && (
              <>
                <View className="mb-6">
                  <Text className="text-gray-500 mb-2 font-medium">Title</Text>
                  <TextInput
                    className="border-b border-gray-200 pb-2 text-xl font-medium text-gray-800"
                    value={currentTask.title}
                    onChangeText={(text) =>
                      setCurrentTask({ ...currentTask, title: text })
                    }
                    placeholder="Task title"
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-gray-500 mb-2 font-medium">
                    Description
                  </Text>
                  <TextInput
                    className="border border-gray-200 rounded-lg p-3 bg-white text-gray-800"
                    value={currentTask.description || ""}
                    onChangeText={(text) =>
                      setCurrentTask({ ...currentTask, description: text })
                    }
                    placeholder="Add a description..."
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-gray-500 mb-2 font-medium">
                    Due Date
                  </Text>
                  <Pressable
                    className="flex-row items-center border border-gray-200 rounded-lg p-3 bg-white"
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Calendar
                      width={20}
                      height={20}
                      color="#6b7280"
                      className="mr-2"
                    />
                    <Text className="text-gray-800">
                      {selectedDate
                        ? formatDate(selectedDate.toISOString())
                        : "Select a date"}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </View>

                <View className="mb-6">
                  <Text className="text-gray-500 mb-2 font-medium">
                    Priority
                  </Text>
                  <View className="flex-row space-x-2">
                    {[
                      { level: 0, label: "None", color: "bg-gray-100" },
                      { level: 1, label: "Low", color: "bg-blue-100" },
                      { level: 2, label: "Medium", color: "bg-yellow-100" },
                      { level: 3, label: "High", color: "bg-red-100" },
                    ].map(({ level, label, color }) => (
                      <Pressable
                        key={level}
                        className={`flex-1 p-3 rounded-lg items-center ${
                          currentTask.priority === level ? color : "bg-gray-100"
                        }`}
                        onPress={() =>
                          setCurrentTask({ ...currentTask, priority: level })
                        }
                      >
                        <Text
                          className={
                            currentTask.priority === level
                              ? "font-medium"
                              : "text-gray-500"
                          }
                        >
                          {label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-gray-500 mb-2 font-medium">
                    Project
                  </Text>
                  <View className="relative">
                    <Pressable
                      className="border border-gray-200 rounded-lg p-3 bg-white flex-row justify-between items-center"
                      onPress={() =>
                        setShowProjectDropdown(!showProjectDropdown)
                      }
                    >
                      <Text className="text-gray-800">
                        {currentTask.project_id
                          ? projects.find(
                              (p) => p.id === currentTask.project_id
                            )?.name
                          : "No project"}
                      </Text>
                      <ChevronDown width={20} height={20} color="#6b7280" />
                    </Pressable>

                    {showProjectDropdown && (
                      <View className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <Pressable
                          className="p-3 border-b border-gray-100"
                          onPress={() => selectProject(null)}
                        >
                          <Text className="text-gray-800">No project</Text>
                        </Pressable>
                        {projects.map((project) => (
                          <Pressable
                            key={project.id}
                            className="p-3 border-b border-gray-100 flex-row items-center"
                            onPress={() => selectProject(project.id!)}
                          >
                            <View
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: project.color }}
                            />
                            <Text className="text-gray-800">
                              {project.name}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-gray-500 mb-2 font-medium">Tags</Text>
                  <View className="relative">
                    <Pressable
                      className="border border-gray-200 rounded-lg p-3 bg-white flex-row justify-between items-center"
                      onPress={() => setShowTagsDropdown(!showTagsDropdown)}
                    >
                      <Text className="text-gray-800">
                        {currentTask.tags?.length
                          ? `${currentTask.tags.length} tags selected`
                          : "No tags"}
                      </Text>
                      <ChevronDown width={20} height={20} color="#6b7280" />
                    </Pressable>

                    {showTagsDropdown && (
                      <View className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                        <View className="flex-row flex-wrap">
                          {tags.map((tag) => (
                            <Pressable
                              key={tag.id}
                              className={`p-2 mr-2 mb-2 rounded-full ${
                                currentTask.tags?.includes(tag.id!)
                                  ? "bg-indigo-100"
                                  : "bg-gray-100"
                              }`}
                              onPress={() => toggleTag(tag.id!)}
                            >
                              <View className="flex-row items-center">
                                <View
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{ backgroundColor: tag.color }}
                                />
                                <Text className="text-gray-800 text-sm">
                                  {tag.name}
                                </Text>
                              </View>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                <View className="flex-row space-x-3">
                  <Pressable
                    className="flex-1 bg-indigo-500 p-4 rounded-lg items-center"
                    onPress={handleSaveTask}
                  >
                    <Text className="text-white font-medium">Save Changes</Text>
                  </Pressable>

                  {currentTask.id && (
                    <Pressable
                      className="bg-red-100 p-4 rounded-lg items-center"
                      onPress={() => showDeleteConfirmation(currentTask.id!)}
                    >
                      <Text className="text-red-500 font-medium">Delete</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1000}
        action={{
          label: "Dismiss",
          onPress: () => setSnackbarVisible(false),
        }}
        style={{
          backgroundColor: snackbarAction === "success" ? "#4CAF50" : "#F44336",
          marginBottom: 20,
          marginHorizontal: 10,
        }}
      >
        <Text className="text-white">{snackbarMessage}</Text>
      </Snackbar>
    </View>
  );
};

export default TodoListScreen;
