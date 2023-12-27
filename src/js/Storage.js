
class Storage {

  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (JSON.parse(localStorage.getItem('calorieLimit')) === null) {
      calorieLimit = defaultLimit;

    } else {
      calorieLimit = +JSON.parse(localStorage.getItem('calorieLimit'))
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', JSON.stringify(calorieLimit))
  }

  static getTotalCalories(value) {
    let totalCalories;
    if (JSON.parse(localStorage.getItem('totalCalories')) === null) {
      totalCalories = value;

    } else {
      totalCalories = +JSON.parse(localStorage.getItem('totalCalories'))
    }
    return totalCalories;
  }
  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', JSON.stringify(calories))
  }
  static getMeals() {
    let meals;
    if (JSON.parse(localStorage.getItem('meals')) === null) {
      meals = []

    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }
  static saveMeal(meal) {
    const meals = Storage.getMeals()
    meals.push(meal)
    localStorage.setItem('meals', JSON.stringify(meals))
  }
  static getWorkouts() {
    let workouts;
    if (JSON.parse(localStorage.getItem('workouts')) === null) {
      workouts = []

    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }
  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts()
    workouts.push(workout)
    localStorage.setItem('workouts', JSON.stringify(workouts))
  }

  static removeMeal(mealId) {
    const meals = Storage.getMeals()
    const mealIndex = meals.findIndex((meal) => meal.id === +mealId);
    if (mealIndex !== -1) {
      meals.splice(mealIndex, 1)
    }

    localStorage.setItem('meals', JSON.stringify(meals))
  }

  static removeWorkout(workoutId) {
    const workouts = Storage.getWorkouts()
    const workIndex = workouts.findIndex((workout) => workout.id === +workoutId);
    if (workIndex !== -1) {
      workouts.splice(workIndex, 1)
    }
    localStorage.setItem('workouts', JSON.stringify(workouts))
  }
  static clearAll() {
    localStorage.removeItem('totalCalories')
    localStorage.removeItem('meals')
    localStorage.removeItem('workouts')
  }
}
export default Storage