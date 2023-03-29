# course-scraper.py
__author__ = "jebeene"

# imports
import csv
import json
import os
import pdfplumber
import re
from tqdm import tqdm


def get_course_code(course_name: str) -> str:
    """Returns the course code from the course name."""
    # Match one or more uppercase letters followed by one or more digits
    matched = re.search(r"[A-Z]+\s*\d+", course_name)
    if matched:
        # Remove any whitespace from the course code
        return matched.group(0).replace(" ", "")
    else:
        return None


# file names
pdf_courses = "raw-courses.json"
csv_file_path = "./csv-files"
final_merge = "final-merged.json"

# Define the regular expression pattern
pattern = r'([A-Z]{2,}\s+\d{5})\s*-\s*(.*?)\s*Credit Hours:\s*([\d.]+)\s*(.*?)\s*(?=\n[A-Z]{2,}\s+\d{5}\s*-|\Z)'

# Define the PDF file path
pdf_path = os.path.expanduser('Courses+2022-23.pdf')

# Define a list to store the class data
classes = []

# scrape from pdf file
if not os.path.isfile(pdf_courses):
    with pdfplumber.open(pdf_path) as pdf:
        # Iterate over each page
        for page in tqdm(pdf.pages, desc="Scraping pages", unit="page"):
            # Extract the text from the page
            text = page.extract_text()
            # Find all the classes in the text
            matches = re.findall(pattern, text, flags=re.DOTALL)
            # Add the classes to the list
            for match in matches:
                course = match[0].replace(" ", "")
                title = match[1].strip()
                credit_hours = match[2].strip()
                credit_hours = credit_hours[0:-1]

                # we don't want study abroad courses
                if not course[:2] == "SA":
                    try:
                        credit_hours = float(credit_hours)
                    except ValueError as e:
                        continue
                    description = match[3].strip()
                    find_typically_offered = re.search(r'Typically offered ([A-Za-z, ]+)', description)
                    if find_typically_offered:
                        typically_offered = find_typically_offered.group(1)
                    else:
                        typically_offered = "Unknown"
                    class_data = {
                        "Course": course.replace(" ", ""),
                        "Title": title,
                        "CreditHours": credit_hours,
                        "Description": description,
                        "TypicallyOffered": typically_offered,
                    }
                    # Remove "Credits: " and any float value after it from the description
                    if description:
                        class_data["Description"] = re.sub(r'Typically offered .*$','', description).strip()
                        class_data["Description"] = re.sub(r"Credits:\s*\d+(\.\d+)?", "", class_data["Description"]).strip()

                    if typically_offered:
                        class_data["TypicallyOffered"] = re.sub(r"Credits:\s*\d+(\.\d+)?", "", typically_offered).strip()
                    classes.append(class_data)
                    # Add the "Sections" key to each course object

            # Write the merged course data to a new JSON file
            with open(pdf_courses, 'w') as outputFile:
                json.dump(classes, outputFile, indent=4)

else:
    print(pdf_courses + " exists..merging with csv")

# CONVERT CSV TO JSON
# Read in raw course data
# Load the raw course data from the JSON file
with open(pdf_courses, "r") as f:
    raw_course_data = json.load(f)

# Add the "Sections" key to each course object
for course in raw_course_data:
    course["Sections"] = []
    course["SectionDict"] = {}  # Create a dictionary to store unique sections for each course

# Create a dictionary mapping course codes to course objects
course_map = {course["Course"]: course for course in raw_course_data}

# Process the CSV file and update the course objects
for file in tqdm(os.listdir(csv_file_path), desc="Converting CSV to JSON", unit="files"):
    if file.endswith(".csv"):
        csv_file = os.path.join(csv_file_path, file)
        with open(csv_file, "r") as f:
            csv_reader = csv.DictReader(f)
            next(csv_reader)  # Skip the header row
            for rows in csv_reader:
                course_code = get_course_code(rows["Name"])
                if course_code and rows["Type"] == "Lecture":
                    course = course_map.get(course_code)
                    if course:
                        section = {
                            "Section": rows["Section"],
                            "Days": rows["Day Of Week"],
                            "StartTime": rows["Published Start"],
                            "EndTime": rows["Published End"],
                            "Location": rows["Location"],
                            "Instructor": rows["Instructor / Organization"].replace('(Instr)', '').strip(),
                            "InstructorEmail": rows["Email"]
                        }
                        # Check if the section already exists before adding it to the "Sections" list
                        if section["Section"] not in course["SectionDict"]:
                            course["Sections"].append(section)
                            course["SectionDict"][section["Section"]] = True


# Create a list to hold the final output course data
final_course_data = []

# Iterate over the original course data list
for course in raw_course_data:
    # Check if the course has been updated with new sections
    if course["Sections"]:
        # Remove the "SectionSet" key from the course object
        del course["SectionDict"]
        final_course_data.append(course)
    else:
        # If the course hasn't been updated, add it to the final list as-is
        final_course_data.append({
            "Course": course["Course"],
            "Title": course["Title"],
            "CreditHours": course["CreditHours"],
            "Description": course["Description"],
            "TypicallyOffered": course["TypicallyOffered"],
            "Sections": []
        })

# Write the updated course data to the output JSON file
with open(final_merge, "w") as f:
    json.dump(final_course_data, f, indent=2)

