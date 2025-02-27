document.addEventListener("DOMContentLoaded", function () {
    fetch("/salary_particulars")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Create a temporary container to hold the fetched HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Find the specific part of the fetched HTML you want to append
            const fetchedContent = tempDiv.querySelector('.left-payroll.salary-container');

            // Append the fetched content to the existing container
            document.querySelector('.left-payroll.salary-container').replaceWith(fetchedContent);

            setupPrintFunction();
        })
        .catch(error => {
            console.error('Error fetching /salary_particulars', error);
        });

        async function setupPrintFunction() {
            var printButton = document.getElementById("print-button");
            if (printButton) {
                printButton.addEventListener('click', printSalaryParticular);
            }
        
            async function getEmployeeDetails(employeeId) {
                try {
                    const response = await fetch(`/employees/${employeeId}`);
                    if (!response.ok) throw new Error("Employee not found");
                    return await response.json();
                } catch (error) {
                    console.warn("USING NULL EMPLOYEE:", error.message);
                    
                    const nullEmployeeResponse = await fetch(`/employees/null`);
                    return await nullEmployeeResponse.json();
                }
            }
        
            async function printSalaryParticular(event) {
                event.preventDefault();
        
                const employeeId = document.getElementById('employee-id')?.value;
                const salarySlip = document.getElementById('salary-slip');
        
                // fetch employee details (handles null automatically)
                const employee = await getEmployeeDetails(employeeId);
                const salaryContent = salarySlip ? salarySlip.innerHTML : "<p>No salary details available.</p>";
        
                const printWindow = window.open('', '', 'height=600,width=800');
                printWindow.document.write('<html><head><title>Salary Particulars</title>');
                printWindow.document.write('<link rel="stylesheet" href="/css/style.css">');
                printWindow.document.write('</head><body>');
                printWindow.document.write('<div class="salary-container">');
                printWindow.document.write('<h1>Employee Salary Particulars</h1>');
                printWindow.document.write(`<p><strong>Name:</strong> ${employee.First_Name} ${employee.Last_Name}</p>`);
                printWindow.document.write(`<p><strong>Email:</strong> ${employee.Email}</p>`);
                printWindow.document.write(`<p><strong>Employee Type:</strong> ${employee.Employee_Type}</p>`);
                printWindow.document.write(salaryContent);
                printWindow.document.write('</div>');
                printWindow.document.close();
                printWindow.print();
            }
        }
        
});
