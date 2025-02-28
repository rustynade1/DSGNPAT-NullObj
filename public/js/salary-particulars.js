document.addEventListener("DOMContentLoaded", async function () {
    let NullEmployee = {}; // Placeholder until fetched

    async function fetchNullEmployee() {
        try {
            const response = await fetch("/null-employee");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            NullEmployee = await response.json();
        } catch (error) {
            console.error("Error fetching Null Employee:", error);
        }
    }

    function updateEmployeeDetails() {
        // // Read existing values from the DOM
        const nameElement = document.getElementById("employee-name");
        const emailElement = document.getElementById("employee-email");
        const typeElement = document.getElementById("employee-type");

         // Check if values are missing or empty
         if (!nameElement.innerText.trim()) {
            nameElement.innerText = `${NullEmployee.First_Name} ${NullEmployee.Last_Name}`;
        }
        if (!emailElement.innerText.trim()) {
            emailElement.innerText = NullEmployee.Email;
        }
        if (!typeElement.innerText.trim()) {
            typeElement.innerText = NullEmployee.Employee_Type;
        }       

        //DEBUG: set to null object (comment all above code and uncomment below code)
        // const nameElement = NullEmployee.First_Name + " " + NullEmployee.Last_Name;
        // const emailElement = NullEmployee.Email;
        // const typeElement = NullEmployee.Employee_Type;

        // // Update the DOM
        // document.getElementById("employee-name").innerText = nameElement;
        // document.getElementById("employee-email").innerText = emailElement;
        // document.getElementById("employee-type").innerText = typeElement;


    }

    async function fetchSalaryParticulars() {
        try {
            const response = await fetch("/salary_particulars");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const html = await response.text();

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            const fetchedContent = tempDiv.querySelector(".left-payroll.salary-container");
            const existingContainer = document.querySelector(".left-payroll.salary-container");

            if (fetchedContent && existingContainer) {
                existingContainer.replaceWith(fetchedContent);
            } else {
                console.warn("Could not find salary-container in fetched or existing HTML.");
            }

            updateEmployeeDetails(); // Ensure UI updates correctly
            setupPrintFunction();
        } catch (error) {
            console.error("Error fetching salary particulars:", error);
        }
    }

    function setupPrintFunction() {
        const printButton = document.getElementById("print-button");
        if (printButton) {
            printButton.addEventListener("click", printSalaryParticular);
        }
    }

    function printSalaryParticular(event) {
        event.preventDefault();

        const salarySlip = document.getElementById("salary-slip");

        if (salarySlip) {
            const printWindow = window.open("", "", "height=600,width=800");
            printWindow.document.write("<html><head><title>Salary Particulars</title>");
            printWindow.document.write('<link rel="stylesheet" href="/css/style.css">');
            printWindow.document.write("</head><body>");
            printWindow.document.write('<div class="salary-container">');
            printWindow.document.write("<h1>Employee Salary Particulars</h1>");
            printWindow.document.write(`<p><strong>Name:</strong> ${document.getElementById("employee-name").innerText}</p>`);
            printWindow.document.write(`<p><strong>Email:</strong> ${document.getElementById("employee-email").innerText}</p>`);
            printWindow.document.write(`<p><strong>Employee Type:</strong> ${document.getElementById("employee-type").innerText}</p>`);
            printWindow.document.write(salarySlip.innerHTML);
            printWindow.document.write("</div>");
            printWindow.document.close();
            printWindow.print();
        } else {
            console.error("Required element salary-slip not found for printing.");
        }
    }

    async function init() {
        await fetchNullEmployee(); // Fetch NullEmployee fallback data
        await fetchSalaryParticulars(); // Update salary details and employee info
    }

    await init(); // Run initialization
});
