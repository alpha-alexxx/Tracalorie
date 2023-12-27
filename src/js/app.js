import { Modal, Collapse } from 'bootstrap'
import CalorieTracker from './CalorieTracker'
import Item from './NewItem'
class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._tracker.loadItems()
    this.#loadEventlistener()
  }
  #loadEventlistener() {
    document.querySelector('#meal-form')
      .addEventListener('submit', this.#newItem.bind(this, 'meal'))
    document.querySelector('#workout-form')
      .addEventListener('submit', this.#newItem.bind(this, 'workout'))
    window.addEventListener('keydown', function (event) {
      const mealCollapsableForm = document.querySelector(`#collapse-meal`)
      const workoutCollapsableForm = document.querySelector(`#collapse-workout`)
      if (event.ctrlKey) {
        event.key === 'm' ? new Collapse(mealCollapsableForm, { toggle: true }) : event.key === 'q' && new Collapse(workoutCollapsableForm, { toggle: true })
      }
    });

    document.querySelector('#meal-items')
      .addEventListener('click', this.#removeItem.bind(this, 'meal'))
    document.querySelector('#workout-items')
      .addEventListener('click', this.#removeItem.bind(this, 'workout'))

    document.querySelector('#filter-meals')
      .addEventListener('keyup', this.#filterItems.bind(this, 'meal'))
    document.querySelector('#filter-workouts')
      .addEventListener('keyup', this.#filterItems.bind(this, 'workout'))
    document.querySelector('#reset')
      .addEventListener('click', this.#reset.bind(this))
    document.querySelector('#limit-form')
      .addEventListener('submit', this.#setLimit.bind(this))
  }
  #newItem(type, e) {
    e.preventDefault()
    const name = document.querySelector(`#${type}-name`)
    const calories = document.querySelector(`#${type}-calories`)
    if (name.value.trim() === '' || calories.value.trim() === '') {
      name.value.trim() === '' ? alert('Please add name!!!') : alert('Please add calories!!!')
      return
    }

    if (type === 'meal') {
      const meal = new Item(name.value, +calories.value)
      this._tracker.addMeal(meal)
    } else {
      const workout = new Item(name.value, +calories.value)
      this._tracker.addWorkout(workout)
    }
    name.value = ''
    calories.value = ''

    const collapsableForm = document.querySelector(`#collapse-${type}`)
    new Collapse(collapsableForm, { toggle: true });
  }
  #removeItem(type, e) {
    if (e.target.classList.contains('delete') || e.target.classList.contains('fa-trash')) {
      if (confirm('Are you sure to delete this item?')) {
        const id = e.target.closest('.card').getAttribute('data-id')

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id)

        e.target.closest('.card').remove()
      }
    }
  }
  #filterItems(type, e) {
    const filterTxt = e.target.value.toLowerCase()
    document.querySelectorAll(`#${type}-items .card`).forEach(item => {
      const itemName = item.firstElementChild.firstElementChild.firstElementChild.textContent

      if (itemName.toLowerCase().indexOf(filterTxt) !== -1) {
        item.style.display = 'block'
      } else {
        item.style.display = 'none'
      }
    })
  }
  #reset() {
    this._tracker.reset()
    document.querySelector('#meal-items').innerHTML = ''
    document.querySelector('#workout-items').innerHTML = ''
    document.querySelector('#filter-meals').value = ''
    document.querySelector('#filter-workouts').value = ''

  }
  #setLimit(e) {
    e.preventDefault()
    const limit = document.querySelector('#limit')
    if (limit.value.trim() === '') {
      alert('please add a limit')
      return
    }
    this._tracker.setLimit(+limit.value)
    limit.value = ''
    const modalEl = document.querySelector('#limit-modal')
    var modal = Modal.getInstance(modalEl)
    modal.hide()
  }
}
const app = new App()
