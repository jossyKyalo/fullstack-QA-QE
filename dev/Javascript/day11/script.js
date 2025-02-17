const user = {
    id: "USER-123456",
    name: {
        first: "Alice",
        last: "Liddell"
    },
    email: "alice@example.com",
    address: {
        shipping: {
            street: "123 Rabbit Hole",
            city: "Wonderland",
            state: "Fantasy",
            postalCode: "12345",
            country: "WL"
        },
        billing: {
            street: "456 Mad Hatter Lane",
            city: "Tea Party",
            state: "Fantasy",
            postalCode: "67890",
            country: "WL"
        }
    },
    payment: {
        total: "100.00",
        currency: "USD",
        details: {
            subtotal: "75.00",
            tax: "15.00",
            shipping: "10.00"
        },
        transactions: [
            {
                id: "TXN-123", amount: "50.00", description: "Magic Potion"
            },
            {
                id: "TXN-456", amount: "50.00", description: "EnchantedSword"
            }
        ]
    }
};
//destructuring
const {
    id,
    name: {
        first,
        last
    },
    email
} = user;
//shipping
const {
    address: {
        shipping: {
            street,
            city,
            state,
            postalCode,
            country
        }
    }
} = user;

//billing
const {
    address: {
        billing
    }
} = user;
//transaction
const {
    payment: {
        transactions
    }
} = user;
//document get element by ID
document.getElementById('personal-info').innerHTML = `
<h2>Personal Info</h2>
<p>Name: ${first} ${last}</p>
<p>ID: ${id}</p>
<p>Email:${email}</p>
`;

document.getElementById('shipping-address').innerHTML = `
<h2>Shipping details</h2>
<p>Street: ${street}</p>
<P>City: ${city}</p>
<p>State: ${state}</p>
<p>Postal Code: ${postalCode}</p>
<p>Country: ${country}</p>
`
document.getElementById('billing-address').innerHTML = `
<h2>Billing</h2>
<p>Street: ${billing.street}</p>
<P>City: ${billing.city}</p>
<p>State: ${billing.state}</p>
<p>Postal Code: ${billing.postalCode}</p>
<p>Country: ${billing.country}</p>
`
document.getElementById('transactions').innerHTML = `
<h2>Transacations</h2>
<ul>
${transactions.map(ts =>
    '<li>${ts.id}: ${ts.description}- $${ts.amount}</li>').join("")
    }
</ul>
`;


const transactionsSection = document.getElementById("transactions");
const transactionList = transactions
    .map(transactions => `<li><strong>${transactions.description}:</strong> $${transactions.amount} (ID: ${transactions.id})</li>`)
    .join("");


transactionsSection.innerHTML = 
        `<h2>Transactions</h2>
        <ul>${transactionList}</ul>`