const form = document.querySelector(".lvl1")
const button = document.querySelector("#zapIndex1")

button.addEventListener("click", () => {
  form.classList.remove("hidden")
})

form.addEventListener("click", (e) => {
  let val = e.target.dataset.point;
  let color = e.target.classList[0]
  let cell = get_Cell(val)
  let block = get_block(color)
  cell.appendChild(block)
  e.target.dataset.point = Number(val) + 1;
  form.classList.add("hidden")
  
})

const get_Cell = (val) => {
  let cell = document.querySelector(`#d${val}`)
  return cell
}

const get_block = (color) => {
  console.log(color)
  let div = document.createElement("div")
  div.style.backgroundColor = color
  div.style.flex = 1;
  return div
}