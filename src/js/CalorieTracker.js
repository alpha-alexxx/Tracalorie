import Storage from './Storage'
class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals()
    this._workouts = Storage.getWorkouts()
    this.#render()
    document.querySelector('#limit').value = this._calorieLimit
  }
  //<----------------Public methods------------------------>
  setLimit(value) {
    this._calorieLimit = value
    Storage.setCalorieLimit(value)
    this.#render()
  }
  addMeal(meal) {
    this._meals.push(meal)
    Storage.saveMeal(meal)
    this._totalCalories += meal.calories
    Storage.updateTotalCalories(this._totalCalories)
    this.#render()
    this.#displayItems(meal, 'meal')
  }

  addWorkout(workout) {
    this._workouts.push(workout)
    Storage.saveWorkout(workout)
    this._totalCalories -= workout.calories
    Storage.updateTotalCalories(this._totalCalories)
    this.#render()
    this.#displayItems(workout, 'workout')

  }
  removeMeal(id) {
    const mealIndex = this._meals.findIndex((meal) => meal.id === +id);
    if (mealIndex !== -1) {
      const meal = this._meals[mealIndex]
      this._meals.splice(mealIndex, 1)
      this._totalCalories -= meal.calories
      Storage.updateTotalCalories(this._totalCalories)
      Storage.removeMeal(id)
      this.#render()
    }
  }

  removeWorkout(id) {
    const workoutIndex = this._workouts.findIndex(workout => workout.id === +id)
    if (workoutIndex !== -1) {
      const workout = this._workouts[workoutIndex]
      this._workouts.splice(workoutIndex, 1)
      this._totalCalories += workout.calories
      Storage.updateTotalCalories(this._totalCalories)
      Storage.removeWorkout(id)
      this.#render()
    }
  }
  reset() {
    this._totalCalories = 0
    this._meals = []
    this._workouts = []
    Storage.clearAll()
    this.#render()
  }
  loadItems() {
    this._meals.forEach(meal => this.#displayItems(meal, 'meal'))
    this._workouts.forEach(workout => this.#displayItems(workout, 'workout'))
  }
  //<----------------Private methods------------------------>
  #displayCaloriesLimit() {
    const calorieLimitElement = document.querySelector('#calories-limit');
    calorieLimitElement.innerHTML = this._calorieLimit;
  }

  #displayCaloriesTotal() {
    const totalCaloriesElement = document.querySelector('#calories-gained-or-loose');
    const parentDiv = totalCaloriesElement.parentElement.parentElement
    const nextSiblingEl = totalCaloriesElement.nextElementSibling
    if (this._totalCalories >= 0) {
      nextSiblingEl.innerHTML = 'Gained'
      parentDiv.style.backgroundColor = 'var(--bs-primary)';
    } else {
      nextSiblingEl.innerHTML = 'Extra Calories Lost'
      parentDiv.style.backgroundColor = 'var(--bs-danger)';
    }
    totalCaloriesElement.innerHTML = this._totalCalories;
  }

  #displayCaloriesConsumed() {
    const consumedCaloriesElement = document.querySelector('#calories-consumed');
    const consumedCalories = this._meals.reduce((total, meal) => total + meal.calories, 0);
    consumedCaloriesElement.innerHTML = consumedCalories;
  }

  #displayCaloriesBurned() {
    const burnedCaloriesElement = document.querySelector('#calories-burned');
    const burnedCalories = this._workouts.reduce((total, workout) => total + workout.calories, 0);
    burnedCaloriesElement.innerHTML = burnedCalories;
  }

  #displayCaloriesRemaining() {
    const remainingCaloriesElement = document.querySelector('#calories-remaining');
    const remaining = this._calorieLimit - this._totalCalories;
    const nextSiblingEl = remainingCaloriesElement.nextElementSibling;
    const remainingCaloriesParentDiv = remainingCaloriesElement.parentElement.parentElement;
    if (remaining > this._calorieLimit) {
      nextSiblingEl.innerHTML = 'Calories Capacity increased';
      remainingCaloriesElement.innerHTML = `${Math.abs(remaining)}`;
      remainingCaloriesParentDiv.style.backgroundColor = 'var(--bs-purple)';
      remainingCaloriesParentDiv.style.color = 'white';
    } else if (remaining < 0) {
      nextSiblingEl.innerHTML = 'Daily Calorie limit surpassed!!!';
      remainingCaloriesElement.innerHTML = `+${Math.abs(remaining)}`;
      remainingCaloriesParentDiv.style.color = 'white';
      remainingCaloriesParentDiv.style.backgroundColor = 'var(--bs-danger)';
    } else if (remaining === 0) {
      nextSiblingEl.innerHTML = 'Target Completed!';
      remainingCaloriesParentDiv.style.color = 'white';
      remainingCaloriesParentDiv.style.backgroundColor = 'var(--bs-info)';
    } else if (remaining > 0 && remaining <= this._calorieLimit) {
      remainingCaloriesElement.innerHTML = `${Math.abs(remaining)}`;
      nextSiblingEl.innerHTML = 'Calories remaining';
      remainingCaloriesParentDiv.style.color = 'white';
      remainingCaloriesParentDiv.style.backgroundColor = 'var(--bs-primary)';
    }

  }

  #displayProgressBar() {
    const progressElement = document.querySelector('#calorie-progress');
    const progressValue = Math.min((this._totalCalories / this._calorieLimit) * 100, 100);
    const limit = ((this._totalCalories / this._calorieLimit) * 100).toFixed(2);

    if (limit > 0 && limit < 80) {
      progressElement.style.backgroundColor = 'var(--bs-primary)';
      progressElement.style.color = 'white';
    } else if (limit >= 80 && limit < 100) {
      progressElement.style.backgroundColor = 'var(--bs-secondary)';
      progressElement.style.color = 'white';
    } else if (limit > 100) {
      progressElement.style.backgroundColor = 'var(--bs-danger)';
      progressElement.style.color = 'white';
    } else {
      progressElement.style.backgroundColor = 'var(--bs-info)';
      progressElement.style.color = 'white';
    }

    progressElement.innerHTML = `${limit}%`;
    progressElement.style.width = `${progressValue}%`;
  }


  #displayItems(item, type) {
    const itemBox = document.querySelector(`#${type}-items`)
    const card = document.createElement('div')
    card.classList.add('card', 'my-2')
    card.setAttribute('data-id', item.id)
    card.innerHTML = `
            <div class="card-body">
								<div
									class="d-flex align-items-center justify-content-between"
								>
									<h4 class="mx-1">${item.name}</h4>
									<div
										class="fs-1 ${type === 'meal' ? 'bg-primary' : 'bg-secondary'}  text-white text-center rounded-2 px-2 px-sm-5"
									>
										${item.calories}
									</div>
									<button
										class="delete btn btn-danger btn-sm mx-2"
									>
										<i class="fa-solid fa-trash"></i>
									</button>
								</div>
						</div>
    `
    itemBox.appendChild(card)
  }

  #render() {
    this.#displayCaloriesLimit()
    this.#displayCaloriesTotal()
    this.#displayCaloriesConsumed()
    this.#displayCaloriesBurned()
    this.#displayCaloriesRemaining()
    this.#displayProgressBar()

  }
}
export default CalorieTracker