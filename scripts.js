document.addEventListener('DOMContentLoaded', function() {
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
        <td><input type="text" inputmode="decimal" value="${unitPrice.toFixed(2)}" class="unit-price"></td>
        <td><input type="number" inputmode="numeric" value="${quantity}" class="quantity"></td>
        <td class="subtotal">R$ ${subtotal.toFixed(2)}</td>
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
        const item = row.children[1].textContent;
        const unitPrice = parseFloat(row.querySelector('.unit-price').value);
        const quantity = parseInt(row.querySelector('.quantity').value);
        const subtotal = parseFloat(row.querySelector('.subtotal').textContent.replace('R$', ''));
        const checked = row.querySelector('.item-checkbox').checked;
        shoppingList.push({ item, unitPrice, quantity, subtotal, checked });
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
            <td><input type="text" inputmode="decimal" value="${item.unitPrice.toFixed(2)}" class="unit-price"></td>
            <td><input type="number" inputmode="numeric" value="${item.quantity}" class="quantity"></td>
            <td class="subtotal">R$ ${item.subtotal.toFixed(2)}</td>
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

function clearList() {
    let confirmation = confirm("Deseja excluir a lista completa?");
    if (confirmation) {
        document.getElementById('shopping-list').innerHTML = '';
        localStorage.removeItem('shoppingList');
        updateTotal();
    }
    
}
// Teste para fazer download da lista e compartilhar com outras pessoas
document.getElementById('download-list').addEventListener('click', function() {
    const shoppingList = localStorage.getItem('shoppingList');
    const blob = new Blob([shoppingList], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shoppingList.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

document.getElementById('upload-list').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('shoppingList', e.target.result);
            loadShoppingList();
            updateTotal();
            alert('Lista de compras carregada com sucesso!');
        };
        reader.readAsText(file);
    }
});


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