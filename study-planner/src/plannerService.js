// src/plannerService.js
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { auth, db } from "./firebase/firebase"

// Get current user ID
function getUserId() {
  return auth.currentUser?.uid
}

// Fetch tasks for a specific date
export async function getTasks(date) {
  const userId = getUserId()
  if (!userId) return []

  const snapshot = await getDocs(collection(db, "users", userId, "planner"))
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(task => task.date === date)
}

// Add a new task
export async function addTask(task) {
  const userId = getUserId()
  if (!userId) throw new Error("User not authenticated")

  return await addDoc(collection(db, "users", userId, "planner"), task)
}

// Update an existing task
export async function updateTask(id, updates) {
  const userId = getUserId()
  if (!userId) throw new Error("User not authenticated")

  const ref = doc(db, "users", userId, "planner", id)
  await updateDoc(ref, updates)
}

// Delete a task
export async function deleteTask(id) {
  const userId = getUserId()
  if (!userId) throw new Error("User not authenticated")

  const ref = doc(db, "users", userId, "planner", id)
  await deleteDoc(ref)
}

// Toggle task completion
export async function toggleTask(id, completed) {
  const userId = getUserId()
  if (!userId) throw new Error("User not authenticated")

  const ref = doc(db, "users", userId, "planner", id)
  await updateDoc(ref, { completed })
}