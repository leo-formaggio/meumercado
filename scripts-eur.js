document.addEventListener('DOMContentLoaded', () => {
    loadShoppingList();
    updateTotal();

    document.getElementById('clear-list').addEventListener('click', clearList);
});

document.getElementById('shopping-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const item = document.getElementById('item').value;
    const unitPrice = parseFloat(document.getElementById('unit-price').value = 0);
    const quantity = parseInt(document.getElementById('quantity').value = 1);
    const subtotal = unitPrice * quantity;

    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
        <td><input type="checkbox" class="item-checkbox"></td>
        <td>${item}</td>
        <td><input type="text" inputmode="decimal" value="€ ${unitPrice.toFixed(2)}" class="unit-price"></td>
        <td><input type="number" inputmode="numeric" value="${quantity}" class="quantity"></td>
        <td class="subtotal">€ ${subtotal.toFixed(2)}</td>
        <td><button class="delete-btn">X</button></td>
    `;

    tableRow.querySelector('.unit-price').addEventListener('input', function(event) {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        value = (value / 100).toFixed(2);
        event.target.value = value;
    });

    document.getElementById('shopping-list').appendChild(tableRow);

    saveShoppingList();
    updateTotal();

    tableRow.querySelector('.delete-btn').addEventListener('click', function() {
        tableRow.remove();
        saveShoppingList();
        updateTotal();
    });

    tableRow.querySelector('.unit-price').addEventListener('input', function() {
        updateRowSubtotal(tableRow);
    });

    tableRow.querySelector('.quantity').addEventListener('input', function() {
        updateRowSubtotal(tableRow);
    });

    tableRow.querySelector('.item-checkbox').addEventListener('change', function() {
        saveShoppingList();
    });

    document.getElementById('shopping-form').reset();
});

// refactory da função para melhorar cifrão
function updateRowSubtotal(row) {
    let unitPriceInput = row.querySelector('.unit-price');
    let quantityInput = row.querySelector('.quantity');
    let subtotalElement = row.querySelector('.subtotal');

    const unitPrice = parseFloat(unitPriceInput.value.replace(/[^\d,.]/g, '')) || 0;
    const quantity = parseInt(quantityInput.value) || 1;
    const subtotal = unitPrice * quantity;

    unitPriceInput.value = `€ ${unitPrice.toFixed(2)}`;
    
    subtotalElement.textContent = `€ ${subtotal.toFixed(2)}`;

    saveShoppingList();
    updateTotal();
}

function updateTotal() {
    let total = 0;
    document.querySelectorAll('#shopping-list tr').forEach(function(row) {
        const subtotal = parseFloat(row.querySelector('.subtotal').textContent.replace('€', ''));
        total += subtotal;
    });
    document.getElementById('total').textContent = total.toFixed(2).replace(".", ",");
}

function saveShoppingList() {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const newItems = [];

    document.querySelectorAll('#shopping-list tr').forEach(function(row) {
        const item = row.children[1].textContent;
        const unitPrice = parseFloat(row.querySelector('.unit-price').value.replace(/[^\d.]/g, ''));
        const quantity = parseInt(row.querySelector('.quantity').value);
        const subtotal = unitPrice * quantity;
        const checked = row.querySelector('.item-checkbox').checked;

        // Adicionar novos itens a uma lista separada
        newItems.push({ item, unitPrice, quantity, subtotal, checked });
    });

    newItems.forEach(function(newItem) {
        const existingItemIndex = shoppingList.findIndex((i) => i.item === newItem.item);
        if (existingItemIndex !== -1) {
            // Atualiza o item existente
            shoppingList[existingItemIndex].quantity = newItem.quantity;
            shoppingList[existingItemIndex].subtotal = newItem.subtotal;
            shoppingList[existingItemIndex].unitPrice = newItem.unitPrice;
            shoppingList[existingItemIndex].checked = newItem.checked;
        } else {
            // Adiciona novo item à lista
            shoppingList.push(newItem);
        }
    });

    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

function loadShoppingList() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const shoppingListElement = document.getElementById('shopping-list');
    shoppingListElement.innerHTML = '';

    shoppingList.forEach(function(item) {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td><input type="checkbox" class="item-checkbox" ${item.checked ? 'checked' : ''}></td>
            <td>${item.item}</td>
            <td><input type="text" inputmode="decimal" value="€ ${item.unitPrice.toFixed(2)}" class="unit-price"></td>
            <td><input type="number" inputmode="numeric" value="${item.quantity}" class="quantity"></td>
            <td class="subtotal">€ ${item.subtotal.toFixed(2)}</td>
            <td><button class="delete-btn">X</button></td>
        `;

        tableRow.querySelector('.unit-price').addEventListener('input', function(event) {
            let value = event.target.value;
            value = value.replace(/\D/g, '');
            value = (value / 100).toFixed(2);
            event.target.value = value;
        });

        document.getElementById('shopping-list').appendChild(tableRow);

        tableRow.querySelector('.delete-btn').addEventListener('click', function() {
            const itemName = tableRow.children[1].textContent;
            removeItemFromStorage(itemName);
            tableRow.remove();
            saveShoppingList();
            updateTotal();
        });

        tableRow.querySelector('.unit-price').addEventListener('input', function() {
            updateRowSubtotal(tableRow);
        });

        tableRow.querySelector('.quantity').addEventListener('input', function() {
            updateRowSubtotal(tableRow);
        });

        tableRow.querySelector('.item-checkbox').addEventListener('change', function() {
            saveShoppingList();
        });
    });
    
}

// Código antigo antes, atualizado com sweet alert
// function clearList() {
//     let confirmation = confirm("Deseja excluir a lista completa?");
//     if (confirmation) {
//         document.getElementById('shopping-list').innerHTML = '';
//         localStorage.removeItem('shoppingList');
//         updateTotal();
//     }
// }

