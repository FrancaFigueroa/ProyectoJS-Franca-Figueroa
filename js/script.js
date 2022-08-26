//selecciòn y creación de array
const Clickbutton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')

let carrito = []

const createAlert = (title, description) => {
    Swal.fire({
        title,
        icon: 'success',
        text: description,
        confirmButtonText: 'Cerrar'
    })
}

//añadir al carrito y crear objeto
function addToCarritoItem(e) {
    const button = e.target
    const item = button.closest('.card')
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;

    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1
    }

    addItemCarrito(newItem)
    createAlert ('Producto añadido al carrito')
}


const crearTarjeta = ({title, precio, description, img, id}) => {
    
    return `
    <div class="col d-flex justify-content-center mb-4">
        <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
            <h5 class="card-title pt-2 text-center text-primary">${title}</h5>
            <img src="${img}" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text text-white-50 description">${description}</p>
                <h5 class="text-primary">Precio: <span class="precio">$ ${precio}</span></h5>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary button" data-id="${id}">Añadir a Carrito</button>
                </div>
            </div>
        </div>
    </div>
    `
}

async function renderProducts() {
    // Hacer el fetch y obtener los datos
    const data = await fetch("./js/data.json")
    const products = await data.json()

    // Generar las tarjetas en un acumulador
    let tarjetas = "" 
    products.forEach((producto) => {
        tarjetas += crearTarjeta(producto)
    }) 
    console.log(tarjetas)
    // Guardar el html generado en el contenedor de productos
    const contenedor = document.getElementById('product-container')
    contenedor.innerHTML = tarjetas
    const buttons = contenedor.getElementsByClassName('button')

    Array.from(buttons).forEach(button => {
        button.addEventListener('click', addToCarritoItem)
    })
}

function addItemCarrito(newItem) {

//alerta removido del carrito
    const alert = document.querySelector('.alert')

    setTimeout(function () {
        alert.classList.add('hide')
    }, 2000)
    alert.classList.remove('hide')

//renderizar
    const InputElemnto = tbody.getElementsByClassName('input__elemento')

//condicion para que solo sume cantidad
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === newItem.title.trim()) {
            carrito[i].cantidad++;
            const inputValue = InputElemnto[i]
            inputValue.value++;
            CarritoTotal()
            return null;
        }
    }

//guardamos carrito
    carrito.push(newItem)

    renderCarrito()
}

//renderizamos carrito, creamos contenido
function renderCarrito() {
    tbody.innerHTML = ''
    carrito.map(item => {
        const tr = document.createElement('tr')
        tr.classList.add('ItemCarrito')

//operador destructuring
        const {img, title, precio, cantidad} = item;
        const Content = `
            <th scope="row">1</th>
            <td class="table__productos">
            <img src=${img}  alt="">
            <h6 class="title">${title}</h6>
            </td>
            <td class="table__price"><p>${precio}</p></td>
            <td class="table__cantidad">
            <input type="number" min="1" value=${cantidad} class="input__elemento">
            <button class="delete btn btn-danger">x</button>
            </td>
    `
//agregamos al tr el contenido
        tr.innerHTML = Content;
        tbody.append(tr)
        
//eliminar items del carrito
        tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
//sumar items al carrito
        tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
    })
    CarritoTotal()
}

//funcion para sumar el total 
function CarritoTotal() {
    let Total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal')
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("$", ''))
        Total = Total + precio * item.cantidad
    })

    itemCartTotal.innerHTML = `Total $${Total}`
    addLocalStorage()
}

//funcion para eliminar item y total del carrito
function removeItemCarrito(e) {
    const buttonDelete = e.target
    const tr = buttonDelete.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < carrito.length; i++) {

        if (carrito[i].title.trim() === title.trim()) {
            carrito.splice(i, 1)
        }
    }

//alerta removido del carrito
    const alert = document.querySelector('.remove')

    setTimeout(function () {
        alert.classList.add('remove')
    }, 2000)
    alert.classList.remove('remove')

    tr.remove()
    CarritoTotal()
}

//funcion para sumar cantidad y validación para no poder poner cantidad menor a 1
function sumaCantidad(e) {
    const sumaInput = e.target
    const tr = sumaInput.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;

//operador ternario
    carrito.forEach(item => {
        if (item.title.trim() === title) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            CarritoTotal()
        }
    })
}

//guardar informaciòn en localstorage
function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

//ejecutar cuando se refresque la pantalla
window.onload = async function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        renderCarrito()
    }
    const botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click",(e) =>{
        createAlert("Compra finalizada!", `Gracias por elegirnos`)
    })
    renderProducts()
}