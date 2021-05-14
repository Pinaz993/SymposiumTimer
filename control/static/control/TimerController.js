// Load Program Form Submit Event Listener
document.getElementById("load-program-form").addEventListener("submit", ev => {
    // First, don't actually load anything, even the top of the page.
    ev.preventDefault();
    // TODO: implement program loading from clientside test "database".
});

function temp_load_prog(prog_id) {
    // This will load programs from the test dataset. Temporary™.

}

// Manual Timer Form Submit Event Listener
document.getElementById("manual-timer-form").addEventListener("submit", ev => {
    // Not actually doing anything by default should really be an HTML element attribute, like defer.
    ev.preventDefault();
    // TODO: implement manual timer clientside logic.

});

// Make the table for the timers to sit in, along with all the options. Const, because we'll never be replacing it.
const timer_table = new Tabulator("#schedule-table", {
    columns:[
        {field:"order", visible:false, sorter:"number"},
        {field:"lable", headerSort:false, title:"Label"},
        {field:"duration", headerSort:false, title:"Duration"}
    ],
    initialSort:[
        {column: "order", dir:"asc"}
    ],
})
// Temporary™ Client Side Setup
// At this point in the game, our page and all dependant files have loaded. Users can't access this page without logging
// in, so we shouldn't have anyone here who shouldn't be. Since we're testing client side only, we're going to take it
// as a given that we're able to get a connection to the websocket side of the server. Thus, we also have a list of
// all programs in the database. Let's fake that with a clientside array of dictionaries representing programs.
let programs = [
    {
        id: 1,
        name: "Black Hat USA 2021",
        timers: [
            {order:1, label: "Running Doom on a Nest Thermostat", duration: 1800},
            {order:2, label: "Your Daily Dose of Printer-based Outrage", duration: 1500},
            {order:3, label: "This is how long it takes to hack a cheap router", duration: 30},
            {order:4, label: "Hacking a FishBot with WorM", duration: 300},
        ]
    },
    {
        id: 2,
        name: "DEF CON 29",
        timers: [
            {order:1, label: "Home routers are still insecure", duration: 300},
            {order:2, label: "Smart Rice Cookers are Dangerous: Here's Why", duration: 300},
            {order:3, label: "Secure Networks Behind Insecure Doors", duration: 300},
            {order:4, label: "Pwning Noobs in the Elevator", duration: 300},
        ]
    },
    {
        id: 3,
        name: "SANS Purple Team Summit and Training 2021",
        timers: [
            {order:1, label: "Smart Engineers Sometimes Do Dumb Things", duration: 300},
            {order:2, label: "Epoxy Resin is not a Security Feature", duration: 300},
            {order:3, label: "Firewall: How to Slip Past A National Censor", duration: 300},
            {order:4, label: "My Tesla can Hack Your Tesla", duration: 300},
        ]
    },
    {
        id: 4,
        name: "CyberCon VI",
        timers: [
            {order:1, label: "Poorly Engineered Web Services Are Getting Worse", duration: 300},
            {order:2, label: "Cracking the Crypto: An attack on the Monero Community", duration: 300},
            {order:3, label: "Grabbing Credentials 101", duration: 300},
            {order:4, label: "With the Push of a Button: One Touch Pwning", duration: 300},
        ]
    }
];
// Now that we have our programs, we can feed them into the load program dropdown list.
programs.forEach(e => {
    let prog = document.createElement("option");
    prog.text = e.name;
    prog.value = e.id;
    document.getElementById("select-program-list").appendChild(prog);
});
