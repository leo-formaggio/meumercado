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
        });
    });
}