function clearList() {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Isso irá excluir toda a lista de compras!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    confirmButtonColor: 'rgb(250, 117, 117)',
    cancelButtonText: 'Cancelar',
    background: '#f4f4f4',
    width: '300px',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById('shopping-list').innerHTML = '';
      localStorage.removeItem('shoppingList');
      updateTotal();

      Swal.fire({
        title: 'Lista excluída com sucesso!',
        icon: 'success',
        timer: 1000,
        width: '300px',
        showConfirmButton: false
      });
    }
  });
}

// Teste para fazer download da lista e compartilhar com outras pessoas
document.getElementById('download-list').addEventListener('click', function() {
    const shoppingList = localStorage.getItem('shoppingList');
    if (shoppingList) {
        const blob = new Blob([shoppingList], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shoppingList.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert('Não existe lista de compras para Download.')
    }
});

document.getElementById('upload-list').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadedList = JSON.parse(e.target.result);
            const currentList = JSON.parse(localStorage.getItem('shoppingList')) || [];
            
            uploadedList.forEach(function(uploadedItem) {
                const existingItemIndex = currentList.findIndex((i) => i.item === uploadedItem.item);
                if (existingItemIndex !== -1) {
                    // Atualiza o item existente
                    currentList[existingItemIndex].quantity += uploadedItem.quantity;
                    currentList[existingItemIndex].subtotal += uploadedItem.subtotal;
                    currentList[existingItemIndex].unitPrice = uploadedItem.unitPrice;
                    currentList[existingItemIndex].checked = uploadedItem.checked;
                } else {
                    // Adiciona novo item à lista
                    currentList.push(uploadedItem);
                }
            });

            localStorage.setItem('shoppingList', JSON.stringify(currentList));
            loadShoppingList();
            updateTotal();
            alert('Lista de compras carregada com sucesso!');
        };
        reader.readAsText(file);
    }
});

function removeItemFromStorage(itemName) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

    // Filtra a lista para remover o item específico
    shoppingList = shoppingList.filter(item => item.item !== itemName);

    // Atualiza o localStorage com a nova lista sem o item removido
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// funçao para apagar listas
/*function clearList() {
    document.getElementById('shopping-list').innerHTML = '';
    localStorage.removeItem('shoppingList');
    updateTotal();
}*/

/* -- código rodando legal, antes do checkbox --

document.addEventListener('DOMContentLoaded', function() {
    loadShoppingList();
    updateTotal();
});

document.getElementById('shopping-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const item = document.getElementById('item').value;
    const unitPrice = parseFloat(document.getElementById('unit-price').value = 0);
    const quantity = parseInt(document.getElementById('quantity').value = 0);
    const subtotal = unitPrice * quantity;

    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
        <td>${item}</td>
        <td><input type="number" value="${unitPrice.toFixed(2)}" class="unit-price"></td>
        <td><input type="number" value="${quantity}" class="quantity"></td>
        <td class="subtotal">R$ ${subtotal.toFixed(2).replace(".", ",")}</td>
        <td><button class="delete-btn">X</button></td>
    `;

    document.getElementById('shopping-list').appendChild(tableRow);

    saveShoppingList();
    updateTotal();

    tableRow.querySelector('.delete-btn').addEventListener('click', function() {
        tableRow.remove();
        saveShoppingList();
        updateTotal();
    });

    tableRow.querySelector('.unit-price').addEventListener('input', function() {
        updateRowSubtotal(tableRow);
    });

    tableRow.querySelector('.quantity').addEventListener('input', function() {
        updateRowSubtotal(tableRow);
    });

    document.getElementById('shopping-form').reset();
});

function updateRowSubtotal(row) {
    const unitPrice = parseFloat(row.querySelector('.unit-price').value);
    const quantity = parseInt(row.querySelector('.quantity').value);
    const subtotal = unitPrice * quantity;
    row.querySelector('.subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    saveShoppingList();
    updateTotal();
}

function updateTotal() {
    let total = 0;
    document.querySelectorAll('#shopping-list tr').forEach(function(row) {
        const subtotal = parseFloat(row.querySelector('.subtotal').textContent.replace('R$', ''));
        total += subtotal;
    });
    document.getElementById('total').textContent = total.toFixed(2).replace(".", ",");
}

function saveShoppingList() {
    const shoppingList = [];
    document.querySelectorAll('#shopping-list tr').forEach(function(row) {
        const item = row.children[0].textContent;
        const unitPrice = parseFloat(row.querySelector('.unit-price').value);
        const quantity = parseInt(row.querySelector('.quantity').value);
        const subtotal = parseFloat(row.querySelector('.subtotal').textContent.replace('R$', ''));
        shoppingList.push({ item, unitPrice, quantity, subtotal });
    });
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

function loadShoppingList() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList.forEach(function(item) {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${item.item}</td>
            <td><input type="number" value="${item.unitPrice.toFixed(2)}" class="unit-price"></td>
            <td><input type="number" value="${item.quantity}" class="quantity"></td>
            <td class="subtotal">R$ ${item.subtotal.toFixed(2).replace(".", ",")}</td>
            <td><button class="delete-btn">X</button></td>
        `;
        document.getElementById('shopping-list').appendChild(tableRow);

        tableRow.querySelector('.delete-btn').addEventListener('click', function() {
            tableRow.remove();
            saveShoppingList();
            updateTotal();
        });

        tableRow.querySelector('.unit-price').addEventListener('input', function() {
            updateRowSubtotal(tableRow);
        });

        tableRow.querySelector('.quantity').addEventListener('input', function() {
            updateRowSubtotal(tableRow);

    */