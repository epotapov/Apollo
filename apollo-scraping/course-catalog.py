import os
import pdfplumber
import re
import json

# Define the regular expression pattern
pattern = r'([A-Z]{2,}\s+\d{5})\s*-\s*(.*?)\s*Credit Hours:\s*([\d.]+)\s*(.*?)\s*(?=\n[A-Z]{2,}\s+\d{5}\s*-|\Z)'

# Define the PDF file path
pdf_path = os.path.expanduser('Courses+2022-23.pdf')

# Define a list to store the class data
classes = []

# Open the PDF file
with pdfplumber.open(pdf_path) as pdf:
    # Iterate over each page
    for page in pdf.pages:
        # Extract the text from the page
        text = page.extract_text()
        # Find all the classes in the text
        matches = re.findall(pattern, text, flags=re.DOTALL)
        print(f"Found {len(classes)} classes on page {page.page_number}.")
        # Add the classes to the list
        for match in matches:
            course = match[0].replace(" ", "")
            title = match[1].strip()
            credit_hours = match[2].strip()
            credit_hours = credit_hours[0:-1]
            try:
                credit_hours = float(credit_hours)
            except:
                continue
            description = match[3].strip()
            class_data = {
                'Course': course,
                'Title': title,
                'CreditHours': credit_hours,
                'Description': description
            }
            classes.append(class_data)

# Print the list of classes as JSON
# print(json.dumps(classes, indent=2))
with open('classes.txt', 'w') as f:
    json.dump(classes, f, indent=2)